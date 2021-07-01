import { createSlice } from '@reduxjs/toolkit';

export const chatNameSlice = createSlice({
    name: 'chatName',
    initialState: {
        chatName: null,
    },
    reducers: {
        setName: (state, action) => {
            state.chatName = action.payload;
        },
    },
});

export const { setName } = chatNameSlice.actions;

export const selectChatName = state => state.chatName.chatName;

export default chatNameSlice.reducer;