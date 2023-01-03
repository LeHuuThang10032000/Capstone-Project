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
import ConfirmPM from '../screen/Transfer/ConfirmTransfer';
import EditProfile from '../screen/EditProfileScreen';
import ChangePassword from '../screen/ChangePassword';
import NewPassword from '../screen/NewPassword';
import Payment from '../screen/payment';
import ScanQR from '../screen/ScanQR';
import ApproveMerc from '../screen/Merchant/ApproveMerchant';
import WaitApprove from '../screen/Merchant/ApproveMerchant/Waiting';

export const MAIN_STACK_SCREEN: Screen[] = [
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
    name: 'MainTab',
    component: BottomTabStack,
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
  {
    name: 'EditProfile',
    component: EditProfile,
  },
  {
    name: 'ChangePassword',
    component: ChangePassword,
  },
  {
    name: 'NewPassword',
    component: NewPassword,
  },
  {
    name: 'Payment',
    component: Payment,
  },
  {
    name: 'ConfirmPM',
    component: ConfirmPM,
  },
  {
    name: 'ScanQR',
    component: ScanQR,
  },
  {
    name: 'ApproveMerc',
    component: ApproveMerc,
  },
  {
    name: 'WaitApprove',
    component: WaitApprove,
  },
];
