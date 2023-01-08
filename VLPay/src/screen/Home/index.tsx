import {ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from './Header';
import Banner from './Banner';
import ManageCash from './ManageCash';
import ContentWallet from './ContentWallet';
import PromoCarousel from './PromoCarousel';
import {Init} from '../../redux/actions/authAction';
import Login from '../Login';
import {useDispatch, useSelector} from 'react-redux';
import {axiosClient} from '../../components/apis/axiosClient';

const Index = () => {
  const token = useSelector((state: any) => state.authReducer.authToken);
  const [userWallet, setUserWallet] = useState(0);
  const fetchData = async () => {
    setInterval(async () => {
      const result = await axiosClient.get('user-wallet');
      setUserWallet(result?.data?.user_wallet?.balance);
    }, 5000);
  };
  useEffect(() => {
    fetchData();
  }, []);
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header />
          <Banner wallet={userWallet} />
          <ManageCash wallet={userWallet} />
          <ContentWallet />
          <PromoCarousel />
        </ScrollView>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Index;
