import {combineReducers, createStore} from 'redux';
import authReducer from './reducer/authReducer';
const RootReducers = combineReducers({
  authReducer,
});

export const store = createStore(RootReducers);
