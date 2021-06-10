import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { carReducer } from './carReducer';

const store = createStore(carReducer, applyMiddleware(thunk));
export default store;
