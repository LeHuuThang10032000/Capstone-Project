import {LOGIN} from '../constants';

export const Login = (phoneNumber, password) => {
  const token = phoneNumber + password;
  return {
    type: LOGIN,
    payload: token,
  };
};
