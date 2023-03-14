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

const DetailCart = (props: Props) => {
  const {width} = useWindowDimensions();
  const isFocused = useIsFocused();
  const navigation = useNavigation<MainStackNavigation>();

  const cartItems = useCartStore(state => state.cartItems);
  const {clearCart, incrementCartItem, decrementCartItem} = useCartStore();
  const totalPrice = useCartStore(state => state.totalPrice());
  const [cart, setCart] = useState<myCart>();
  const [totalItem, setTotalItem] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  console.log('MY CART ==>', cart);
  console.log('TOTAL Price ==>', cart?.total_price);

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
    console.log(result.data);
    getCart();
  }, []);

  //Update Cart
  // const updateCart = useCallback(async () => {
  //   const formData = new FormData();
  //   formData.append('product_id', cart?.products.);
  //   formData.append('store_id', store_id);
  //   formData.append('quantity', quantity);
  //   formData.append('add_ons[]', [checkedItems]);
  //   const result = await axiosClient.post('/cart', formData, {
  //     headers: {'content-type': 'multipart/form-data'},
  //   });
  //   console.log(result.data);
  //   getCart();
  // }, [quantity, checkedItems]);

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      getCart();
    }
  }, [getCart, isFocused]);

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
            {totalItem > 0 ? (
              cart?.products.map(item => (
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
                        {formatCurrency((item?.price ?? 0).toString())}đ
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack alignItems={'center'}>
                    <TouchableOpacity
                      onPress={() => setQuantity(item.quantity - 1)}
                      disabled={item.quantity === 1}>
                      <DecreaseIcon />
                    </TouchableOpacity>
                    <Text paddingX={5}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => setQuantity(item.quantity + 1)}>
                      <IncreaseIcon />
                    </TouchableOpacity>
                  </HStack>
                </HStack>
              ))
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
                onPress={() => navigation.navigate('DetailOrder')}>
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
