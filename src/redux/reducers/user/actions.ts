import { createSlice } from '@reduxjs/toolkit';
import { stat } from 'fs';

const initialState: UserInitialState[] = [];

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logInUser: (state, action) => {
      const { payload }: { payload: UserInitialState } = action;
      state.push({
        name: payload.email,
        email: payload.email,
        rank: 'A',
        phone: ''
      })

    },
    createUser: (state, action) => {
      const { payload }: { payload: UserInitialState } = action;
      state.push(payload);
    },
    updateUser: (state, action) => {

    },
    deleteUser: (state, action) => {
      const { payload }: { payload: UserInitialState } = action;
      const findUser = state.find(user => user.email === payload.email);
      if (findUser) {
        state.splice(state.indexOf(findUser), 1);
      }
    }
  }
});


export const { logInUser, createUser, deleteUser } = userSlice.actions
export default userSlice.reducer;
