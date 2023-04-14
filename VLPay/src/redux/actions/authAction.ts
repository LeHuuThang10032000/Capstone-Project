import {LOGIN, LOGOUT} from '../constants';
import * as api from '../../components/apis/api';
import {axiosClient} from '../../components/apis/axiosClient';
import {clearToken, getToken, saveToken} from '../../utils/storeUtils';
import messaging from '@react-native-firebase/messaging';

export const Init = async () => {
  let token = await getToken();
  if (token) {
    return {
      type: LOGIN,
      payload: token,
    };
  }
  return {
    type: LOGIN,
    payload: null,
  };
};

export const Login = async (phoneNumber: string, password: string) => {
  const phone = phoneNumber;
  const deviceToken = await messaging().getToken();
  console.log('Device Token:', deviceToken);
  try {
    const res = await axiosClient.post(api.LOGIN, {
      phone,
      password,
      device_token: deviceToken,
    });
    await saveToken(res.data.data);
    return {
      type: LOGIN,
      payload: res.data.data,
    };
  } catch (e) {
    console.log(e);
  }
  return {
    type: LOGIN,
    payload: null,
  };
};

export const Logout = async () => {
  await clearToken();
  return {
    type: LOGOUT,
    payload: null,
  };
};
