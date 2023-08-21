import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface UserReducerInitialState {
  name: string;
  email: string;
  phone: string;
  rank: 'A' | 'B' | 'C';
  loadingUser: boolean;
  loadingUsersList: boolean;
  error: string;
  uid: string;
  accessToken: string;
  usersList: any[]
}

const initialState = {
  name: '',
  email: '',
  phone: '',
  rank: 'C',
  loadingUser: false,
  loadingUsersList: false,
  accessToken: '',
  uid: ''
} as UserReducerInitialState;

export const userLoginFunction = createAsyncThunk(
  'users/userLoginFunction',
  async (params: { email: string; password: string; context: any }) => {
    const auth = await params.context.loginUser(params.email, params.password);

    return params.context.getUserFromId(auth.user.uid, auth.user.accessToken)
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
      state.accessToken = action.payload.accessToken;
      state.accessToken = action.payload.uid;
    });
    builder.addCase(userLoginFunction.rejected, (state, action: any) => {
      state.loadingUser = false;
      state.error = action.error;
    });

  }
});


export const { logInUser, createUser, deleteUser, updateUser } = userSlice.actions
export default userSlice.reducer;
