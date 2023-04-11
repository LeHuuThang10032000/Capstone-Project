import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import HeaderBack from '../../../../components/HeaderBack';
import {axiosClient} from '../../../../components/apis/axiosClient';
import {HStack, VStack} from 'native-base';
import {formatCurrency} from '../../../../components/helper';
import moment from 'moment';

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
  console.log(order_id);
  console.log(data);
  const getDetailBill = useCallback(async () => {
    const result = await axiosClient.get(`/order/detail?order_id=${order_id}`);
    setData(result.data.data);
  }, []);
  useEffect(() => {
    getDetailBill();
  }, []);
  return (
    <View style={{backgroundColor: '#ffffff', flex: 1}}>
      <HeaderBack title="Chi tiết hóa đơn" />
      <View style={{padding: 15}}>
        <Text
          style={{
            fontWeight: 'bold',
            color: '#000000',
            fontSize: 16,
            paddingBottom: 20,
          }}>
          {data?.store.name}
        </Text>
        <HStack w={'100%'} paddingBottom={5} justifyContent={'space-between'}>
          <Text
            style={{
              fontWeight: 'bold',
              color: '#000000',
              fontSize: 16,
            }}>
            Mã đơn hàng
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              color: '#0088CC',
              fontSize: 16,
            }}>
            #{data?.order_code}
          </Text>
        </HStack>
        <Text
          style={{
            fontWeight: 'bold',
            color: '#000000',
            fontSize: 16,
            paddingBottom: 10,
          }}>
          Sản phẩm
        </Text>
        {data?.product_detail.map(item => (
          <View>
            <HStack width={'100%'} justifyContent={'space-between'}>
              <HStack>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: '#000000',
                    fontSize: 16,
                  }}>
                  {item.quantity} x{' '}
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: '#000000',
                    fontSize: 16,
                  }}>
                  {item.name}
                </Text>
              </HStack>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#000000',
                  fontSize: 16,
                }}>
                {formatCurrency((item?.price ?? 0).toString())}đ
              </Text>
            </HStack>
            <HStack>
              {item.add_ons.map(item => (
                <HStack w={'100%'} justifyContent={'space-between'}>
                  <Text>{item.name}</Text>
                  <Text>{formatCurrency((item?.price ?? 0).toString())}đ</Text>
                </HStack>
              ))}
            </HStack>
          </View>
        ))}
        <HStack w={'100%'} paddingY={3} justifyContent={'space-between'}>
          <Text
            style={{
              fontWeight: 'bold',
              color: '#000000',
              fontSize: 16,
            }}>
            Tổng tiền
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              color: '#000000',
              fontSize: 16,
            }}>
            {formatCurrency((data?.order_total ?? 0).toString())}đ
          </Text>
        </HStack>
        <VStack>
          <Text
            style={{
              fontWeight: 'bold',
              color: '#000000',
              fontSize: 16,
              paddingBottom: 10,
            }}>
            Chi tiết đơn hàng
          </Text>
          <HStack w={'100%'} justifyContent={'space-between'}>
            <Text>Thời gian đặt hàng</Text>
            <Text>
              {moment(data?.created_at).format('h:mm [-] DD/MM/YYYY')}
            </Text>
          </HStack>
          <HStack w={'100%'} justifyContent={'space-between'}>
            <Text>Thanh toán</Text>
            <Text>Ví VLPay</Text>
          </HStack>
        </VStack>
      </View>
    </View>
  );
};

export default DetailBillShare;

const styles = StyleSheet.create({});
