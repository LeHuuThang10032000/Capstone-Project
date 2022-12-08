
import {createStore, combineReducers} from 'redux';
import authReducer from './reducers/authReducer';

const RootReducers = combineReducers({
  authReducer,
});

export const store = createStore(RootReducers);
