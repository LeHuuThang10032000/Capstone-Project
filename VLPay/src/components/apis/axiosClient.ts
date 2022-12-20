import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosError} from 'axios';
import {baseUrl} from './baseUrl';

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
    const token = await AsyncStorage.getItem(AUTHORIZATION_KEY);
    if (config.headers == undefined) {
      config.headers = {};
    }

    // console.log('token:', token);
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
    console.error(`AxiosError: ${JSON.stringify(axiosErr)}`);
    return Promise.reject(axiosErr);
  },
);

axiosClient.interceptors.request.use(request => {
  // console.log('Starting Request', JSON.stringify(request, null, 2));
  return request;
});
