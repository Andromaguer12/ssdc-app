import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import { combineReducers } from '@reduxjs/toolkit';
import user from './reducers/user/actions';
import tournament from './reducers/tournament/actions';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const reducers = combineReducers({
  user,
  tournament
});

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(thunkMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
//this will be for perform dispatch as the extends of the application components
export const useAppDispatch = () => useDispatch<AppDispatch>();
// and as the same way this will be for performe selections
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
