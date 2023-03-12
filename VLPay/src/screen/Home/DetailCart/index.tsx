import {StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native';
import React from 'react';
import useCartStore, {CartItem} from '../../../store/cart';
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

type Props = {};

const DetailCart = (props: Props) => {
  const {width} = useWindowDimensions();

  const cartItems = useCartStore(state => state.cartItems);
  const {clearCart, incrementCartItem, decrementCartItem} = useCartStore();
  const totalPrice = useCartStore(state => state.totalPrice());

  console.log(cartItems);
  return (
    <View style={{backgroundColor: '#ffffff', flex: 1}}>
      <HeaderBack title="Giỏ hàng" TrashIcon={true} onPress={clearCart} />
      {/* <Text>Total price: {totalPrice}</Text> */}
      <ScrollView flex={1}>
        {cartItems.length > 0 ? (
          cartItems.map((item: CartItem) => (
            <HStack
              justifyContent={'space-between'}
              alignItems="center"
              key={item.product.id}
              borderBottomWidth={1}
              borderBottomColor="#B2BABB"
              paddingY={5}
              marginX={5}>
              <HStack>
                <Image
                  source={{uri: item.product.image}}
                  width={52}
                  height={52}
                  borderWidth={1}
                  borderColor="#000"
                  alt="product"
                />
                <VStack paddingLeft={5}>
                  <Text>{item.product.name}</Text>
                  <Text>{item.product.price}</Text>
                </VStack>
              </HStack>
              <HStack alignItems={'center'}>
                <TouchableOpacity
                  onPress={() => decrementCartItem(item.product.id)}>
                  <DecreaseIcon />
                </TouchableOpacity>
                <Text paddingX={5}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => incrementCartItem(item.product.id)}>
                  <IncreaseIcon />
                </TouchableOpacity>
              </HStack>
            </HStack>
          ))
        ) : (
          <View height={500}>
            <Center flex={1}>
              <Lottie
                source={require('../../../assets/lottie-file/empty-red.json')}
                autoPlay={true}
                style={{width: 300, height: 300}}
              />
              <Heading size={'sm'}>Chưa có sản phẩm nào trong giỏ hàng</Heading>
            </Center>
          </View>
        )}
      </ScrollView>
      {cartItems.length > 0 ? (
        <View paddingY={5} paddingX={5}>
          <TouchableOpacity>
            <View
              justifyContent="center"
              alignItems={'center'}
              style={{
                width: '100%',
                padding: 20,
                backgroundColor: '#4285F4',
                borderRadius: 10,
              }}>
              <Text color={'#FFFFFF'} fontWeight="bold" fontSize={16}>
                {`Xem đơn hàng: ${formatCurrency(totalPrice.toString())}đ`}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default DetailCart;

const styles = StyleSheet.create({});
