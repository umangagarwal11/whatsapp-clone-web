import React,{Fragment} from 'react';
import classes from './LeftItem.module.css';
import SearchIcon from '@material-ui/icons/Search';
import {Avatar} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import SimpleModal from '../../UI/Modal';
import { db } from '../../../firebase';
import firebase from 'firebase';

function LeftBar(props) {
  const style=[classes.LeftItem];
  let content=null;
  let onclick={};

  if (props.top){

    style.push(classes.top);
    content = (<Fragment>
                  <Avatar src={props.src}/>
                  <SimpleModal classes={classes.new_message} type="newChat"/>
                </Fragment>);
  }

  if (props.search){
    style.push(classes.search);
    content = (<div className = {classes.header_search}>
                    <SearchIcon />
                    <input type="text" placeholder="Search" value={props.searchValue} onChange={props.searchChange}/>
                </div>);
  }

  if (props.chat){
    style.push(classes.chat);
    content = (<Fragment>
                <Avatar src={props.photoUrl}>{props.displayName[0]}</Avatar>
                <div className={classes.chat_right}>
                  <p style={{'fontWeight': '550'}}>{props.displayName}</p>
                  <p style={{'color': '#555'}}>{(props.last.length>25)?props.last.substring(0,25)+'...':props.last}</p>
                  <span className={classes.timestamp}>
                    {new Date(props.timestamp.seconds).toLocaleTimeString([],{hour: 'numeric', minute: 'numeric', hour12: true})}
                  </span>
                </div>
              </Fragment>);
    onclick = { onClick: () => props.chatSetter(props.chatID, props.photoUrl, props.displayName, props.reciever)}
  }

  if (props.newchat) {
    style.push(classes.chat);

    const createNewChat = (reciever,sender) => {
      const id = (reciever>sender) ? (sender + '___' + reciever) : (reciever + '___' + sender);
      db.collection('users').doc(sender).update({
        chats: firebase.firestore.FieldValue.arrayUnion({ chatID: id, displayName: props.displayName, reciever: reciever, photoUrl: props.photoUrl, timestamp: {seconds:Date.now()}, last: ""})
      });
      db.collection('users').doc(reciever).update({
        chats: firebase.firestore.FieldValue.arrayUnion({ chatID: id, displayName: props.user.displayName, reciever: sender, photoUrl: props.user.photoUrl, timestamp: { seconds: Date.now() }, last: ""})
      });
      props.chatSetter(id,props.photoUrl,props.displayName, reciever);
    }

    content = (<Fragment>
      <Avatar className={classes.newChat_left} src={props.photoUrl}>{props.displayName[0]}</Avatar>
      <div className={classes.newChat_right}>
        <p>{props.displayName}</p>
      </div>
    </Fragment>);
    onclick = { onClick: () => createNewChat(props.id,props.user.uid) }
  }

  if (props.bottom){
    style.push(classes.bottom);
    content = (<Fragment>
                  <PersonIcon fontSize='large' />
                  <ExitToAppIcon fontSize='large' className={classes.logout} onClick={props.logout}/>
                </Fragment>);
  }

  return (
    <div className={style.join(" ")} {...onclick}>
      {content}
    </div>
  );
}

export default LeftBar;
