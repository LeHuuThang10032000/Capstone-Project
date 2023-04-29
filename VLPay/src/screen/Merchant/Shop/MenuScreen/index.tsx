import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import HeaderComp from '../../../../components/HeaderComp';
import styles from './styles';
import {axiosClient} from '../../../../components/apis/axiosClient';
import {baseUrl} from '../../../../components/apis/baseUrl';
import {Center, HStack, Image, VStack} from 'native-base';
import Button from '../../../Settings/MyButton';
import {MainStackNavigation} from '../../../../stack/Navigation';
import {useNavigation} from '@react-navigation/native';
import {Menu, MenuItem} from 'react-native-material-menu';
import Icons from '../../../../components/Icons';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {UText} from '../../../../components/UText';
import Lottie from 'lottie-react-native';

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
  const [isLoading, setLoading] = useState(false);

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['10%', '50%'], []);

  // callbacks5
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {}, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await axiosClient.get(baseUrl + 'merchant/store');

      console.log('result.data');
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

      setLoading(false);
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

  useEffect(() => {
    const backAction = () => {
      bottomSheetModalRef.current?.close();
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

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

  console.log('products', products);

  const DataList = ({data}) => {
    return (
      <ScrollView style={{paddingHorizontal: 16}}>
        <View style={{paddingBottom: 200, backgroundColor: '#ffffff'}}>
          {data &&
            data.map(
              ({id, category_name, products: _products, products_count}) => (
                <View key={id}>
                  <HStack
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    style={{marginTop: 16, marginBottom: 8}}>
                    <Text style={styles.category}>{category_name}</Text>
                    <Text>{products_count} món</Text>
                  </HStack>
                  {_products.map((item, index) => {
                    const {
                      id: productId,
                      name,
                      price,
                      image,
                      category_id,
                      add_ons,
                    } = item;
                    return (
                      <>
                        {/* <TouchableOpacity
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
                              add_ons,
                            },
                            isUpdated: true,
                          };
                          handleUpdatePress(item);
                        }}> */}
                        <View
                          key={productId}
                          style={[
                            styles.productContainer,
                            {
                              position: 'relative',
                            },
                          ]}>
                          <HStack
                            flex={1}
                            alignItems={'center'}
                            borderBottomWidth={0.5}
                            borderBottomColor={'#979797'}
                            paddingBottom={3}>
                            <Image
                              source={{uri: image}}
                              width={68}
                              height={68}
                              borderRadius={8}
                              style={{marginRight: 10}}
                            />
                            <VStack>
                              <Text style={styles.productName}>{name}</Text>
                              <Text style={styles.price}>
                                {price.toLocaleString()}đ
                              </Text>
                            </VStack>
                          </HStack>
                          {selectedProduct === item.id && (
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
                                      add_ons,
                                    },
                                    isUpdated: true,
                                  };
                                  handleUpdatePress(item);
                                }}>
                                Cập nhật
                              </MenuItem>
                              <MenuItem
                                onPress={async () => {
                                  try {
                                    console.log({
                                      store_id: store_di,
                                      name: name,
                                      product_id: productId,
                                      price: price,
                                      image: image,
                                      category_id: category_id,
                                      add_ons: JSON.stringify(add_ons),
                                      status: 'unavailable',
                                    });

                                    await axiosClient.post(
                                      baseUrl + 'merchant/product/update',
                                      {
                                        store_id: store_di,
                                        name: name,
                                        product_id: productId,
                                        price: price,
                                        image: image,
                                        category_id: category_id,
                                        add_ons: JSON.stringify(add_ons),
                                        status: 'unavailable',
                                      },
                                      {
                                        headers: {
                                          'content-type': 'multipart/form-data',
                                        },
                                      },
                                    );
                                    console.log('Ok rui nha bro');
                                    fetchData();
                                  } catch (e) {
                                    // setVisibleWarning(true);
                                    console.log('e ->>>>', e);
                                  }
                                  setVisible(false);
                                }}>
                                Xoá
                              </MenuItem>
                            </Menu>
                          )}
                          <TouchableOpacity
                            onPress={e => showMenu(item.id, e)}
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
                        {/* </TouchableOpacity> */}
                      </>
                    );
                  })}
                </View>
              ),
            )}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={{flex: 1}}>
      <BottomSheetModalProvider>
        <HeaderComp title="Quản lý menu" />
        {isLoading ? (
          <Center flex={1} backgroundColor="#ffffff">
            <Lottie
              source={require('../../../../assets/lottie-file/loading.json')}
              autoPlay={true}
              style={{width: 100, height: 100}}
            />
          </Center>
        ) : (
          <View style={{backgroundColor: '#ffffff', flex: 1}}>
            <Image
              source={{uri: storeInfo.image}}
              style={{width: '100%', height: '25%'}}
              alt={'img'}
              resizeMode={'cover'}
            />
            <Text style={styles.titles}>{storeInfo.name}</Text>
            {products[0] && <DataList data={products} />}
            <View
              style={{
                backgroundColor: '#ffffff',
                width: '100%',
                position: 'absolute',
                bottom: 0,
                flexDirection: 'row',
                justifyContent: 'center',
                padding: 20,
              }}>
              <TouchableOpacity
                onPress={handlePresentModalPress}
                style={{
                  backgroundColor: '#B5EAD8',
                  width: '100%',
                  paddingVertical: 10,
                  borderRadius: 10,
                }}>
                <UText
                  style={{
                    alignSelf: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                  }}>
                  Thêm món mới hoặc danh sách
                </UText>
              </TouchableOpacity>
            </View>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}>
              <View style={styles.contentContainer}>
                <Text style={{fontWeight: '700', fontSize: 16, color: 'black'}}>
                  Thêm danh sách / món mới
                </Text>
                <TouchableOpacity
                  style={styles.btnTab}
                  onPress={() => {
                    const item = {
                      products: products,
                      addons: addons,
                      store_id: store_di,
                      isAddCategories: true,
                    };
                    navigation.navigate('AddItems', {
                      data: item,
                    });
                    bottomSheetModalRef.current?.close();
                  }}>
                  <UText>Thêm danh sách mới</UText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnTab}
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
                    bottomSheetModalRef.current?.close();
                  }}>
                  <UText>Thêm món mới</UText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnTab}
                  onPress={() => {
                    const item = {
                      products: products,
                      addons: addons,
                      store_id: store_di,
                      isAddCategories: false,
                    };
                    navigation.navigate('AddItems', {
                      data: item,
                    });
                    bottomSheetModalRef.current?.close();
                  }}>
                  <UText>Món thêm</UText>
                </TouchableOpacity>
              </View>
            </BottomSheetModal>
          </View>
        )}
      </BottomSheetModalProvider>
    </View>
  );
};
export default MenuScreen;
