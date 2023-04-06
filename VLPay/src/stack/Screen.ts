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
import WithDraw from '../screen/WithDraw';
import WithDrawInfo from '../screen/WithDrawInfo';
import SupportStudent from '../screen/Support';
import Friends from '../screen/Friends';
import DetailFriend from '../screen/Friends/DetailFriend';
import PaymentDetails from '../screen/PaymentDetails';
import MyOrder from '../screen/MyOrder';
import QR from '../screen/QR';
import Demo from '../screen/Friends/Demo';
import RegisterMerchant from '../screen/Merchant/RegisterMerchant';
import NotiScreen from '../screen/Merchant/RegisterMerchant/NotiScreen';
import OrderScreen from '../screen/Merchant/Shop/OrderScreen';
import MenuScreen from '../screen/Merchant/Shop/MenuScreen';
import BottomTabStackMerchant from './BottomTabMerchant';
import MailScreen from '../screen/Merchant/Shop/MailScreen';
import AccountScreen from '../screen/Merchant/Shop/AccountScreen';
import HistoryWithDraw from '../screen/WithDraw/HistoryWithDraw';
import DetailShop from '../screen/Merchant/Shop/DetailShop';
import ProductMerchant from '../screen/Merchant/ProductMerchant';
import UpdateShop from '../screen/Merchant/Shop/UpdateShop';
import ListStore from '../screen/Home/ListStore';
import DetailStore from '../screen/Home/DetailStore';
import DetailProduct from '../screen/Home/DetailProduct';
import DetailCart from '../screen/Home/DetailCart';
import AddItems from '../screen/Merchant/Shop/MenuScreen/AddItems';
import UpdateItem from '../screen/Merchant/Shop/MenuScreen/UpdateItems';
import PromoTypes from '../screen/Merchant/Shop/Promo/PromoTypes';
import CreatePromo from '../screen/Merchant/Shop/Promo/CreatePromo';
import DetailOrder from '../screen/DetailOrder';
import PaymentOrder from '../screen/PaymentOrder';
import OrderProcess from '../screen/PaymentOrder/OrderProcess';
import PromoList from '../screen/Merchant/Shop/Promo/PromoList';
import OrderDetailScreen from '../screen/Merchant/Shop/OrderScreen/OrderDetailScreen';
import OrderDetailCancel from '../screen/Merchant/Shop/OrderScreen/OrderDetailCancel';
import MyDetailOrder from '../screen/MyOrder/MyDetailOrder';
import ShareBill from '../screen/ShareBill';
import ChooseSharer from '../screen/ShareBill/ChooseSharer';
import DetailBill from '../screen/ShareBill/DetailBill';
import SendRequestShare from '../screen/ShareBill/SendRequestShare';
import NotiShareBill from '../screen/Notification/NotiShareBill';
import PromoCode from '../screen/DetailOrder/PromoCode';
import FinalShareBillDetail from '../screen/ShareBill/DetailBill/finalShareBillDetail';
import PaymentTypes from '../screen/PaymentOrder/PaymentTypes';
import DetailTransaction from '../screen/DetailTransaction';

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
    name: 'MainTabM',
    component: BottomTabStackMerchant,
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
    name: 'RegisterMerchant',
    component: RegisterMerchant,
  },
  {name: 'WithDraw', component: WithDraw},
  {name: 'WithDrawInfo', component: WithDrawInfo},
  {
    name: 'Support',
    component: SupportStudent,
  },
  {
    name: 'Friends',
    component: Friends,
  },
  {
    name: 'DetailFriend',
    component: DetailFriend,
  },
  {
    name: 'PaymentDetails',
    component: PaymentDetails,
  },
  {
    name: 'MyOrder',
    component: MyOrder,
  },
  {
    name: 'QR',
    component: QR,
  },
  {
    name: 'Demo',
    component: Demo,
  },
  {
    name: 'NotiScreen',
    component: NotiScreen,
  },
  {
    name: 'OrderScreen',
    component: OrderScreen,
  },
  {
    name: 'MenuScreen',
    component: MenuScreen,
  },
  {
    name: 'MailScreen',
    component: MailScreen,
  },
  {
    name: 'AccountScreen',
    component: AccountScreen,
  },
  {
    name: 'HistoryWithDraw',
    component: HistoryWithDraw,
  },
  {
    name: 'DetailShop',
    component: DetailShop,
  },
  {
    name: 'ProductMerchant',
    component: ProductMerchant,
  },
  {
    name: 'UpdateShop',
    component: UpdateShop,
  },
  {
    name: 'ListStore',
    component: ListStore,
  },
  {
    name: 'DetailStore',
    component: DetailStore,
  },
  {name: 'DetailProduct', component: DetailProduct},
  {name: 'DetailCart', component: DetailCart},
  {name: 'AddItems', component: AddItems},
  {name: 'UpdateItem', component: UpdateItem},
  {name: 'PromoType', component: PromoTypes},
  {name: 'CreatePromo', component: CreatePromo},
  {
    name: 'DetailOrder',
    component: DetailOrder,
  },
  {
    name: 'PaymentOrder',
    component: PaymentOrder,
  },
  {
    name: 'OrderProcess',
    component: OrderProcess,
  },
  {
    name: 'PromoList',
    component: PromoList,
  },
  {
    name: 'OrderDetailScreen',
    component: OrderDetailScreen,
  },
  {
    name: 'OrderDetailCancel',
    component: OrderDetailCancel,
  },
  {
    name: 'MyDetailOrder',
    component: MyDetailOrder,
  },
  {
    name: 'ShareBill',
    component: ShareBill,
  },
  {
    name: 'ChooseSharer',
    component: ChooseSharer,
  },
  {
    name: 'DetailBill',
    component: DetailBill,
  },
  {
    name: 'SendRequestShare',
    component: SendRequestShare,
  },
  {
    name: 'NotiShareBill',
    component: NotiShareBill,
  },
  {
    name: 'PromoCode',
    component: PromoCode,
  },
  {
    name: 'FinalShareBillDetail',
    component: FinalShareBillDetail,
  },
  {
    name: 'PaymentTypes',
    component: PaymentTypes,
  },
  {
    name: 'DetailTransaction',
    component: DetailTransaction,
  },
];
