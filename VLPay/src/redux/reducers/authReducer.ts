import {LOGIN} from '../constants';

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

    default:
      return state;
  }
};
