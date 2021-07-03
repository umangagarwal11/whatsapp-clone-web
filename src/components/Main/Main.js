import React, {Component, useEffect, useState} from 'react';
import classes from './Main.module.css';
import {Avatar} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import {useSelector} from 'react-redux';
import {selectUser} from '../../features/userSlice';
import { selectChat } from '../../features/chatSlice';
import { selectChatName } from '../../features/chatNameSlice';
import { db } from '../../firebase';
import firebase from 'firebase';
import moment from 'moment';

function Main() {

  const user = useSelector(selectUser);

  const chat = useSelector(selectChat);

  const chatName = useSelector(selectChatName);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    db.collection('chatMessages/'+chat+'/messages').orderBy('timestamp', 'desc').limit(50).onSnapshot(snapshot => {
      setMessages(snapshot.docs.map(doc => {
        const a = doc.data();
        return (!a.timestamp)?{
          id: doc.id,
          data: {...a,timestamp:{seconds: Math.floor(Date.now()/1000)} }
        }:{
          id: doc.id,
          data: a
        }
      }))
    })
  }, [chat]);

  const Default = () => (
    <div className={classes.overlay}>
    <div className = {classes.default} >
      <Avatar src={user.photoUrl} className={classes.avatar}/>
      <p>Start a new chat</p>
    </div>
    </div>
  );

  const Top = () => (
    <div className={classes.chat_top} >
      <Avatar src={chatName.photoUrl}>{chatName.displayName[0]}</Avatar>
      <div className={classes.chat_right}>
        <p>{chatName.displayName}</p>
      </div>
    </div>
  );

  const Bottom = () => {
    
    const [input, setInput] = useState('');

    const sendText = (e) => {
      e.preventDefault();

      if(input.length === 0)
        return;

      db.collection('chatMessages/' + chat + '/messages').add({
        sentBy: user.uid,
        message: input,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      db.collection('users').doc(user.uid).get().then(doc =>{
        var a = doc.data();
        a.chats.every(o => {
          if(o.chatID === chat){
            o.timestamp = {seconds: Date.now()};
            o.last = input;
            db.doc('users/'+user.uid).update({
              chats: a.chats
            })
            return false;
          }
          return true;
        })
      })
      db.collection('users').doc(chatName.reciever).get().then(doc => {
        var a = doc.data();
        a.chats.every(o => {
          if (o.chatID === chat) {
            o.timestamp = { seconds: Date.now() };
            o.last = input;
            db.doc('users/' + chatName.reciever).update({
              chats: a.chats
            })
            return false;
          }
          return true;
        })
      })
      setInput('');
    }

    return(
      <div className={classes.chat_bottom} >
        <form onSubmit = {sendText}>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Send a new message"  />
          <button type="submit" > Send</button>
        </form>
        <SendIcon onClick = {sendText}/>
      </div>
    );
  };

  const Chat = () => {
    
    return <div className={classes.chat_main}>{
      messages.map(o=>{
        const time = new Date(o.data.timestamp.seconds * 1000);
          //console.log(o);
          return (o.data.sentBy===user.uid)?(
            <div style={{"width":'100%'}} key={o.id}>
              <div className = {classes.message_sent} key={o.id}>
                {o.data.message}<br></br>
                <span>{(time.getDate() === new Date().getDate()) ? moment(time).format("h:mm A") : moment(time).format("DD/MM/YY h:mm A")}</span>
              </div>
            </div>
          ):(
            <div className={classes.message_recieved} key={o.id}>
              {o.data.message}<br></br>
                <span>{(time.getDate() === new Date().getDate()) ? moment(time).format("h:mm A") : moment(time).format("DD/MM/YY h:mm A")}</span>
            </div>
          )
      })
      }</div>
  };

  const ChatView = () => (
    <div className={classes.overlay}>
    <div className = {classes.chatView} >
      <Top />
      <Chat />
      <Bottom />
    </div>
    </div>
  )

  return (
    <div className={classes.Main}>
      {!chat ? Default(): ChatView()}
    </div>
  );
}

export default Main;
