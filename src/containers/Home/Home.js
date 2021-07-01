import React, {useEffect, Fragment} from 'react';
import classes from './Home.module.css';
import LeftBar from '../../components/LeftBar/LeftBar';
import Main from '../../components/Main/Main';
import {auth} from '../../firebase';
import {useSelector, useDispatch} from 'react-redux';
import {login, logout, selectUser} from '../../features/userSlice';
import Login from '../../components/Login/Login';

function Home(){

  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {

    auth.onAuthStateChanged(userAuth => {
      if (userAuth){
          dispatch(login({
            email: userAuth.email,
            uid: userAuth.uid,
            displayName: userAuth.displayName,
            photoUrl: userAuth.photoURL
          }));
      } else {
          dispatch(logout());
      }
    });


  },[])

    return (
      <div className={classes.Home}>
        {!user ? <Login />
          :<Fragment>
              <LeftBar />
              <Main />
            </Fragment>
        }
      </div>
    )
}

export default Home;
