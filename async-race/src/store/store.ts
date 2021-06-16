import { combineReducers, configureStore } from '@reduxjs/toolkit';
import carsSlice from './carsSlice';
import winnersSlice from './winnersSlice';

const rootReducer = combineReducers({
  carReducer: carsSlice,
  winnersReducer: winnersSlice,
});

const store = configureStore({ reducer: rootReducer });

export default store;
