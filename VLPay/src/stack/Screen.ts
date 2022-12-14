import Login from '../screen/Login';
import ForgotPwd from '../screen/ForgotPassword';
import Register from '../screen/Register';
import {Screen} from './type';
import BottomTabStack from './BottomTabStack';
import Search from '../screen/Search';
import ProfileUser from '../screen/ProfileUser';
import Settings from '../screen/Settings';
import DetailUser from '../screen/Search/DetailUser';
import Otp from '../screen/Otp';
import Transfer from '../screen/Transfer';
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
    component: ForgotPwd,
  },
  {
    name: 'Register',
    component: Register,
  },
  {
    name: 'Otp',
    component: Otp,
  },
  {
    name: 'Search',
    component: Search,
  },
  {
    name: 'ProfileUser',
    component: ProfileUser,
  },
  {
    name: 'Settings',
    component: Settings,
  },
  {
    name: 'DetailUser',
    component: DetailUser,
  },
  {
    name: 'Transfer',
    component: Transfer,
  },
];
