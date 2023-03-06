import {ScrollView, Text} from 'react-native';
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
import {formatCurrency} from '../../components/helper';
import ListStore from './ListStore';

const Index = () => {
  const token = useSelector((state: any) => state.authReducer.authToken);
  const [userWallet, setUserWallet] = useState(0);
  const [credit, setCredit] = useState(0);
  const [isloading, setIsloading] = useState(false);
  const fetchData = async () => {
    if (token) {
      setInterval(async () => {
        const result = await axiosClient.get('/user-wallet');
        setUserWallet(result?.data?.data?.balance);
        setCredit(result?.data?.data?.credit_limit);
        setIsloading(true);
      }, 2000);
    }
  };
  useEffect(() => {
    fetchData();
  }, [token]);
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
          <ManageCash wallet={userWallet} credit={credit} loading={isloading} />
          <ContentWallet />
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
