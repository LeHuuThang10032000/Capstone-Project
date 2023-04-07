import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Header from './Header';
import Banner from './Banner';
import ManageCash from './ManageCash';
import ContentWallet from './ContentWallet';
import PromoCarousel from './PromoCarousel';
import {Init} from '../../redux/actions/authAction';
import Login from '../Login';
import {useDispatch, useSelector} from 'react-redux';
import {axiosClient} from '../../components/apis/axiosClient';
import {formatCurrency} from '../../components/helper';
import ListStore from './ListStore';
import {Heading, HStack, Image, VStack} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';
import ShareBillComp from './ShareBillComp';

interface Post {
  id: number;
  phone: string;
  image: string;
  name: string;
  location: string;
}

const Index = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const token = useSelector((state: any) => state.authReducer.authToken);
  const [userWallet, setUserWallet] = useState(0);
  const [credit, setCredit] = useState(0);
  const [isloading, setIsloading] = useState(false);
  const [needPay, setNeedPay] = useState(0);
  const [paidBill, setPaidBill] = useState(0);

  console.log('need pay', needPay);

  const fetchData = useCallback(async () => {
    const result = await axiosClient.get('/user-wallet');
    setUserWallet(result?.data?.data?.balance);
    setCredit(result?.data?.data?.credit_limit);
    setNeedPay(result?.data?.data?.need_pay);
    setPaidBill(result?.data?.data?.paid_bill);
    setIsloading(true);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(fetchData, 2000);

    return () => clearInterval(intervalId);
  }, [fetchData]);
  const dispatch = useDispatch();
  const init = async () => {
    dispatch(await Init());
  };
  useEffect(() => {
    init();
  });
  return (
    <>
      {token ? (
        <ScrollView
          style={{backgroundColor: '#fff'}}
          showsVerticalScrollIndicator={false}>
          <Header />
          <Banner wallet={userWallet} />
          <ManageCash wallet={userWallet} credit={credit} loading={isloading} />
          <ContentWallet />
          <ShareBillComp
            need_pay={needPay}
            paid_bill={paidBill}
            wallet={userWallet}
          />
          <PromoCarousel />
          <ListStore />
        </ScrollView>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Index;
