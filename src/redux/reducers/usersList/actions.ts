import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface UserListReducerInitialState {
  loadingUsersList: boolean;
  usersListData: any[];
  error: string;
}

const initialState = {
  loadingUsersList: false,
  error: '',
  usersListData: []
} as UserListReducerInitialState;



export const getUsersList = createAsyncThunk(
  'users/getUsersList',
  async (params: { context: any }) => {
    return params.context.getUsersList()
  }
)

const userListSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getUsersList.pending, (state, action: any) => {
      state.loadingUsersList = true;
    });
    builder.addCase(getUsersList.fulfilled, (state, action: any) => {
      state.loadingUsersList = false;
      state.usersListData = action.payload;
    });
    builder.addCase(getUsersList.rejected, (state, action: any) => {
      state.error = action.error;
    });
  }
});

export default userListSlice.reducer;
