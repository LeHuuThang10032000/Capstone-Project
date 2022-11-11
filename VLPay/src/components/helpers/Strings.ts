import Localize from 'react-native-localization';

const strings = new Localize({
  vn: {
    login: 'Đăng nhập',
    register: 'Đăng ký',
    createNewAcc: 'Tạo tài khoản mới',
    alreadyHasAcc: 'Quý vị đã có tài khoản?',
    email: 'Email',
    email_placeholder: 'Vui lòng nhập email',
    password: 'Mật khẩu',
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
    email: 'Email',
    email_placeholder: 'Please input your email',
    password: 'Password',
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
