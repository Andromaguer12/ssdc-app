import { Slice, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UserReducerInitialState } from '../user/actions';

interface UserListReducerInitialState {
  loading: boolean;
  data: UserReducerInitialState[];
  error: string;
}

const initialState = {
  loading: false,
  error: '',
  data: []
} as UserListReducerInitialState;



export const getUsersList = createAsyncThunk(
  'users/getUsersList',
  async (params: { context: any }) => {
    return params.context.getUsersList()
  }
)

const userListSlice: Slice<UserListReducerInitialState, {}, "user"> = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getUsersList.pending, (state, action: any) => {
      state.loading = true;
    });
    builder.addCase(getUsersList.fulfilled, (state, action: any) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(getUsersList.rejected, (state, action: any) => {
      state.error = action.error;
    });
  }
});

export default userListSlice.reducer;
