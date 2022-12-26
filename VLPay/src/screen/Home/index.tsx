import {ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import Header from './Header';
import Banner from './Banner';
import ManageCash from './ManageCash';
import ContentWallet from './ContentWallet';
import PromoCarousel from './PromoCarousel';
import {useDispatch, useSelector} from 'react-redux';
import Login from '../Login';
import {useNavigation} from '@react-navigation/native';
import {Init} from '../../redux/actions/authAction';

const Index = () => {
  const token = useSelector((state: any) => state.authReducer.authToken);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const init = async () => {
    dispatch(await Init());
  };

  useEffect(() => {
    init();
    if (!token) {
      navigation.setOptions({
        tabBarStyle: {display: 'none'},
      });
    } else {
      navigation.setOptions({
        tabBarStyle: {display: 'flex'},
      });
    }
  }, [navigation, token]);

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
