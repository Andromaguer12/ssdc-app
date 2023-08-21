import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface UserReducerInitialState {
  name: string;
  email: string;
  phone: string;
  rank: 'A' | 'B' | 'C';
  loadingUser: boolean;
  error: string;
  uid: string;
  accessToken: string;
}

const initialState = {
  name: '',
  email: '',
  phone: '',
  rank: 'C',
  loadingUser: false,
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
    builder.addCase(userLoginFunction.fulfilled, (state, action) => {
      const { payload }: { payload: UserReducerInitialState } = action;
      state.loadingUser = false;
      state.name = payload.name;
      state.email = payload.email;
      state.phone = payload.phone;
      state.rank = payload.rank;
      state.accessToken = payload.accessToken;
      state.accessToken = payload.uid;
    });
    builder.addCase(userLoginFunction.rejected, (state, action: any) => {
      state.loadingUser = false;
      state.error = action.error;
    });

  }
});


//export const { createUser, deleteUser, updateUser } = userSlice.actions
export default userSlice.reducer;
