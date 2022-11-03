import Login from '../screen/Login';
import ForgotPwd from '../screen/ForgotPassword';
import Register from '../screen/Register';
import {Screen} from './type';
import BottomTabStack from './BottomTabStack';

export const MAIN_STACK_SCREEN: Screen[] = [
  {
    name: 'MainTab',
    component: BottomTabStack,
  },
  {
    name: 'Login',
    component: Login,
  },
  {
    name: 'ForgotPwd',
    component: ForgotPwd
  },
  {
    name: 'Register',
    component: Register
  },
];
