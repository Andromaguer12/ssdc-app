import { UserInterface } from '@/typesDefs/constants/users/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface UsersInitialState {
  getUsers: {
    loadingGetUsers: boolean;
    successGetUsers: boolean;
    usersList: UserInterface[];
    errorGetUsers: any | null;
  };
  getUserById: {
    loadingGetUserById: boolean;
    successGetUserById: boolean;
    user: UserInterface | null;
    errorGetUserById: any | null;
  };
  createUser: {
    loadingCreateUser: boolean;
    successCreateUser: boolean;
    errorCreateUser: any | null;
  };
  updateUser: {
    loadingUpdateUser: boolean;
    successUpdateUser: boolean;
    errorUpdateUser: any | null;
  };
  deleteUser: {
    loadingDeleteUser: boolean;
    successDeleteUser: boolean;
    errorDeleteUser: any | null;
  };
}

const initialState: UsersInitialState = {
  getUsers: {
    loadingGetUsers: false,
    successGetUsers: false,
    usersList: [],
    errorGetUsers: null
  },
  getUserById: {
    loadingGetUserById: false,
    successGetUserById: false,
    user: null,
    errorGetUserById: null
  },
  createUser: {
    loadingCreateUser: false,
    successCreateUser: false,
    errorCreateUser: null
  },
  updateUser: {
    loadingUpdateUser: false,
    successUpdateUser: false,
    errorUpdateUser: null
  },
  deleteUser: {
    loadingDeleteUser: false,
    successDeleteUser: false,
    errorDeleteUser: null
  }
};

export const getAllUsers = createAsyncThunk(
  'users/getAllUsers',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await params.context.getAllUsers();

      return response;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const getUserById = createAsyncThunk(
  'users/getUserById',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await params.context.getUserById(params.id);

      return response;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (params: any, { rejectWithValue }) => {
    const response = await params.context.createUser(
      params.name,
      params.email,
      params.phone,
      params.image
    );

    if (response?.toString().includes('FirebaseError')) {
      return rejectWithValue(JSON.stringify(response));
    }

    return response;
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (params: any, { rejectWithValue }) => {
    const response = await params.context.updateUser(params.id, params.body);

    return response;
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (params: any, { rejectWithValue }) => {
    const response = await params.context.deleteUser(params.id);

    return response;
  }
);

const usersSlice = createSlice({
  name: 'usersList',
  initialState,
  reducers: {
    clearGetUsers: state => {
      state.getUsers = initialState.getUsers;
    },
    clearCreateUserState: state => {
      state.createUser = initialState.createUser;
    },
    clearUpdateUserState: state => {
      state.updateUser = initialState.updateUser;
    }
  },
  extraReducers: builder => {
    builder.addCase(getAllUsers.pending, (state, action: any) => {
      state.getUsers.loadingGetUsers = true;
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      const { payload }: { payload: any } = action;
      state.getUsers.loadingGetUsers = false;
      state.getUsers.successGetUsers = true;
      state.getUsers.usersList = payload;
      state.getUsers.errorGetUsers = null;
    });
    builder.addCase(getAllUsers.rejected, (state, action: any) => {
      state.getUsers.loadingGetUsers = false;
      state.getUsers.errorGetUsers = action.error;
    });

    builder.addCase(getUserById.pending, (state, action: any) => {
      state.getUserById.loadingGetUserById = true;
    });
    builder.addCase(getUserById.fulfilled, (state, action) => {
      const { payload }: { payload: any } = action;
      state.getUserById.loadingGetUserById = false;
      state.getUserById.successGetUserById = true;
      state.getUserById.user = payload;
      state.getUserById.errorGetUserById = null;
    });
    builder.addCase(getUserById.rejected, (state, action: any) => {
      state.getUserById.loadingGetUserById = false;
      state.getUserById.errorGetUserById = action.error;
    });

    builder.addCase(createUser.pending, (state, action: any) => {
      state.createUser.loadingCreateUser = true;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.createUser.loadingCreateUser = false;
      state.createUser.successCreateUser = true;
      state.createUser.errorCreateUser = null;
    });
    builder.addCase(createUser.rejected, (state, action: any) => {
      state.createUser.loadingCreateUser = false;
      state.createUser.errorCreateUser = action.payload;
    });

    builder.addCase(updateUser.pending, (state, action: any) => {
      state.updateUser.loadingUpdateUser = true;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.updateUser.loadingUpdateUser = false;
      state.updateUser.successUpdateUser = true;
      state.updateUser.errorUpdateUser = null;
    });
    builder.addCase(updateUser.rejected, (state, action: any) => {
      state.updateUser.loadingUpdateUser = false;
      state.updateUser.errorUpdateUser = action.payload;
    });

    builder.addCase(deleteUser.pending, (state, action: any) => {
      state.deleteUser.loadingDeleteUser = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.deleteUser.loadingDeleteUser = false;
      state.deleteUser.successDeleteUser = true;
      state.deleteUser.errorDeleteUser = null;
    });
    builder.addCase(deleteUser.rejected, (state, action: any) => {
      state.deleteUser.loadingDeleteUser = false;
      state.deleteUser.errorDeleteUser = action.payload;
    });
  }
});

export const { clearGetUsers, clearCreateUserState, clearUpdateUserState } =
  usersSlice.actions;

export default usersSlice.reducer;
