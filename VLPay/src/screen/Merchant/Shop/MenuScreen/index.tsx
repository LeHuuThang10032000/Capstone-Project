import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import HeaderComp from '../../../../components/HeaderComp';
import styles from './styles';
import {axiosClient} from '../../../../components/apis/axiosClient';
import {baseUrl} from '../../../../components/apis/baseUrl';
import {HStack, Image, VStack} from 'native-base';
import Button from '../../../Settings/MyButton';
import {MainStackNavigation} from '../../../../stack/Navigation';
import {useNavigation} from '@react-navigation/native';
import {Menu, MenuItem} from 'react-native-material-menu';
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
  const [menuPosition, setMenuPosition] = useState(null);
  const fetchData = async () => {
    try {
      const result = await axiosClient.get(baseUrl + 'merchant/store');
      const products = await axiosClient.get(
        baseUrl + 'merchant/menu/?store_id=' + result.data.data.id,
      );
      const addons = await axiosClient.get(
        baseUrl + 'merchant/add-on?store_id=' + result.data.data.id,
      );

      setProducts(products.data.data);
      setAddons(addons.data.data);
      setStoreInfo(result.data.data);
      setStore_id(result.data.data.id);

      console.log(products);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdatePress = item => {
    setVisible(false);
    navigation.navigate('ProductMerchant', {
      data: item,
    });
  };

  const showMenu = (productId, e) => {
    setSelectedProduct(productId);
    setVisible(true);
    setMenuPosition({x: e.nativeEvent.pageX, y: e.nativeEvent.pageY});
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

  console.log('selectedProduct', products);

  const DataList = ({data}) => {
    return (
      <ScrollView style={{paddingHorizontal: 16}}>
        {data.map(
          ({id, category_name, products: _products, products_count}) => (
            <View key={id}>
              <HStack
                alignItems={'center'}
                justifyContent={'space-between'}
                style={{marginTop: 16, marginBottom: 8}}>
                <Text style={styles.category}>{category_name}</Text>
                <Text>{products_count} món</Text>
              </HStack>
              {_products.map(
                ({id: productId, name, price, image, category_id}, index) => (
                  <>
                    <View key={productId} style={styles.productContainer}>
                      <HStack flex={1} alignItems={'center'}>
                        <Image
                          source={{uri: image}}
                          width={50}
                          height={50}
                          style={{marginRight: 10}}
                        />
                        <VStack>
                          <Text style={styles.productName}>{name}</Text>
                          <Text style={styles.price}>{price}</Text>
                        </VStack>
                      </HStack>
                      {selectedProduct === productId && (
                        <Menu
                          visible={visible}
                          onRequestClose={() => setVisible(false)}
                          style={[
                            styles.menuContainer,
                            menuPosition && {
                              top: menuPosition.y,
                              left: menuPosition.x - 90,
                            },
                          ]}>
                          <MenuItem
                            onPress={() => {
                              const item = {
                                products: products,
                                addons: addons,
                                store_id: store_di,
                                product: {
                                  id: productId,
                                  name,
                                  price,
                                  image,
                                  category_id,
                                },
                                isUpdated: true,
                              };
                              handleUpdatePress(item);
                            }}>
                            cập nhập
                          </MenuItem>
                        </Menu>
                      )}
                      <TouchableOpacity
                        onPress={e => showMenu(productId, e)}
                        style={{
                          height: 20,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={{fontSize: 20}}>
                          <Icons.ThreeHorizontalDot />
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        width: '100%',
                        height: 1,
                        backgroundColor: '#C4C4C4',
                        opacity: 0.3,
                      }}
                    />
                  </>
                ),
              )}
            </View>
          ),
        )}
        <View style={styles.btnWrapper}>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => {
              const item = {
                products: products,
                addons: addons,
                store_id: store_di,
                isUpdated: false,
              };
              navigation.navigate('ProductMerchant', {
                data: item,
              });
            }}>
            <Text style={styles.btnTitle}>Thêm món Mới hoặc danh sách</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };
  console.log('products', products);

  return (
    <View style={{flex: 1}}>
      <HeaderComp title="Quản lý menu" />
      <Image
        source={{uri: storeInfo.image}}
        style={{width: '100%', height: '25%'}}
        alt={'hell o'}
        resizeMode={'cover'}
      />
      <Text style={styles.titles}>{storeInfo.name}</Text>
      {products[0] && <DataList data={products} />}
      <View></View>
    </View>
  );
};
export default MenuScreen;
