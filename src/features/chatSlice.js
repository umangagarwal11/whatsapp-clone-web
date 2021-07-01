import { createSlice } from '@reduxjs/toolkit';

export const chatSlice = createSlice({
  name: 'chatID',
  initialState: {
    chatID: null,
  },
  reducers: {
    set: (state,action) => {
      state.chatID = action.payload;
    },
  },
});

export const { set } = chatSlice.actions;

export const selectChat = state => state.chat.chatID;

export default chatSlice.reducer;
