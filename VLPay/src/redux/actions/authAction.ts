import {LOGIN, LOGOUT} from '../constants';
import * as api from '../../components/apis/api';
import axios from 'axios';

export const Login = async (phoneNumber: string, password: string) => {
  const phone = phoneNumber;

  try {
    const res = await axios.post('https://zennoshop.cf/api/user/login', {
      phone,
      password,
    });

    return {
      type: LOGIN,
      payload: res.data.token,
    };
  } catch (e) {
    console.log(e);
  }
};

export const Logout = () => {
  return {
    type: LOGOUT,
    payload: null,
  };
};
