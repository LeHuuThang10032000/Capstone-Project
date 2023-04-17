import {StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import HeaderBack from '../../../../components/HeaderBack';
import {axiosClient} from '../../../../components/apis/axiosClient';
import {
  Center,
  Divider,
  HStack,
  ScrollView,
  Text,
  VStack,
  View,
} from 'native-base';
import {formatCurrency} from '../../../../components/helper';
import moment from 'moment';
import Lottie from 'lottie-react-native';

export interface AddOns {
  id: number;
  name: string;
  price: number;
}

interface Product {
  product_id: number;
  name: string;
  price: number;
  add_ons: AddOns[];
  quantity: number;
  add_ons_price: number;
  total_price: number;
}

interface DetailBill {
  id: number;
  order_code: string;
  user_id: number;
  store_id: number;
  promocode_id: number;
  order_total: number;
  discount_amount: number;
  status: string;
  note: string;
  product_detail: Product[];
  created_at: string;
  accepted_at: string;
  canceled_at: string;
  processing_at: string;
  finished_at: string;
  updated_at: string;
  taken_at: string;
  cancel_reason: string;
  product_quantity: number;
  user: {
    id: number;
    f_name: string;
    phone: string;
    status: string;
    mssv: string;
    image: string;
  };
  store: {
    id: number;
    user_id: number;
    name: string;
    phone: string;
    status: string;
    email: string;
    selling_products: string;
    location: string;
    image: string;
    deny_reason: string;
    wallet_balance: number;
    cover_photo: string;
  };
}

const DetailBillShare = ({route}: any) => {
  const {order_id} = route.params;
  const [data, setData] = useState<DetailBill>();
  const [loading, setLoading] = useState(false);
  const getDetailBill = useCallback(async () => {
    setLoading(true);
    const result = await axiosClient.get(`/order/detail?order_id=${order_id}`);
    setData(result.data.data);
    setLoading(false);
  }, []);
  useEffect(() => {
    getDetailBill();
  }, []);
  return (
    <View style={{backgroundColor: '#ffffff', flex: 1}}>
      <HeaderBack title="Chi tiết hóa đơn" />
      <ScrollView>
        {loading ? (
          <Center>
            <Lottie
              source={require('../../../../assets/lottie-file/loading.json')}
              autoPlay={true}
              style={{width: 100, height: 100}}
            />
          </Center>
        ) : (
          <VStack margin={5}>
            <HStack>
              <Text color="#000000">Mã đơn hàng:</Text>
              <Text color="#000000" fontWeight="bold">
                #{data?.order_code}
              </Text>
            </HStack>
            <Divider marginTop={5} />
            <VStack marginTop={5}>
              <Text fontWeight={'extrabold'}>{data?.store.name}</Text>
              <HStack>
                <Text color={'#818181'}>
                  {formatCurrency((data?.order_total ?? 0).toString())}đ -{' '}
                </Text>
                <Text color={'#818181'}>{data?.product_quantity} món - </Text>
                <Text color={'#818181'}>Ví VLPay</Text>
              </HStack>
            </VStack>
            <Divider marginTop={5} />
            <Text fontSize={16} marginTop={5} fontWeight={'extrabold'}>
              {data?.store.name}
            </Text>
            {data?.product_detail.map(item => (
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
                Tạm tính ({data?.product_quantity} món)
              </Text>
              <Text fontSize={18} fontWeight="bold">
                {formatCurrency((data?.order_total ?? 0).toString())}đ
              </Text>
            </HStack>
            <HStack marginTop={5} justifyContent={'space-between'}>
              <Text fontSize={14} color={'#818181'}>
                Giảm giá
              </Text>
              <Text fontSize={14} color={'#818181'}>
                {formatCurrency((data?.discount_amount ?? 0).toString())}đ
              </Text>
            </HStack>
            <HStack justifyContent={'space-between'}>
              <Text fontSize={18} fontWeight="bold">
                Tổng ({data?.product_quantity} món)
              </Text>
              <Text fontSize={18} fontWeight="bold">
                {formatCurrency((data?.order_total ?? 0).toString())}đ
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
                #{data?.order_code}
              </Text>
            </HStack>
            <HStack
              paddingY={1}
              alignItems={'center'}
              justifyContent="space-between">
              <Text color="#818181">Thời gian đặt hàng</Text>
              <Text color="#818181" paddingLeft={1}>
                {moment(data?.created_at).format('dd, HH:mm')}
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
      </ScrollView>
    </View>
  );
};

export default DetailBillShare;

const styles = StyleSheet.create({});
