import { combineReducers, configureStore } from '@reduxjs/toolkit';
import carsSlice from './carsSlice';

const rootReducer = combineReducers({ carReducer: carsSlice });

const store = configureStore({ reducer: rootReducer });

export default store;
