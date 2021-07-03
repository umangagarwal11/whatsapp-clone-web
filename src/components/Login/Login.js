import React,{useState} from 'react';
import classes from './Login.module.css';
import {auth, db} from '../../firebase';
import {useDispatch} from 'react-redux';
import{login} from '../../features/userSlice.js'

function Login() {

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const dispatch = useDispatch();

  const logintoapp = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email,pass)
    .then(userAuth => {
        dispatch(
          login({
            email: userAuth.user.email,
            uid: userAuth.user.uid,
            displayName: userAuth.user.displayName,
            photoUrl: userAuth.user.photoURL
          })
        );
    }).catch(err => alert(err.message));
  }

  const register = (e) => {
    e.preventDefault();
    if (!name){
      return alert('Name can not be empty');
    }
    auth.createUserWithEmailAndPassword(email,pass)
    .then(userAuth => {

      userAuth.user.updateProfile({
        displayName: name,
        photoURL: url
      })
      .then(() => {
        db.collection('users').doc(userAuth.user.uid).set({
          displayName: userAuth.user.displayName,
          photoUrl: userAuth.user.photoURL,
          chats: []
        });
        dispatch(
          login({
            email: userAuth.user.email,
            uid: userAuth.user.uid,
            displayName: userAuth.user.displayName,
            photoUrl: userAuth.user.photoURL
          })
        );
      });

    })
    .catch(err => alert(err.message));
  }

  return (
    <div className = {classes.login}>
      <form onSubmit={logintoapp}>
        <input type="text" placeholder="Full name(Required if registering)" onChange={e => setName(e.target.value)}/>
        <input type="url" placeholder="Profile Picture URL(Optional)" onChange={e => setUrl(e.target.value)}/>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)}/>
        <input type="password" placeholder="Password" onChange={e => setPass(e.target.value)}/>
        <button type="submit">Signin</button>
      </form>
      <p>Not a member? <span className={classes.login_register} onClick={register}>Register Now</span></p>
      <a className={classes.apk_link} href= "https://drive.google.com/file/d/1C77LGw7iAqqLisAFpTCBWp3HLAhg2ZGS/view?usp=sharing">APK for Native Android App</a>
    </div>
  );
}

export default Login;
