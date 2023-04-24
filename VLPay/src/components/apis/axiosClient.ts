import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosError} from 'axios';
import {baseUrl} from './baseUrl';
import {Logout} from '../../redux/actions/authAction';
import RNRestart from 'react-native-restart';
import {useDispatch} from 'react-redux';
import {clearToken, getToken} from '../../utils/storeUtils';
import {Alert} from 'react-native';

export const AUTHORIZATION_KEY = 'AUTHORIZATION_KEY';

export const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const axiosClient = axios.create({
  baseURL: baseUrl,
  timeout: 10000 * 10, // 30s
  headers,
});

axiosClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (config.headers == undefined) {
      config.headers = {};
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (
      config.method === 'post' &&
      config.headers['Content-Type'] == undefined
    ) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    return config;
  },
  error => {
    console.log('error request interceptor', error);
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response: any) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.info('Response:', JSON.stringify(response.data));
    return response;
  },
  async function (error: any) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const axiosErr = error as AxiosError;
    const token = await getToken();
    console.log(token);

    console.log(
      'axiosErr?.response?.data',
      axiosErr?.response?.data?.error == 'Unauthenticated.' && token != null,
    );
    console.log('axiosErr?.response?.data', axiosErr?.response?.data);
    console.log('token', token);

    if (
      axiosErr?.response?.data?.error == 'Unauthenticated.' &&
      token != null
    ) {
      RNRestart.Restart();
      clearToken();
      Alert.alert('Phiên đăng nhập hết hạn.');
    }
    return Promise.reject(axiosErr?.response?.data);
  },
);

axiosClient.interceptors.request.use(request => {
  return request;
});
