import {LOGIN, LOGOUT} from '../constants';

const initialState = {
  authToken: null,
  userData: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        authToken: action.payload,
      };

    case LOGOUT:
      console.log(' tui day ne');

      return {
        authToken: null,
      };

    default:
      return state;
  }
};
