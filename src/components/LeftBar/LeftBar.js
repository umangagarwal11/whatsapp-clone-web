import React, {useState,useEffect} from 'react';
import classes from './LeftBar.module.css';
import LeftItem from './LeftItem/LeftItem';
import {useSelector, useDispatch} from 'react-redux';
import {logout, selectUser} from '../../features/userSlice';
import {set} from '../../features/chatSlice';
import {setName} from '../../features/chatNameSlice';
import {auth, db} from '../../firebase';

function LeftBar() {

  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const [searchValue, setSearch] = useState('');

  const searchChange = (e) => {
    setSearch(e.target.value);
  }

  const [chats, setChats]=useState(null);

  const logoutHandler = () => {
    dispatch(logout());
    dispatch(set(null));
    auth.signOut();
  }

  const chatSetter = (id, pic, name, reciever) => {
    dispatch(set(id))
    dispatch(setName({
      photoUrl: pic,
      displayName: name,
      reciever: reciever
    }))
  }

  useEffect(() => {
    db.collection('users').doc(user.uid).onSnapshot(snapshot => {
      let x = snapshot.data();
      if(x){
        setChats(x.chats.map(doc => {
          console.log(doc);
          return {
            ...doc
          };
        }))
      }
    })
  },[]);

  return (
    <div className={classes.LeftBar}>
      <LeftItem top src={user.photoUrl}/>
      <LeftItem search searchValue={searchValue} searchChange={searchChange} />
      <div className={classes.chatList} >
        {chats ?
          chats.sort((a,b) => b.timestamp.seconds-a.timestamp.seconds).map(o => {
            return (o.displayName.toLowerCase().indexOf(searchValue.toLowerCase())===0)?
                    <LeftItem {...o} chatSetter={chatSetter} chat key={o.chatID}/>:null;
          })
          :null
        }
      </div>
      <LeftItem bottom logout={logoutHandler}/>
    </div>
  );
}

export default LeftBar;
