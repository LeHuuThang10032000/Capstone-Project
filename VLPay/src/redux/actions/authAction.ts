import {LOGIN, LOGOUT} from '../constants';

export const Login = (phoneNumber: string, password: string) => {
  const token = phoneNumber + password;

  return {
    type: LOGIN,
    payload: token,
  };
};

export const Logout = () => {
  return {
    type: LOGOUT,
    payload: null,
  };
};
