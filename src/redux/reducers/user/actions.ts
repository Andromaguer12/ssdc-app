import { userPassword } from '@/constants/users/user-constanst';
import { UserInterface } from '@/typesDefs/constants/users/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie'

export interface UserReducerInitialState extends UserInterface {
  accessToken: string;
  id: string;
  isAdmin?: boolean;
  signedOut?: boolean;
  requestState: {
    loadingUser: boolean;
    success: boolean;
    error: null | any;
  },
  registerRequestState: {
    loadingUser: boolean;
    error: null | any;
  }
}

const initialState: UserReducerInitialState = {
  name: '',
  email: '',
  phone: '',
  rank: "C",
  accessToken: '',
  uid: '',
  id: '',
  requestState: {
    loadingUser: false,
    success: false,
    error: null
  },
  registerRequestState: {
    loadingUser: false,
    error: null
  }
};

export const userLoginFunction = createAsyncThunk(
  'users/userLoginFunction',
  async (params: { email: string; password: string; context: any }) => {
    const auth = await params.context.loginUser(params.email, params.password);

    Cookies.set("auth", auth.user.uid);
    Cookies.set("accessToken", auth.user.accessToken);

    return params.context.getUserFromId(auth.user.uid, auth.user.accessToken);
  }
);

export const userLogoutFunction = createAsyncThunk(
  'users/userLogoutFunction',
  async (params: { context: any }, { dispatch }) => {
    await params.context.logoutUser();

    Cookies.remove("auth");
    Cookies.remove("accessToken");

    return true
  }
);

export const getUserByUserUid = createAsyncThunk(
  'users/getUserByUserUid',
  async (params: { uid: string; accessToken: string; context: any }) => {
    return params.context.getUserFromId(params.uid, params.accessToken);
  }
);

export const userRegisterFunction = createAsyncThunk(
  'users/userRegisterFunction',
  async ({ context, email, data }: { context: any, email: string, data: UserInterface }) => {
    return context.registerUser(email, userPassword, data);
  }
)

export const userUpdateFunction = createAsyncThunk(
  'users/userUpdateFunction',
  async ({ context, data, payload }: { context: any, data: UserInterface, payload: UserInterface }) => {
    const rta = context.updateUser(data, payload);
    return rta
  }
)

export const userDeleteFunction = createAsyncThunk(
  'users/userDeleteFunction',
  async ({ context, user }: { context: any, user: UserReducerInitialState }) => {
    return context.removeUser(user);
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearRequestUserState: (state) => {
      state.requestState = initialState.requestState
    },
    clearStateUser: (state) => {
      state = initialState
    }
  },
  extraReducers: builder => {
    builder.addCase(userLoginFunction.pending, (state, action: any) => {
      state.requestState.loadingUser = true;
    });
    builder.addCase(userLoginFunction.fulfilled, (state, action) => {
      const { payload }: { payload: UserReducerInitialState } = action;
      state.requestState.loadingUser = false;
      state.requestState.success = true;
      state.name = payload.name;
      state.email = payload.email;
      state.phone = payload.phone;
      state.rank = payload.rank;
      state.isAdmin = payload.isAdmin;
      state.accessToken = payload.accessToken;
      state.accessToken = payload.uid;
    });
    builder.addCase(userLoginFunction.rejected, (state, action: any) => {
      state.requestState.loadingUser = false;
      state.requestState.error = action.error;
    });

    builder.addCase(getUserByUserUid.pending, (state, action: any) => {
      state.requestState.loadingUser = true;
    });
    builder.addCase(getUserByUserUid.fulfilled, (state, action) => {
      const { payload }: { payload: UserReducerInitialState } = action;
      state.requestState.loadingUser = false;
      state.requestState.success = true;
      state.name = payload.name;
      state.email = payload.email;
      state.phone = payload.phone;
      state.rank = payload.rank;
      state.isAdmin = payload.isAdmin;
      state.accessToken = payload.accessToken;
      state.accessToken = payload.uid;
    });
    builder.addCase(getUserByUserUid.rejected, (state, action: any) => {
      state.requestState.loadingUser = false;
      state.requestState.error = action.error;
    });

    builder.addCase(userLogoutFunction.fulfilled, (state, action) => {
      state.signedOut = true
    });

    //Register
    builder.addCase(userRegisterFunction.pending, (state, action: any) => {
      state.registerRequestState.loadingUser = true;
      console.log("PENDIENTE")
    });
    builder.addCase(userRegisterFunction.fulfilled, (state, action) => {

    });
    builder.addCase(userRegisterFunction.rejected, (state, action: any) => {
      //state.loadingUser = false;
      // state.error = action.error;
      console.log("error", action.error);
      console.log("ERROR", action, state);
    });

    //Delete
    builder.addCase(userDeleteFunction.pending, (state, action: any) => {
      state.registerRequestState.loadingUser = true;
      console.log("PENDIENTE")
    });
    builder.addCase(userDeleteFunction.fulfilled, (state, action) => {
      console.log("borrado");
    });
    builder.addCase(userDeleteFunction.rejected, (state, action: any) => {
      //state.loadingUser = false;
      // state.error = action.error;
      console.log("error", action.error);
      console.log("ERROR", action, state);
    });
  }


});


export const { clearRequestUserState, clearStateUser } = userSlice.actions;

export default userSlice.reducer;
