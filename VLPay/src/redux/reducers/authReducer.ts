import {saveToken} from '../../utils/storeUtils';
import {LOGIN, LOGOUT} from '../constants';

const initialState = {
  authToken: null,
  userData: {},
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state, //copy all previous state
        authToken: action.payload,
      };

    case LOGOUT:
      return {
        authToken: null,
      };

    default:
      return state;
  }
};
