import { createSlice } from '@reduxjs/toolkit';


const initialState: UserInitialState[] = [];
const generateId = (array: UserInitialState[]) => {
  return array.length > 0 ? '000' + (array.length + 1) : '0001';
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logInUser: (state, action) => {
      const { payload }: { payload: UserInitialState } = action;

      state.push({
        id: generateId(state),
        name: payload.email,
        email: payload.email,
        rank: 'A',
        phone: ''
      })

    },
    createUser: (state, action) => {
      const { payload }: { payload: UserInitialState } = action;
      state.push({
        ...payload,
        id: generateId(state)
      });
    },
    updateUser: (state, action) => {
      const { payload }: { payload: UserInitialState } = action;
      const findUser = state.find(user => user.id === payload.id);
      if (findUser) {
        const index = state.indexOf(findUser);
        state[index] = {
          ...state[index],
          ...payload
        }
      }
    },
    deleteUser: (state, action) => {
      const { payload }: { payload: UserInitialState } = action;
      const findUser = state.find(user => user.id === payload.id);
      if (findUser) {
        state.splice(state.indexOf(findUser), 1);
      }
    }
  }
});


export const { logInUser, createUser, deleteUser, updateUser } = userSlice.actions
export default userSlice.reducer;
