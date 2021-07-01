import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import chatReducer from '../features/chatSlice';
import chatNameReducer from '../features/chatNameSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    chatName: chatNameReducer
  },
});
