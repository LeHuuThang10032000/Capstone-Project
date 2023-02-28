import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import HeaderComp from '../../../../components/HeaderComp';
import styles from './styles';
import { axiosClient } from '../../../../components/apis/axiosClient';
import { baseUrl } from '../../../../components/apis/baseUrl';
import { Image } from 'native-base';
import Button from '../../../Settings/MyButton';
import { MainStackNavigation } from '../../../../stack/Navigation';
import { useNavigation } from '@react-navigation/native';

type Props = {};

const MenuScreen = (props: Props) => {
  const navigation = useNavigation<MainStackNavigation>();

  const [storeInfo, setStoreInfo] = useState([]);
  const [products, setProducts] = useState([]);
  const fetchData = async () => {
    try {
      const result = await axiosClient.get(baseUrl + 'merchant/store');
      const products = await axiosClient.get(baseUrl + 'merchant/menu/?store_id=' + result.data.data.id);
      setProducts(products.data.data);
      console.log(products.data.data);
      setStoreInfo(result.data.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <HeaderComp title="Quan ly menu" />
      <Image source={{ uri: storeInfo.image }}
        style={{ width: '100%', height: '25%' }} alt={'hell o'} resizeMode={'cover'} />
      <Text style={styles.titles}>{storeInfo.name}</Text>
      <View style={styles.btnWrapper}>
        <TouchableOpacity style={styles.buttons} onPress={() => {
          navigation.navigate('ProductMerchant');
        }}>
          <Text style={styles.btnTitle}>Thêm món Mới hoặc danh sách</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MenuScreen;
