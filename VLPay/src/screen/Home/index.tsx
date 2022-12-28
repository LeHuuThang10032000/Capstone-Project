import {ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import Header from './Header';
import Banner from './Banner';
import ManageCash from './ManageCash';
import ContentWallet from './ContentWallet';
import PromoCarousel from './PromoCarousel';
import {Init} from '../../redux/actions/authAction';
import Login from '../Login';
import {useDispatch, useSelector} from 'react-redux';

const Index = () => {
  const token = useSelector((state: any) => state.authReducer.authToken);
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
          <Banner />
          <ManageCash />
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
