import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface UserReducerInitialState {
  name: string;
  email: string;
  phone: string;
  rank: 'A' | 'B' | 'C';
  loadingUser: boolean;
  error: string;
}

const initialState = {
  name: '',
  email: '',
  phone: '',
  rank: 'C',
  loadingUser: false
} as UserReducerInitialState;

export const userLoginFunction = createAsyncThunk(
  'users/userLoginFunction',
  async (params: { email: string; password: string; context: any }) => {
    return params.context.loginUser({
      email: params.email,
      password: params.password
    });
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(userLoginFunction.pending, (state, action: any) => {
      state.loadingUser = true;
    });
    builder.addCase(userLoginFunction.fulfilled, (state, action: any) => {
      state.loadingUser = false;
      state.name = action.payload?.name;
      state.email = action.payload?.email;
      state.phone = action.payload?.phone;
      state.rank = action.payload?.rank;
    });
    builder.addCase(userLoginFunction.rejected, (state, action: any) => {
      state.error = action.error;
    });
  }
});

export default userSlice.reducer;
