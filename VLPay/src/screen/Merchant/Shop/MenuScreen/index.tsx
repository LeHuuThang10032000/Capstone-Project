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
  const [addons, setAddons] = useState([]);
  const [store_di, setStore_id] = useState(0);
  const fetchData = async () => {
    try {
      const result = await axiosClient.get(baseUrl + 'merchant/store');
      const products = await axiosClient.get(baseUrl + 'merchant/menu/?store_id=' + result.data.data.id);
      const addons = await axiosClient.get(baseUrl + 'merchant/add-on?store_id=' + result.data.data.id);
      setProducts(products.data.data);
      setAddons(addons.data.data);
      setStoreInfo(result.data.data);
      setStore_id(result.data.data.id)

    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <HeaderComp title="Quản lý menu" />
      <Image source={{ uri: storeInfo.image }}
        style={{ width: '100%', height: '25%' }} alt={'hell o'} resizeMode={'cover'} />
      <Text style={styles.titles}>{storeInfo.name}</Text>
      <View style={styles.btnWrapper}>
        <TouchableOpacity style={styles.buttons} onPress={() => {
          const item = {
            'products': products,
            'addons': addons,
            'store_id': store_di
          }
          navigation.navigate('ProductMerchant', {
            data: item
          });
        }}>
          <Text style={styles.btnTitle}>Thêm món Mới hoặc danh sách</Text>
        </TouchableOpacity>
      </View>
      <View>

      </View>
    </View>
  );
};

export default MenuScreen;
