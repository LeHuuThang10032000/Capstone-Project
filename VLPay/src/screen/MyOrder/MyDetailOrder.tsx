import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {MainStackNavigation, MainStackParamList} from '../../stack/Navigation';
import HeaderBack from '../../components/HeaderBack';
import {axiosClient} from '../../components/apis/axiosClient';
import {Order, myCart} from '../../store/cart';
import {
  Center,
  Divider,
  HStack,
  Heading,
  ScrollView,
  Text,
  VStack,
  View,
} from 'native-base';
import {formatCurrency} from '../../components/helper';
import Lottie from 'lottie-react-native';
import moment from 'moment';
import Modal from 'react-native-modal';
import ModalProvider from '../../context/ModalProvider';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import OrderIcon from '../../assets/svg/order1.svg';
import PrepareIcon from '../../assets/svg/order2.svg';
import DoneIcon from '../../assets/svg/done_order.svg';
import HeaderModal from '../../components/CustomCancelOrder/HeaderModal';
import BodyModal from '../../components/CustomCancelOrder/BodyModal';
import HeaderModalCode from '../../components/CustomCodeOrder/HeaderModal';
import BodyModalCode from '../../components/CustomCodeOrder/BodyModal';
type Props = {};
type State = 'pending' | 'accepted' | 'processing' | 'finished';

const MyDetailOrder = ({route}: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const {id} = useRoute<RouteProp<MainStackParamList, 'Transfer'>>()?.params;
  console.log(id);

  const {modalVisible, toggleModal, closeModal} = ModalProvider();

  const [state, setState] = useState<State>('finished');
  const [cart, setCart] = useState<myCart>();
  const [totalItem, setTotalItem] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order>();

  const isFocused = useIsFocused();

  //Taken
  const takenOrder = async () => {
    try {
      console.log(123);

      const formData = new FormData();
      formData.append('order_id', id);
      const result = await axiosClient.post('order/taken-order', formData, {
        headers: {'content-type': 'multipart/form-data'},
      });

      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Bạn đã hủy đơn hàng thành công!',
      });
      navigation.navigate('Home');
    } catch (error) {
      console.log('ho');

      console.log(error);
    }
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
    const result = await axiosClient.get(`/order/detail?order_id=${id}`);
    setOrder(result.data.data);
    console.log(result.data.data);

    setLoading(false);
  }, []);

  const CancelOrder = useCallback(async () => {
    const formData = new FormData();
    formData.append('order_id', id);
    formData.append('reason', 'I like');
    try {
      const result = await axiosClient.post('/order/cancel-order', formData, {
        headers: {'content-type': 'multipart/form-data'},
      });
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
    const intervalId = setInterval(getOrder, 2000);

    return () => clearInterval(intervalId);
  }, [getOrder]);

  console.log(order?.status);

  const renderComponent = () => {
    switch (order?.status) {
      case 'canceled':
        return (
          <View>
            <Center marginY={5}>
              <Heading paddingBottom={10}>Đơn đã hủy</Heading>
              <OrderIcon />
              <View
                justifyContent="flex-start"
                w="100%"
                paddingX={12}
                marginLeft={3}>
                <Text>{moment(order.created_at).format('HH:mm')}</Text>
              </View>
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
              <>
                {order?.product_detail.map(item => (
                  <HStack
                    marginY={1}
                    alignItems={'center'}
                    justifyContent="space-between">
                    <VStack>
                      <HStack key={item.id} alignItems={'center'}>
                        <Text paddingLeft={1} fontWeight={'bold'}>
                          {item.quantity} x{' '}
                        </Text>
                        <Text fontSize={16} fontWeight={'bold'} color="#000000">
                          {item.name}
                        </Text>
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
                  {`Tổng (${order?.product_quantity} món)`}
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
                  {moment(order?.created_at).format('dd, HH:mm')}
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
      case 'pending':
        return (
          <View>
            <Center marginY={5}>
              <Heading paddingBottom={10}>Đã đặt đơn</Heading>
              <OrderIcon />
              <View
                justifyContent="flex-start"
                w="100%"
                paddingX={12}
                marginLeft={3}>
                <Text>{moment(order.created_at).format('HH:mm')}</Text>
              </View>
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
              <>
                {order?.product_detail.map(item => (
                  <HStack
                    marginY={1}
                    alignItems={'center'}
                    justifyContent="space-between">
                    <VStack>
                      <HStack key={item.id} alignItems={'center'}>
                        <Text paddingLeft={1} fontWeight={'bold'}>
                          {item.quantity} x{' '}
                        </Text>
                        <Text fontSize={16} fontWeight={'bold'} color="#000000">
                          {item.name}
                        </Text>
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
                  {`Tổng (${order?.product_quantity} món)`}
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
                  {moment(order?.created_at).format('dd, HH:mm')}
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
              <Text paddingBottom={3}>
                {moment(order.accepted_at).format('HH:mm')}
              </Text>
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
              <>
                {order?.product_detail.map(item => (
                  <HStack
                    marginY={1}
                    alignItems={'center'}
                    justifyContent="space-between">
                    <VStack>
                      <HStack key={item.id} alignItems={'center'}>
                        <Text fontSize={16} fontWeight={'bold'} color="#000000">
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
                  {`Tổng (${order?.product_quantity} món)`}
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
                  {moment(order?.created_at).format('dd, HH:mm')}
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
              <View
                flexDirection="row"
                justifyContent="flex-end"
                w="100%"
                paddingX={12}
                marginRight={5}>
                <Text>{moment(order.finished_at).format('HH:mm')}</Text>
              </View>
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
              <>
                {order?.product_detail.map(item => (
                  <HStack
                    marginY={1}
                    alignItems={'center'}
                    justifyContent="space-between">
                    <VStack>
                      <HStack key={item.id} alignItems={'center'}>
                        <Text fontSize={16} fontWeight={'bold'} color="#000000">
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
                  {`Tổng (${order?.product_quantity} món)`}
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
                  {moment(order?.created_at).format('dd, HH:mm')}
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
                    Đã nhận hàng
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
                  height: 280,
                  width: '90%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 8,
                }}>
                <HeaderModalCode title="Đăng xuất" onPress={closeModal} />
                <BodyModalCode
                  cancel="cancel"
                  confirm="confirm"
                  onPressCancel={closeModal}
                  onPressConfirm={() => console.log('clicked')}
                  orderId={id}
                />
              </View>
            </Modal>
          </View>
        );
      case 'taken':
        return (
          <View>
            <Center marginY={5}>
              <Heading paddingBottom={5}>Đã đặt đơn</Heading>
              <DoneIcon />
              <View
                flexDirection="row"
                justifyContent="flex-end"
                w="100%"
                paddingX={12}
                marginRight={5}>
                <Text>{moment(order.finished_at).format('HH:mm')}</Text>
              </View>
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
              <>
                {order?.product_detail.map(item => (
                  <HStack
                    marginY={1}
                    alignItems={'center'}
                    justifyContent="space-between">
                    <VStack>
                      <HStack key={item.id} alignItems={'center'}>
                        <Text fontSize={16} fontWeight={'bold'} color="#000000">
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
                  {`Tổng (${order?.product_quantity} món)`}
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
                  {moment(order?.created_at).format('dd, HH:mm')}
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
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
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
                    Đóng
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

export default MyDetailOrder;

const styles = StyleSheet.create({});
