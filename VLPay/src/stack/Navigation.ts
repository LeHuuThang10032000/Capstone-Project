// import {BodyCreateJob} from '../model/Job';
import {
  MaterialBottomTabNavigationProp,
  MaterialBottomTabScreenProps,
} from '@react-navigation/material-bottom-tabs';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {Title} from 'react-native-paper';

// import {Job} from '../model/Job';
// import {Social} from '../model/Social';
// import {HistoryMessageParams} from '../model/HistoryMessageParams';
// import {ProfileCompanyItem} from '../model/Company/GetCompanyProfile';
// import {DetailResumeItem} from '../model/Resume/DetailResume';
// import {TypeJob} from '../screen/Jobs/Jobs';
// import {ApplicationObjectItem} from '../model/Application/ApplicationObject';

type HomeProps = {
  userId?: number;
};

export type AuthStackParamList = {
  Register: undefined;
  Login: undefined;
};

export type AuthStackNavigation = StackNavigationProp<AuthStackParamList>;

export type MainStackParamList = {
  Home: HomeProps | undefined;
  Profile: undefined;
  Login: undefined;
  Payment: undefined;
  Otp: {
    isHoldingLogin?: boolean;
    full_name?: string;
    phone: string;
    password?: string;
    password_confirmation?: string;
    confirmation?: any;
    forgot_password?: boolean;
  };
  NewPassword: {
    phone: string;
  };
  // Otp: undefined;
  ForgotPwd: undefined;
  Register: undefined;
  TranSactionHistory: undefined;
  QR: undefined;
  Notification: undefined;
  MyWallet: undefined;
  Search: undefined;
  ProfileUser: undefined;
  Settings: undefined;
  DetailUser: {
    email: string;
    picture: string;
    title: string;
    first: string;
    last: string;
    phone: string;
  };
  Transfer: undefined;
  EditProfile: undefined;
  ChangePassword: {
    phone: string;
  };
  ConfirmPM: undefined;
  ScanQR: undefined;
  ApproveMerc: undefined;
  WaitApprove: undefined;
  WithDraw: {
    isWithdraw: boolean;
  };
  WithDrawInfo: {
    isWithdraw: boolean;
  };
};

export type MainStackNavigation = StackNavigationProp<MainStackParamList>;
export type S = keyof MainStackParamList;
export type MainStackScreenProps<RouteName extends S> = StackScreenProps<
  MainStackParamList,
  RouteName
>;

// for bottom tab navigation
export type TabStackParamList = {
  MainTab: undefined;
};

export type T = keyof TabStackParamList;
export type TabStackScreenProps<RouteName extends T> =
  MaterialBottomTabScreenProps<TabStackParamList, RouteName>;

export type TabStackNavigation =
  MaterialBottomTabNavigationProp<TabStackParamList>;

// for drawer navigation
export type DrawerStackParamList = {
  MainDrawer: undefined;
};
