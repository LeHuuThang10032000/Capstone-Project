import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';
import HeaderBack from '../../components/HeaderBack';
import {axiosClient} from '../../components/apis/axiosClient';
import {Order} from '../../store/cart';
import {Center, Divider, HStack, Text, VStack} from 'native-base';
import {formatCurrency} from '../../components/helper';
import Lottie from 'lottie-react-native';
import moment from 'moment';

type Props = {};

const MyDetailOrder = ({route}: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const {id} = route.params;
  const [detail, setDetail] = useState<Order>();
  const [isLoading, setIsLoading] = useState(false);

  console.log('Detail Product', id);

  const getOrderDetail = useCallback(async () => {
    setIsLoading(true);
    const result = await axiosClient.get(`/order/detail?order_id=${id}`);
    setDetail(result.data?.data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getOrderDetail();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <HeaderBack title="Chi tiết đơn hàng" />
      {isLoading ? (
        <Center>
          <Lottie
            source={require('../../assets/lottie-file/loading.json')}
            autoPlay={true}
            style={{width: 100, height: 100}}
          />
        </Center>
      ) : (
        <VStack margin={5}>
          <HStack>
            <Text color="#000000">Mã đơn hàng:</Text>
            <Text color="#000000" fontWeight="bold">
              #{detail?.order_code}
            </Text>
          </HStack>
          <Divider marginTop={5} />
          <VStack marginTop={5}>
            <Text fontWeight={'extrabold'}>{detail?.store.name}</Text>
            <HStack>
              <Text color={'#818181'}>
                {formatCurrency((detail?.order_total ?? 0).toString())}đ -{' '}
              </Text>
              <Text color={'#818181'}>{detail?.product_quantity} món - </Text>
              <Text color={'#818181'}>Ví VLPay</Text>
            </HStack>
          </VStack>
          <Divider marginTop={5} />
          <Text fontSize={16} marginTop={5} fontWeight={'extrabold'}>
            {detail?.store.name}
          </Text>
          {detail?.product_detail.map(item => (
            <HStack paddingY={5} justifyContent={'space-between'}>
              <VStack>
                <Text fontSize={18} fontWeight="bold">
                  {item.quantity} x {item.name}
                </Text>
                {item.add_ons.map(item => (
                  <Text color="#818181" fontSize={16}>
                    {item.name}
                  </Text>
                ))}
              </VStack>
              <Text fontSize={18} fontWeight="bold">
                {formatCurrency((item?.price ?? 0).toString())}đ
              </Text>
            </HStack>
          ))}
          <HStack justifyContent={'space-between'}>
            <Text fontSize={18} fontWeight="bold">
              Tạm tính ({detail?.product_quantity} món)
            </Text>
            <Text fontSize={18} fontWeight="bold">
              {formatCurrency((detail?.order_total ?? 0).toString())}đ
            </Text>
          </HStack>
          <HStack marginTop={5} justifyContent={'space-between'}>
            <Text fontSize={14} color={'#818181'}>
              Giảm giá
            </Text>
            <Text fontSize={14} color={'#818181'}>
              {formatCurrency((detail?.discount_amount ?? 0).toString())}đ
            </Text>
          </HStack>
          <HStack justifyContent={'space-between'}>
            <Text fontSize={18} fontWeight="bold">
              Tổng ({detail?.product_quantity} món)
            </Text>
            <Text fontSize={18} fontWeight="bold">
              {formatCurrency((detail?.order_total ?? 0).toString())}đ
            </Text>
          </HStack>
          <Divider marginTop={5} />
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
            <Text fontWeight={'bold'} color="#818181" paddingLeft={1}>
              #{detail?.order_code}
            </Text>
          </HStack>
          <HStack
            paddingY={1}
            alignItems={'center'}
            justifyContent="space-between">
            <Text color="#818181">Thời gian đặt hàng</Text>
            <Text color="#818181" paddingLeft={1}>
              {moment(detail?.created_at).format('dd, HH:mm')}
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
        </VStack>
      )}
    </View>
  );
};

export default MyDetailOrder;

const styles = StyleSheet.create({});
