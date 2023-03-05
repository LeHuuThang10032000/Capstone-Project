import { View, Text, TouchableOpacity, FlatList, ScrollView, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import HeaderComp from '../../../../components/HeaderComp';
import styles from './styles';
import { axiosClient } from '../../../../components/apis/axiosClient';
import { baseUrl } from '../../../../components/apis/baseUrl';
import { Image } from 'native-base';
import Button from '../../../Settings/MyButton';
import { MainStackNavigation } from '../../../../stack/Navigation';
import { useNavigation } from '@react-navigation/native';
import {Menu, MenuItem } from 'react-native-material-menu';
import Icons from '../../../../components/Icons';

type Props = {};
const MenuScreen = (props: Props) => {
const navigation = useNavigation<MainStackNavigation>();
  const [storeInfo, setStoreInfo] = useState([]);
  const [products, setProducts] = useState([]);
  const [addons, setAddons] = useState([]);
  const [store_di, setStore_id] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visible, setVisible] = useState(false);

  const fetchData = async () => {
    try {
      const result = await axiosClient.get(baseUrl + 'merchant/store');
      const products = await axiosClient.get(baseUrl + 'merchant/menu/?store_id=' + result.data.data.id);
      const addons = await axiosClient.get(baseUrl + 'merchant/add-on?store_id=' + result.data.data.id);

      setProducts(products.data.data);
      setAddons(addons.data.data);
      setStoreInfo(result.data.data);
      setStore_id(result.data.data.id);

      console.log(products);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdatePress = (product) => {
    setVisible(false);
    console.log(123);
    
  };

  const showMenu = (productId) => {
    setSelectedProduct(productId)
    setVisible(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);
 
  console.log('selectedProduct',selectedProduct);
  
  const DataList = ({ data }) => {
    return (
      <View style={styles.container}>
        {data.map(({ id, category_name, products }) => (
          <View key={id}>
            <Text style={styles.category}>{category_name}</Text>
            {products.map(({ id: productId, name, price }) => (
              <View key={productId} style={styles.productContainer}>
                <Text style={styles.productName}>{name}</Text>
                {console.log('productId',selectedProduct === productId)
                }
                {selectedProduct === productId && (
                      <Menu
                        visible={visible}
                        style={{
                          
                        }}>
                          <MenuItem onPress={() => handleUpdatePress({ id: productId, name, price })}>Update</MenuItem>
                      </Menu>
                )}
                <TouchableOpacity onPress={() => showMenu(productId)} style={{ height: 20, flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontSize: 20}}><Icons.ThreeHorizontalDot/></Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };
console.log('products',products);

  return (
    <View style={{ flex: 1 }}>
      <HeaderComp title="Quản lý menu" />
      <Image source={{ uri: storeInfo.image }}
        style={{ width: '100%', height: '25%' }} alt={'hell o'} resizeMode={'cover'} />
      <Text style={styles.titles}>{storeInfo.name}</Text>
        {products[0] && <DataList data={products} />}
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
      }
export default MenuScreen;
