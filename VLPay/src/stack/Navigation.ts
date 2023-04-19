// import {BodyCreateJob} from '../model/Job';
import {
  MaterialBottomTabNavigationProp,
  MaterialBottomTabScreenProps,
} from '@react-navigation/material-bottom-tabs';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';

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
  Payment: {
    data: any;
  };
  PaymentDetails: {data: any};
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
  Settings: {
    phone: string;
  };
  DetailUser: {
    id?: string;
    f_name: string;
    phone: string;
  };
  DetailFriend: {
    f_name: string;
    phone: string;
  };
  Transfer: {
    userWallet: number;
    payment_type: string;
  };
  EditProfile: {name: string; phone: string};
  ChangePassword: {
    phone: string;
  };
  ConfirmPM: {
    data: any;
    payment_type: string;
  };
  ScanQR: undefined;
  RegisterMerchant: undefined;
  WaitApprove: undefined;
  WithDraw: {
    isWithdraw: boolean;
  };
  WithDrawInfo: {
    isWithdraw: boolean;
  };
  Support: undefined;
  Friends: undefined;
  MyOrder: undefined;
  Demo: undefined;
  ApproveMerchant: undefined;
  NotiScreen: undefined;
  OrderScreen: undefined;
  MenuScreen: undefined;
  MailScreen: undefined;
  AccountScreen: undefined;
  HistoryWithDraw: undefined;
  DetailShop: undefined;
  UpdateShop: {
    store_id: string;
    image: string;
    cover_photo: string;
    name: string;
  };
  ProductMerchant: undefined;
  ListStore: undefined;
  DetailStore: {
    store_id: number;
    status: string;
  };
  DetailProduct: {
    id: number;
    store_id: number;
  };
  DetailCart: {store_id: number};
  AddItems: undefined;
  UpdateItem: undefined;
  DetailOrder: {
    store_id: number;
    phone: string | undefined;
    name: string | undefined;
    image: string | undefined;
  };
  PaymentOrder: {total_price: string; store_id: number};
  OrderProcess: {order_id: number; store_id: number};
  MyDetailOrder: {id: number};
  ShareBill: undefined;
  ChooseSharer: undefined;
  DetailBill: undefined;
  SendRequestShare: undefined;
  NotiShareBill: {order_id: number; userWallet: number};
  DetailTransaction: {
    title: string;
    amount: number;
    code: number;
    created_at: string;
  };
  ListShareBill: {userWallet: number};
  ListPaidBill: undefined;
  ConfirmTranferShare: {
    phone: string;
    isYour: number;
    payment_type: string;
    amount: number;
    shared_name: string;
    current_user: string;
  };
  PaymentDetailShare: {
    amount: number;
    shared_name: number;
    phone: string;
    message: string;
  };
  DetailBillShare: {order_id: number};
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
  MainTabM: undefined;
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
