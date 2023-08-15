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
  reducers: {}
});

export default userSlice.reducer;
