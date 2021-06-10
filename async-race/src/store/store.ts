import { combineReducers, configureStore } from '@reduxjs/toolkit';
import carSlice from './carSlice';

const rootReducer = combineReducers({ carReducer: carSlice });

const store = configureStore({ reducer: rootReducer });

export default store;
