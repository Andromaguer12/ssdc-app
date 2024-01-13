import { userPassword } from '@/constants/users/user-constanst';
import { UserInterface } from '@/typesDefs/constants/users/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie'

export interface UserReducerInitialState {
  userData: UserInterface | null,
  requestState: {
    loadingUser: boolean;
    success: boolean;
    error: null | any;
  },
  registerRequestState: {
    loadingUser: boolean;
    error: null | any;
  }
  signedOut: boolean;
  isAdmin: boolean;
}

const initialState: UserReducerInitialState = {
  userData: null,
  requestState: {
    loadingUser: false,
    success: false,
    error: null
  },
  registerRequestState: {
    loadingUser: false,
    error: null
  },
  signedOut: false,
  isAdmin: false
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
      const { payload }: { payload: any } = action;
      state.requestState.loadingUser = false;
      state.requestState.success = true;
      state.userData = {
        ...payload,
        accessToken: payload.accessToken,
        uid: payload.uid,
      }
      state.isAdmin = payload.isAdmin;
      state.requestState.error = null;
    });
    builder.addCase(userLoginFunction.rejected, (state, action: any) => {
      state.requestState.loadingUser = false;
      state.requestState.error = action.error;
    });

    builder.addCase(getUserByUserUid.pending, (state, action: any) => {
      state.requestState.loadingUser = true;
    });
    builder.addCase(getUserByUserUid.fulfilled, (state, action) => {
      const { payload }: { payload: any } = action;
      state.requestState.loadingUser = false;
      state.requestState.success = true;
      state.userData = {
        ...payload,
        accessToken: payload.accessToken,
        uid: payload.uid,
      }
      state.isAdmin = payload.isAdmin;
      state.requestState.error = null;
    });
    builder.addCase(getUserByUserUid.rejected, (state, action: any) => {
      state.requestState.loadingUser = false;
      state.requestState.error = action.error;
    });

    builder.addCase(userLogoutFunction.fulfilled, (state, action) => {
      state.signedOut = true
    });
  }
});


export const { clearRequestUserState, clearStateUser } = userSlice.actions;

export default userSlice.reducer;
