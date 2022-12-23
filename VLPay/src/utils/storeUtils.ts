import AsyncStorage from '@react-native-async-storage/async-storage';
import {RegisterResponse} from '../model/RegisterResponse';

export const saveUser = async (auth?: RegisterResponse) => {
  await AsyncStorage.setItem('authKey', JSON.stringify(auth));
};

export const getUser = async () => {
  const auth = await AsyncStorage.getItem('authKey');
  return auth ? (JSON.parse(auth) as RegisterResponse) : undefined;
};

export const saveToken = async (token: string) => {
  await AsyncStorage.setItem('token', token);
};

export const getToken = async () => {
  return AsyncStorage.getItem('token') || '';
};

export const getLang = async () => {
  const lang = (await AsyncStorage.getItem('localeKey')) || '';
  return lang;
};

export const savePhone = async (phone: string) => {
  await AsyncStorage.setItem('phoneKey', phone);
};

export const getPhone = async () => {
  return (await AsyncStorage.getItem('phoneKey')) || '';
};
