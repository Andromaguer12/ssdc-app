import { createSlice } from '@reduxjs/toolkit';

const initialState: UserInitialState[] = [];

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logInUser: (state, action) => { //pendiente por agregar el tipo al payload
      state.push({
        name: action.payload.email,
        email: action.payload.email,
        rank: 'A',
        phone: ''
      })

    },
    createUser: (state, action) => {
      state.push(action.payload);
    },
    updateUser: (state, action) => {

    },
    deleteUser: (state, action) => {

    }
  }
});


export const { logInUser, createUser } = userSlice.actions
export default userSlice.reducer;
