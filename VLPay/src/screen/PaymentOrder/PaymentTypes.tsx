import {Alert, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import HeaderBack from '../../components/HeaderBack';
import {Center, Divider, Image, Input, Text, TextArea, View} from 'native-base';
import MessageIcon from '../../assets/svg/message.svg';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';
import {formatCurrency} from '../../components/helper';
import {axiosClient} from '../../components/apis/axiosClient';
import {UText} from '../../components/UText';
import Lottie from 'lottie-react-native';

const PaymentTypes = ({route}: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const data = route.params;
  const [text, onChangeText] = React.useState('');
  const [orderId, setOrderId] = useState(0);
  const [isLoading, setIsloading] = useState(false);
  const [userWallet, setUserWallet] = useState(0);
  const [credit, setCredit] = useState(0);
  const [paymentType, setPaymentType] = useState('debit');

  const fetchData = async () => {
    setIsloading(true);
    const result = await axiosClient.get('/user-wallet');
    setUserWallet(result?.data?.data?.balance);
    setCredit(result?.data?.data?.credit_limit);
    setIsloading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  data.payment_type = 'debit';

  return (
    <View flex={1} backgroundColor="#FFFFFF">
      <HeaderBack title="Thanh toán đơn hàng" />
      {isLoading ? (
        <Center>
          <Lottie
            source={require('../../assets/lottie-file/loading.json')}
            autoPlay={true}
            style={{width: 100, height: 100}}
          />
        </Center>
      ) : (
        <>
          <Center paddingTop={10}>
            <View
              style={{
                width: '100%',
                marginHorizontal: 16,
              }}>
              <TouchableOpacity
                onPress={() => {
                  data.payment_type = 'debit';
                  setPaymentType('debit');
                }}
                style={{
                  backgroundColor: '#B5EAD8',
                  width: '95%',
                  alignSelf: 'center',
                  borderRadius: 10,
                  height: 70,
                  flexDirection: 'column',
                  paddingLeft: 16,
                  paddingTop: 5,
                  marginBottom: 30,
                  borderWidth: paymentType === 'debit' ? 1 : 0,
                }}>
                <UText style={{fontWeight: '700', fontSize: 20}}>
                  Ví của tôi
                </UText>
                <UText style={{marginTop: 5, color: 'rgba(178, 186, 187, 1)'}}>
                  {userWallet.toLocaleString()}đ
                </UText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  data.payment_type = 'credit';
                  setPaymentType('credit');
                }}
                style={{
                  backgroundColor: '#B5EAD8',
                  width: '95%',
                  alignSelf: 'center',
                  borderRadius: 10,
                  height: 70,
                  flexDirection: 'column',
                  paddingLeft: 16,
                  marginBottom: 30,
                  paddingTop: 5,
                  borderWidth: paymentType === 'credit' ? 1 : 0,
                }}>
                <UText style={{fontWeight: '700', fontSize: 20}}>
                  Ví tín dụng
                </UText>
                <UText style={{marginTop: 5, color: 'rgba(178, 186, 187, 1)'}}>
                  {credit.toLocaleString()}đ
                </UText>
              </TouchableOpacity>
            </View>
          </Center>
          <View
            paddingY={5}
            paddingX={3}
            style={{position: 'absolute', bottom: 20, width: '100%'}}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PaymentOrder', {
                  data,
                });
              }}>
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
                  Chọn
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default PaymentTypes;

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    padding: 0,
    paddingTop: 15,
    fontSize: 18,
    borderBottomColor: '#FFA0A7',
  },
});
