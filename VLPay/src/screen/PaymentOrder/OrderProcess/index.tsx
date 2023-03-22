import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import OrderIcon from '../../../assets/svg/order1.svg';
import PrepareIcon from '../../../assets/svg/order2.svg';
import DoneIcon from '../../../assets/svg/done_order.svg';
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
import {myCart, Order} from '../../../store/cart';
import {axiosClient} from '../../../components/apis/axiosClient';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {formatCurrency} from '../../../components/helper';
import {MainStackNavigation} from '../../../stack/Navigation';
import Modal from 'react-native-modal';
import ModalProvider from '../../../context/ModalProvider';
import HeaderModal from '../../../components/CustomCancelOrder/HeaderModal';
import BodyModal from '../../../components/CustomCancelOrder/BodyModal';
import Toast from 'react-native-toast-message';

type State = 'pending' | 'accepted' | 'processing' | 'finished';

const OrderProcess = ({route}: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const {modalVisible, toggleModal, closeModal} = ModalProvider();
  const {order_id, store_id} = route.params;

  const [state, setState] = useState<State>('finished');
  const [cart, setCart] = useState<myCart>();
  const [totalItem, setTotalItem] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order>();

  const isFocused = useIsFocused();

  console.log('MY ORDER', order_id);
  console.log('store id', store_id);
  console.log(order?.order_code);

  //Taken
  const takenOrder = () => {
    Toast.show({
      type: 'success',
      text1: 'Thành công',
      text2: 'Bạn đã nhận hàng thành công!',
    });
    navigation.navigate('Home');
  };

  //Get Order
  const getOrder = useCallback(async () => {
    setLoading(true);
    const result = await axiosClient.get(`/order/detail?order_id=${order_id}`);
    setOrder(result.data.data);
    setLoading(false);
  }, []);

  const CancelOrder = useCallback(async () => {
    const formData = new FormData();
    formData.append('order_id', order_id);
    formData.append('reason', 'I like');
    try {
      const result = await axiosClient.post('/order/cancel-order', formData, {
        headers: {'content-type': 'multipart/form-data'},
      });
      console.log(result.data);
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Bạn đã hủy đơn hàng thành công!',
      });
      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      getOrder();
    }
  }, [getOrder, isFocused]);

  const renderComponent = () => {
    switch (order?.status) {
      case 'pending':
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
                #{order?.order_code}
              </Text>
            </Text>
            <Divider />
            <VStack padding={5}>
              <Text fontWeight={'bold'} color="#000000">
                {order?.store.location}: {order?.store.name}
              </Text>
              <Text fontSize={12} color="#818181">
                {formatCurrency((order?.order_total ?? 0).toString())}đ
              </Text>
              <Text fontSize={12} color="#818181">
                {order?.user.f_name} - {order?.user.phone}
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
                  {order?.product_detail.map(item => (
                    <HStack
                      marginY={1}
                      alignItems={'center'}
                      justifyContent="space-between">
                      <VStack>
                        <HStack key={item.id} alignItems={'center'}>
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
                  {order?.discount_amount}
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
                  {formatCurrency((order?.order_total ?? 0).toString())}đ
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
                  #{order?.order_code}
                </Text>
              </HStack>
              <HStack
                paddingY={1}
                alignItems={'center'}
                justifyContent="space-between">
                <Text color="#818181">Thời gian đặt hàng</Text>
                <Text color="#818181" paddingLeft={1}>
                  Hôm nay, {order?.created_at}
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
              <TouchableOpacity onPress={toggleModal}>
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

            <Modal
              isVisible={modalVisible}
              animationIn="slideInUp"
              animationOut="fadeOutDown"
              style={{
                margin: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 230,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 15,
                }}>
                <HeaderModal onPress={closeModal} />
                <BodyModal
                  cancel="cancel"
                  confirm="confirm"
                  onPressCancel={CancelOrder}
                  onPressConfirm={closeModal}
                />
              </View>
            </Modal>
          </View>
        );
      case 'accepted':
      case 'processing':
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
                #{order?.order_code}
              </Text>
            </Text>
            <Divider />
            <VStack padding={5}>
              <Text fontWeight={'bold'} color="#000000">
                {order?.store.location}: {order?.store.name}
              </Text>
              <Text fontSize={12} color="#818181">
                {formatCurrency((order?.order_total ?? 0).toString())}đ
              </Text>
              <Text fontSize={12} color="#818181">
                {order?.user.f_name} - {order?.user.phone}
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
                  {order?.product_detail.map(item => (
                    <HStack
                      marginY={1}
                      alignItems={'center'}
                      justifyContent="space-between">
                      <VStack>
                        <HStack key={item.id} alignItems={'center'}>
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
                  {order?.discount_amount}
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
                  {formatCurrency((order?.order_total ?? 0).toString())}đ
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
                  #{order?.order_code}
                </Text>
              </HStack>
              <HStack
                paddingY={1}
                alignItems={'center'}
                justifyContent="space-between">
                <Text color="#818181">Thời gian đặt hàng</Text>
                <Text color="#818181" paddingLeft={1}>
                  Hôm nay, {order?.created_at}
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
      case 'finished':
        return (
          <View>
            <Center marginY={5}>
              <Heading paddingBottom={5}>Đã đặt đơn</Heading>
              <DoneIcon />
            </Center>
            <Divider />
            <Text padding={5}>
              Mã đơn hàng:{' '}
              <Text fontWeight={'bold'} color="#000000">
                #{order?.order_code}
              </Text>
            </Text>
            <Divider />
            <VStack padding={5}>
              <Text fontWeight={'bold'} color="#000000">
                {order?.store.location}: {order?.store.name}
              </Text>
              <Text fontSize={12} color="#818181">
                {formatCurrency((order?.order_total ?? 0).toString())}đ
              </Text>
              <Text fontSize={12} color="#818181">
                {order?.user.f_name} - {order?.user.phone}
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
                  {order?.product_detail.map(item => (
                    <HStack
                      marginY={1}
                      alignItems={'center'}
                      justifyContent="space-between">
                      <VStack>
                        <HStack key={item.id} alignItems={'center'}>
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
                  {order?.discount_amount}
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
                  {formatCurrency((order?.order_total ?? 0).toString())}đ
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
                  #{order?.order_code}
                </Text>
              </HStack>
              <HStack
                paddingY={1}
                alignItems={'center'}
                justifyContent="space-between">
                <Text color="#818181">Thời gian đặt hàng</Text>
                <Text color="#818181" paddingLeft={1}>
                  Hôm nay, {order?.created_at}
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
              <TouchableOpacity onPress={takenOrder}>
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
                    Đã nhận hàng
                  </Text>
                </View>
              </TouchableOpacity>
            </VStack>
          </View>
        );
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
