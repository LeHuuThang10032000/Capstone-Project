import {Alert, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import HeaderBack from '../../components/HeaderBack';
import {Center, Divider, Image, Input, Text, TextArea, View} from 'native-base';
import MessageIcon from '../../assets/svg/message.svg';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';
import {formatCurrency} from '../../components/helper';
import {axiosClient} from '../../components/apis/axiosClient';

const PaymentOrder = ({route}: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const {total_price, store_id, promo_id, payment_type} = route.params;
  const [text, onChangeText] = React.useState('');
  const [orderId, setOrderId] = useState(0);

  const handleOrder = useCallback(async () => {
    const formData = new FormData();
    formData.append('store_id', store_id);
    formData.append('wallet_type', payment_type);
    if (promo_id) {
      formData.append('promocode_id', promo_id);
    }
    try {
      const result = await axiosClient.post('/order/create-order', formData, {
        headers: {'content-type': 'multipart/form-data'},
      });
      console.log(result.data);
      const request_id = result.data.data.request_id;
      navigation.navigate('OrderProcess', {
        order_id: request_id,
        store_id: store_id,
      });
    } catch (error) {
      Alert.alert(error.error);
    }
  }, [orderId]);

  return (
    <View flex={1} backgroundColor="#FFFFFF">
      <HeaderBack title="Thanh toán đơn hàng" />
      <Center paddingTop={10}>
        <Divider position={'absolute'} top={90} />
        <Image
          source={{
            uri: 'https://spoonacular.com/recipeImages/579247-556x370.jpg',
          }}
          width={100}
          height={100}
          borderRadius={50}
          alt="food"
        />
        <Text style={{marginTop: 10, fontSize: 16}}>Kios Số 10</Text>
        <Text
          borderBottomWidth={1}
          borderBottomColor="#FFA0A7"
          style={{marginTop: 10, fontSize: 16}}>
          {formatCurrency((total_price ?? 0).toString())}đ
        </Text>
        <TextArea
          value={text}
          // onBlur={onBlur}
          onChangeText={onChangeText}
          keyboardType="email-address"
          placeholder="Nhập nội dung"
          marginTop={5}
          marginX={3}
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: 14,
            padding: 3,
            flex: 1,
          }}
          autoCompleteType={undefined}
          rightElement={
            <MessageIcon style={{marginRight: 3, marginBottom: 40}} />
          }
        />
        <View position={'absolute'} top={210} background="#ffffff" left={5}>
          <Text color="#99A3A4">Message</Text>
        </View>
        <Divider marginTop={200} />
      </Center>
      <View paddingY={5} paddingX={3}>
        <TouchableOpacity onPress={handleOrder}>
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
              Đặt hàng
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentOrder;

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    padding: 0,
    paddingTop: 15,
    fontSize: 18,
    borderBottomColor: '#FFA0A7',
  },
});
