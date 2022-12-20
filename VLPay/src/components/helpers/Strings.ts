import Localize from 'react-native-localization';

const strings = new Localize({
  vn: {
    login: 'Đăng nhập',
    register: 'Đăng ký',
    createNewAcc: 'Tạo tài khoản mới',
    alreadyHasAcc: 'Quý vị đã có tài khoản?',
    name: 'Tên',
    name_placeholder: 'Vui lòng nhập tên',
    phone_placeholder: 'Vui lòng nhập số điện thoại',
    password: 'Mật khẩu',
    password_confirmation: 'Xác nhận lại mật khẩu',
    password_placeholder: 'Vui lòng nhập mật khẩu',
    phone_number: 'Số điện thoại',
    rememberMe: 'Lưu Đăng nhập',
    forgotPassword: 'Quên mật khẩu',
    signUp: 'Đăng ký',
  },
  en: {
    login: 'Login',
    loginByMicrosoft: 'Login by microsoft',
    register: 'Register',
    createNewShop: 'Create new shop',
    alreadyHasShop: 'You have already have shop',
    name: 'Name',
    name_placeholder: 'Please input your name',
    phone_placeholder: 'Please input your phone number',
    password: 'Password',
    password_confirmation: 'Confirm password',
    password_placeholder: 'Please input your password',
    phone_number: 'Phonenumber',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password',
    signUp: 'Sign up',
  },
});

export const format = (text: string, params: string[]): string => {
  let result = text;
  params.forEach((value: string, index: number) => {
    result = result.replace(`{${index}}`, value);
  });
  return result;
};

export default strings;
