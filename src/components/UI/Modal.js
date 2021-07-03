import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { set } from '../../features/chatSlice';
import { setName } from '../../features/chatNameSlice';
import { selectUser } from '../../features/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import LeftItem from '../LeftBar/LeftItem/LeftItem';
import {db} from '../../firebase';

function getModalStyle() {
  const top = 40;
  const left = 47.5;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '40%',
    height: '60%',
    backgroundColor: 'white',
    border: 'none',
    outline: 'none',
    display:'flex',
    flexDirection: 'column',
    boxShadow: theme.shadows[5],
  },
  modalHeader:{
    backgroundColor: '#008B8B',
    color: 'white',
    padding: '3% 5%',
    flex:'0.05',
  },
  modalBody:{
    padding:'0',
    flex:'1',
    display:'flex',
    flexDirection:'column',
    overflow: 'auto'
  },
  modalButton:{
    margin:"2% 40%",
    color: '#008B8B',
    flex:'0.05',
    width: '20%',
    borderColor: '#008B8B',
  }
}));

export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [userChats, setUserChat] = React.useState([]);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  React.useEffect(() => {
    db.collection('users').orderBy('displayName').onSnapshot(snapshot => {
      setUsers(snapshot.docs.map(doc => (
        {
          id: doc.id,
          data: doc.data()
        }
      )))
    })

    db.doc("users/" + user.uid).onSnapshot(doc => {
      setUserChat(doc.data().chats.map(o => o.chatID))
    })
  },[])

  const chatSetter = (id, pic, name, reciever) => {
    dispatch(set(id))
    dispatch(setName({
      photoUrl: pic,
      displayName: name,
      reciever: reciever
    }))
    setOpen(false);
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let button = null;
  let body=null;

  if(props.type==="newChat"){

    const userList = users.map(o => {
      return (o.id === user.uid) ? null : <LeftItem {...o.data} id={o.id} user={user} chatSetter={chatSetter} newchat key={o.id} userChats = {userChats}/>;
  })

    body = (
      <div style={modalStyle} className={classes.paper}>
        <h2 id="simple-modal-title" className={classes.modalHeader}>Start a New Chat</h2>
        <div id="simple-modal-description" className={classes.modalBody}>
          {userList}
        </div>
        <Button onClick={handleClose} variant="outlined" className={classes.modalButton}>
          Cancel
        </Button>
      </div>
    );

    button = <AddCircleOutlineIcon fontSize="large" onClick={handleOpen} className={props.classes} />

  }

  return (
    <div>
      {button}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
