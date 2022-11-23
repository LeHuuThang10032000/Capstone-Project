import {ScrollView} from 'react-native';
import React from 'react';
import Header from './Header';
import Banner from './Banner';
import ManageCash from './ManageCash';
import ContentWallet from './ContentWallet';
import PromoCarousel from './PromoCarousel';
import {useSelector} from 'react-redux';
import Login from '../Login';

type Props = {};
const Index = (props: Props) => {
  const token = useSelector(state => state.authReducer.authToken);

  if (!token) {
    return <Login />;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Header />
      <Banner />
      <ManageCash />
      <ContentWallet />
      <PromoCarousel />
    </ScrollView>
  );
};

export default Index;
