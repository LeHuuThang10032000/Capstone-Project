import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';
import HeaderBack from '../../components/HeaderBack';
import {axiosClient} from '../../components/apis/axiosClient';
import {Order} from '../../store/cart';
import {HStack, Text, VStack} from 'native-base';
import {formatCurrency} from '../../components/helper';

type Props = {};

const MyDetailOrder = ({route}: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const {id} = route.params;
  const [detail, setDetail] = useState<Order>();

  console.log('Detail Product', detail);

  const getOrderDetail = useCallback(async () => {
    const result = await axiosClient.get(`/order/detail?order_id=${id}`);
    setDetail(result.data?.data);
  }, []);

  useEffect(() => {
    getOrderDetail();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <HeaderBack title="Chi tiết đơn hàng" />
      <VStack margin={5}>
        <Text fontSize={18} fontWeight="bold">
          {detail?.store.location}: {detail?.store.name}
        </Text>
        <HStack justifyContent={'space-between'}>
          <Text color="#818181" fontSize={18}>
            Mã đơn hàng
          </Text>
          <Text color="#818181" fontSize={18} fontWeight="bold">
            #{detail?.order_code}
          </Text>
        </HStack>
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
            Tạm tính({detail?.product_quantity})
          </Text>
          <Text fontSize={18} fontWeight="bold">
            {formatCurrency((detail?.order_total ?? 0).toString())}đ
          </Text>
        </HStack>
        <HStack justifyContent={'space-between'}>
          <Text fontSize={18} fontWeight="bold">
            Tổng({detail?.product_quantity})
          </Text>
          <Text fontSize={18} fontWeight="bold">
            {formatCurrency((detail?.order_total ?? 0).toString())}đ
          </Text>
        </HStack>
      </VStack>
    </View>
  );
};

export default MyDetailOrder;

const styles = StyleSheet.create({});
