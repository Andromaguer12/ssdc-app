import { createSlice } from '@reduxjs/toolkit';

const initialState: UserInitialState = {
  name: '',
  email: '',
  phone: '',
  rank: 'C',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logInUser: (state, action) => { //pendiente por agregar el tipo al payload
      state.name = action.payload.password
      state.email = action.payload.email
      //  state.phone = action.payload.phone
      // state.rank = action.payload.rank
    }
  }
});


export const { logInUser } = userSlice.actions
export default userSlice.reducer;
