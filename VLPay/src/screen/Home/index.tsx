import {ScrollView} from 'react-native';
import React from 'react';
import Header from './Header';
import Banner from './Banner';
import ManageCash from './ManageCash';
import ContentWallet from './ContentWallet';
import PromoCarousel from './PromoCarousel';

type Props = {};

const Index = (props: Props) => {
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
