const initialState = {
  authToken: 123,
  userData: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state, // copy all previous states
        authToken: action.payload,
      };
    default:
      return state;
  }
};
