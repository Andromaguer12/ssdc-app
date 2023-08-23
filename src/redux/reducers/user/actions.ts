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

    return params.context.getUserFromId(auth.user.uid, auth.user.accessToken);
  }
);

export const userRegisterFunction = createAsyncThunk(
  'users/userRegisterFunction',
  async ({ context, data }: { context: any, data: UserReducerInitialState }) => {
    return context.registerUser(data);
  }
)

export const userDeleteFunction = createAsyncThunk(
  'users/userDeleteFunction',
  async ({ context, id }: { context: any, id: string }) => {
    return context.deleteUser(id);
  }
)

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

    //Register
    builder.addCase(userRegisterFunction.pending, (state, action: any) => {
      state.loadingUser = true;
      console.log("PENDIENTE")
    });
    builder.addCase(userRegisterFunction.fulfilled, (state, action) => {
      const { payload }: { payload: UserReducerInitialState } = action;
      /*state.loadingUser = false;
      state.name = payload.name;
      state.email = payload.email;
       state.phone = payload.phone;
      state.rank = payload.rank;
      state.accessToken = payload.accessToken;
      state.accessToken = payload.uid; */
    });
    builder.addCase(userRegisterFunction.rejected, (state, action: any) => {
      //state.loadingUser = false;
      // state.error = action.error;
      console.log("error", action.error);
      console.log("ERROR", action, state);
    });
  }
});


export default userSlice.reducer;
