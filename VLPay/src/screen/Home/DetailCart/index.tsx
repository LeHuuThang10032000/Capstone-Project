import {StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import useCartStore, {CartItem, myCart} from '../../../store/cart';
import {
  Text,
  HStack,
  Image,
  ScrollView,
  VStack,
  View,
  Center,
  Heading,
  Input,
} from 'native-base';
import HeaderBack from '../../../components/HeaderBack';
import IncreaseIcon from '../../../assets/svg/increase.svg';
import DecreaseIcon from '../../../assets/svg/decrease.svg';
import {formatCurrency} from '../../../components/helper';
import Lottie from 'lottie-react-native';
import {axiosClient} from '../../../components/apis/axiosClient';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../../stack/Navigation';

type Props = {};

let limit = 0;
const DetailCart = ({route}: any) => {
  const {width} = useWindowDimensions();
  const isFocused = useIsFocused();
  const navigation = useNavigation<MainStackNavigation>();

  const [cart, setCart] = useState<myCart>();
  const [totalItem, setTotalItem] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const {store_id} = route.params;

  console.log('CART:', cart);

  //Get Cart
  const getCart = useCallback(async () => {
    setLoading(true);
    const result = await axiosClient.get('/cart');
    setCart(result?.data?.data);
    setTotalItem(result?.data?.data?.total_quantity);
    setLoading(false);
  }, []);

  //Delete Cart
  const deleteCart = useCallback(async () => {
    const result = await axiosClient.delete('/cart');
    getCart();
  }, []);

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      getCart();
    }
  }, [getCart, isFocused]);

  useEffect(() => {
    setTimeout(() => {
      limit = 0;
    }, 1000);
  });

  return (
    <View style={{backgroundColor: '#ffffff', flex: 1}}>
      <HeaderBack title="Giỏ hàng" TrashIcon={true} onPress={deleteCart} />
      {isLoading ? (
        <Center flex={1}>
          <Lottie
            source={require('../../../assets/lottie-file/loading.json')}
            autoPlay={true}
            style={{width: 100, height: 100}}
          />
        </Center>
      ) : (
        <View flex={1}>
          <ScrollView flex={1}>
            {/* Render list cart */}
            {totalItem > 0 ? (
              cart?.products.map(item => {
                return (
                  <HStack
                    justifyContent={'space-between'}
                    alignItems="center"
                    key={item.id}
                    borderBottomWidth={1}
                    borderBottomColor="#B2BABB"
                    paddingY={5}
                    marginX={5}>
                    <HStack alignItems={'center'}>
                      <Image
                        source={{uri: item.image}}
                        width={52}
                        height={52}
                        borderWidth={1}
                        borderColor="#000"
                        alt="product"
                      />
                      <VStack paddingLeft={5}>
                        <Text fontSize={16}>{item.name}</Text>
                        {item.add_ons.map(item => (
                          <Text key={item.id} color={'#747980'}>
                            {item.name}
                          </Text>
                        ))}
                        <Text>
                          {formatCurrency((item?.total_price ?? 0).toString())}đ
                        </Text>
                      </VStack>
                    </HStack>
                    <HStack alignItems={'center'}>
                      <TouchableOpacity
                        onPress={async () => {
                          const formData = new FormData();
                          const _quantity = item.quantity - 1;
                          formData.append('product_id', item?.id);
                          formData.append('store_id', store_id);
                          formData.append('quantity', _quantity);

                          console.log(item);

                          if (item?.add_ons.length > 0) {
                            item?.add_ons.forEach((number, index) => {
                              formData.append('add_ons[]', number.id);
                            });
                          } else {
                            formData.append('add_ons[]', '');
                          }
                          console.log(formData);

                          await axiosClient.post('/cart/update', formData, {
                            headers: {
                              'content-type': 'multipart/form-data',
                            },
                          });
                          getCart();
                        }}>
                        <DecreaseIcon />
                      </TouchableOpacity>
                      <View style={{width: 50}}>
                        <Input
                          keyboardType="number-pad"
                          value={item.quantity.toString()}
                          onChangeText={async text => {
                            if (text.length > 0) {
                              if (
                                parseInt(
                                  text
                                    .trim()
                                    .replace('.', '')
                                    .replace(',', '')
                                    .replace('-', ''),
                                ) >= 0
                              ) {
                                const formData = new FormData();
                                const _quantity = item.quantity + 1;
                                formData.append('product_id', item?.id);
                                formData.append('store_id', store_id);
                                formData.append(
                                  'quantity',
                                  parseInt(
                                    text
                                      .trim()
                                      .replace('.', '')
                                      .replace(',', '')
                                      .replace('-', ''),
                                  ),
                                );
                                if (item?.add_ons.length > 0) {
                                  item?.add_ons.forEach((number, index) => {
                                    formData.append('add_ons[]', number.id);
                                  });
                                } else {
                                  formData.append('add_ons[]', '');
                                }
                                console.log('==>', item?.add_ons.length);

                                await axiosClient.post(
                                  '/cart/update',
                                  formData,
                                  {
                                    headers: {
                                      'content-type': 'multipart/form-data',
                                    },
                                  },
                                );
                                getCart();
                              } else {
                              }
                            }
                          }}
                        />
                      </View>
                      <TouchableOpacity
                        onPress={async () => {
                          const formData = new FormData();
                          const _quantity = item.quantity + 1;
                          formData.append('product_id', item?.id);
                          formData.append('store_id', store_id);
                          formData.append('quantity', _quantity);
                          if (item?.add_ons.length > 0) {
                            item?.add_ons.forEach((number, index) => {
                              formData.append('add_ons[]', number.id);
                            });
                          } else {
                            formData.append('add_ons[]', '');
                          }
                          console.log('==>', item?.add_ons.length);

                          await axiosClient.post('/cart/update', formData, {
                            headers: {'content-type': 'multipart/form-data'},
                          });
                          getCart();
                        }}>
                        <IncreaseIcon />
                      </TouchableOpacity>
                    </HStack>
                  </HStack>
                );
              })
            ) : (
              // cart?.products.map(item => <Text>{item.name}</Text>)
              <View height={500}>
                <Center flex={1}>
                  <Lottie
                    source={require('../../../assets/lottie-file/empty-red.json')}
                    autoPlay={true}
                    style={{width: 300, height: 300}}
                  />
                  <Heading size={'sm'}>
                    Chưa có sản phẩm nào trong giỏ hàng
                  </Heading>
                </Center>
              </View>
            )}
          </ScrollView>
          {totalItem > 0 ? (
            <View paddingY={5} paddingX={5}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('DetailOrder', {
                    store_id: store_id,
                    phone: cart?.store.phone,
                    name: cart?.store.name,
                    image: cart?.store.image,
                  });
                }}>
                <View
                  justifyContent="center"
                  alignItems={'center'}
                  style={{
                    width: '100%',
                    padding: 20,
                    backgroundColor: '#B5EAD8',
                    borderRadius: 10,
                  }}>
                  <Text color={'#000000'} fontWeight="bold" fontSize={16}>
                    {`Xem đơn hàng: ${formatCurrency(
                      (cart?.total_price ?? 0).toString(),
                    )}đ`}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};

export default DetailCart;

const styles = StyleSheet.create({});
