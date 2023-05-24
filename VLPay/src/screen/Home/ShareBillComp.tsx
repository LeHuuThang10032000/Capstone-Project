import {View, Text} from 'react-native';
import React from 'react';
import {Divider, HStack, VStack} from 'native-base';
import MustPay from '../../assets/svg/must-pay.svg';
import Received from '../../assets/svg/received.svg';
import BillYourself from '../../assets/svg/bill-yourself.svg';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {formatCurrency} from '../../components/helper';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';

type Props = {
  need_pay: number;
  paid_bill: number;
  wallet: any;
};

const ShareBillComp = (props: Props) => {
  const navigation = useNavigation<MainStackNavigation>();

  return (
    <View
      style={{
        marginHorizontal: 16,
        borderWidth: 2,
        borderColor: '#E74C3C',
        borderRadius: 10,
        marginVertical: 30,
      }}>
      {props.need_pay > 0 ? (
        <HStack padding={3} justifyContent="space-between" alignItems="center">
          <HStack alignItems="center">
            <MustPay width={50} />
            <VStack paddingLeft={3}>
              <Text style={{fontSize: 14, color: 'black'}}>
                Số tiền phải trả:
              </Text>
              <Text>{formatCurrency((props.need_pay ?? 0).toString())}đ</Text>
            </VStack>
          </HStack>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ListShareBill', {userWallet: props.wallet})
            }>
            <View
              style={{
                backgroundColor: '#FEB7B1',
                padding: 10,
                borderRadius: 8,
                width: 100,
                alignItems: 'center',
              }}>
              <Text style={{fontWeight: 'bold', color: '#000000'}}>
                Thanh toán
              </Text>
            </View>
          </TouchableOpacity>
        </HStack>
      ) : null}

      <Divider />
      <HStack padding={3} justifyContent="space-between" alignItems="center">
        <HStack alignItems="center">
          <Received width={50} />
          <VStack paddingLeft={3}>
            <Text style={{fontSize: 14, color: 'black'}}>Số tiền đã nhận:</Text>
            <Text style={{fontSize: 14, color: 'black'}}>
              {formatCurrency((props.paid_bill ?? 0).toString())}đ
            </Text>
          </VStack>
        </HStack>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ListPaidBill', {userWallet: props.wallet})
          }>
          <View
            style={{
              backgroundColor: '#FEB7B1',
              padding: 10,
              borderRadius: 8,
              width: 100,
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: 'bold', color: '#000000'}}>Xem</Text>
          </View>
        </TouchableOpacity>
      </HStack>
      <Divider />
      <HStack padding={3} justifyContent="space-between" alignItems="center">
        <HStack alignItems="center">
          <BillYourself width={50} />
          <VStack paddingLeft={3}>
            <Text style={{fontSize: 14, color: 'black'}}>Đơn chia tiền</Text>
          </VStack>
        </HStack>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ListYourBill', {userWallet: props.wallet})
          }>
          <View
            style={{
              backgroundColor: '#FEB7B1',
              padding: 10,
              borderRadius: 8,
              width: 100,
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: 'bold', color: '#000000'}}>Xem</Text>
          </View>
        </TouchableOpacity>
      </HStack>
    </View>
  );
};

export default ShareBillComp;
