import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import OrderIcon from '../../../assets/svg/order1.svg';
import PrepareIcon from '../../../assets/svg/order2.svg';
import {
  Center,
  Divider,
  Heading,
  HStack,
  Text,
  View,
  VStack,
} from 'native-base';
import {ScrollView} from 'react-native-gesture-handler';
import {myCart} from '../../../store/cart';
import {axiosClient} from '../../../components/apis/axiosClient';
import {useIsFocused} from '@react-navigation/native';
import {formatCurrency} from '../../../components/helper';

type State = 'loading' | 'error' | 'success';

const OrderProcess = () => {
  const [state, setState] = useState<State>('error');
  const [cart, setCart] = useState<myCart>();
  const [totalItem, setTotalItem] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const isFocused = useIsFocused();

  console.log(cart);

  //Get Cart
  const getCart = useCallback(async () => {
    setLoading(true);
    const result = await axiosClient.get('/cart');
    setCart(result?.data?.data);
    setTotalItem(result?.data?.data?.total_quantity);
    setTotalPrice(result?.data?.data?.total_price);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      getCart();
    }
  }, [getCart, isFocused]);

  const renderComponent = () => {
    switch (state) {
      case 'loading':
        return (
          <View>
            <Center marginY={5}>
              <Heading paddingBottom={5}>Đã đặt đơn</Heading>
              <OrderIcon />
            </Center>
            <Divider />
            <Text padding={5}>
              Mã đơn hàng:{' '}
              <Text fontWeight={'bold'} color="#000000">
                #9876
              </Text>
            </Text>
            <Divider />
            <VStack padding={5}>
              <Text fontWeight={'bold'} color="#000000">
                Kios số 10: Trà sữa May
              </Text>
              <Text fontSize={12} color="#818181">
                180,000đ - 2 món - Ví VLpay
              </Text>
              <Text fontSize={12} color="#818181">
                Nguyễn Hoàng - 0979797979
              </Text>
            </VStack>
            <Divider />
            <VStack padding={5}>
              <Text fontWeight={'bold'} fontSize={16} color="#000000">
                Kios số 10: Trà sữa May
              </Text>
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <>
                  {cart?.products.map(item => (
                    <HStack
                      marginY={1}
                      alignItems={'center'}
                      justifyContent="space-between">
                      <VStack>
                        <HStack alignItems={'center'}>
                          <Text
                            fontSize={16}
                            fontWeight={'bold'}
                            color="#000000">
                            {item.name}
                          </Text>
                          <Text paddingLeft={1}>({item.quantity})</Text>
                        </HStack>
                        {item.add_ons.map(item => (
                          <Text key={item.id} color={'#747980'}>
                            {item.name}
                          </Text>
                        ))}
                      </VStack>
                      <Text fontWeight={'bold'} fontSize={16}>
                        {formatCurrency((item?.price ?? 0).toString())}đ
                      </Text>
                    </HStack>
                  ))}
                </>
              )}
              <HStack
                paddingY={3}
                alignItems={'center'}
                justifyContent="space-between">
                <Text color="#818181">Giảm giá</Text>
                <Text color="#818181" paddingLeft={1}>
                  35.000đ
                </Text>
              </HStack>
              <HStack alignItems={'center'} justifyContent="space-between">
                <Text fontSize={16} fontWeight={'bold'} color="#000000">
                  {`Tổng (${totalItem} món)`}
                </Text>
                <Text
                  fontSize={16}
                  fontWeight={'bold'}
                  color="#000000"
                  paddingLeft={1}>
                  {formatCurrency((totalPrice ?? 0).toString())}đ
                </Text>
              </HStack>
              <Text
                fontSize={16}
                paddingTop={5}
                paddingBottom={3}
                fontWeight={'bold'}
                color="#000000">
                Chi tiết đơn hàng
              </Text>
              <HStack
                paddingY={1}
                alignItems={'center'}
                justifyContent="space-between">
                <Text color="#818181">Mã đơn hàng</Text>
                <Text color="#818181" paddingLeft={1}>
                  #9876
                </Text>
              </HStack>
              <HStack
                paddingY={1}
                alignItems={'center'}
                justifyContent="space-between">
                <Text color="#818181">Thời gian đặt hàng</Text>
                <Text color="#818181" paddingLeft={1}>
                  Hôm nay, 9:40
                </Text>
              </HStack>
              <HStack
                paddingY={1}
                alignItems={'center'}
                justifyContent="space-between">
                <Text color="#818181">Thanh toán</Text>
                <Text color="#818181" paddingLeft={1}>
                  Ví VLpay
                </Text>
              </HStack>
              <TouchableOpacity>
                <View
                  justifyContent="center"
                  alignItems={'center'}
                  marginY={5}
                  style={{
                    width: '100%',
                    padding: 10,
                    backgroundColor: '#B5EAD8',
                    borderRadius: 12,
                  }}>
                  <Text color={'#000000'} fontWeight="bold" fontSize={16}>
                    Hủy đơn
                  </Text>
                </View>
              </TouchableOpacity>
            </VStack>
          </View>
        );
      case 'error':
        return (
          <View>
            <Center marginY={5}>
              <Heading paddingBottom={5}>Đã đặt đơn</Heading>
              <PrepareIcon />
            </Center>
            <Divider />
            <Text padding={5}>
              Mã đơn hàng:{' '}
              <Text fontWeight={'bold'} color="#000000">
                #9876
              </Text>
            </Text>
            <Divider />
            <VStack padding={5}>
              <Text fontWeight={'bold'} color="#000000">
                Kios số 10: Trà sữa May
              </Text>
              <Text fontSize={12} color="#818181">
                180,000đ - 2 món - Ví VLpay
              </Text>
              <Text fontSize={12} color="#818181">
                Nguyễn Hoàng - 0979797979
              </Text>
            </VStack>
            <Divider />
            <VStack padding={5}>
              <Text fontWeight={'bold'} fontSize={16} color="#000000">
                Kios số 10: Trà sữa May
              </Text>
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <>
                  {cart?.products.map(item => (
                    <HStack
                      marginY={1}
                      alignItems={'center'}
                      justifyContent="space-between">
                      <VStack>
                        <HStack alignItems={'center'}>
                          <Text
                            fontSize={16}
                            fontWeight={'bold'}
                            color="#000000">
                            {item.name}
                          </Text>
                          <Text paddingLeft={1}>({item.quantity})</Text>
                        </HStack>
                        {item.add_ons.map(item => (
                          <Text key={item.id} color={'#747980'}>
                            {item.name}
                          </Text>
                        ))}
                      </VStack>
                      <Text fontWeight={'bold'} fontSize={16}>
                        {formatCurrency((item?.price ?? 0).toString())}đ
                      </Text>
                    </HStack>
                  ))}
                </>
              )}
              <HStack
                paddingY={3}
                alignItems={'center'}
                justifyContent="space-between">
                <Text color="#818181">Giảm giá</Text>
                <Text color="#818181" paddingLeft={1}>
                  35.000đ
                </Text>
              </HStack>
              <HStack alignItems={'center'} justifyContent="space-between">
                <Text fontSize={16} fontWeight={'bold'} color="#000000">
                  {`Tổng (${totalItem} món)`}
                </Text>
                <Text
                  fontSize={16}
                  fontWeight={'bold'}
                  color="#000000"
                  paddingLeft={1}>
                  {formatCurrency((totalPrice ?? 0).toString())}đ
                </Text>
              </HStack>
              <Text
                fontSize={16}
                paddingTop={5}
                paddingBottom={3}
                fontWeight={'bold'}
                color="#000000">
                Chi tiết đơn hàng
              </Text>
              <HStack
                paddingY={1}
                alignItems={'center'}
                justifyContent="space-between">
                <Text color="#818181">Mã đơn hàng</Text>
                <Text color="#818181" paddingLeft={1}>
                  #9876
                </Text>
              </HStack>
              <HStack
                paddingY={1}
                alignItems={'center'}
                justifyContent="space-between">
                <Text color="#818181">Thời gian đặt hàng</Text>
                <Text color="#818181" paddingLeft={1}>
                  Hôm nay, 9:40
                </Text>
              </HStack>
              <HStack
                paddingY={1}
                alignItems={'center'}
                justifyContent="space-between">
                <Text color="#818181">Thanh toán</Text>
                <Text color="#818181" paddingLeft={1}>
                  Ví VLpay
                </Text>
              </HStack>
              <TouchableOpacity disabled>
                <View
                  justifyContent="center"
                  alignItems={'center'}
                  marginY={5}
                  style={{
                    width: '100%',
                    padding: 10,
                    backgroundColor: '#D9D9D9',
                    borderRadius: 12,
                  }}>
                  <Text color={'#000000'} fontWeight="bold" fontSize={16}>
                    Hủy đơn
                  </Text>
                </View>
              </TouchableOpacity>
            </VStack>
          </View>
        );
      case 'success':
        return <Text>Success!</Text>;
      default:
        return null;
    }
  };

  return (
    <View flex={1} backgroundColor="#FFFFFF">
      <ScrollView>{renderComponent()}</ScrollView>
    </View>
  );
};

export default OrderProcess;

const styles = StyleSheet.create({});
