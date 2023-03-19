import {Alert, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import React, {useCallback, useState} from 'react';
import HeaderBack from '../../components/HeaderBack';
import {Center, Divider, Image, Input, Text, TextArea, View} from 'native-base';
import MessageIcon from '../../assets/svg/message.svg';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';
import {formatCurrency} from '../../components/helper';
import {axiosClient} from '../../components/apis/axiosClient';

const PaymentOrder = ({route}: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const {total_price, store_id} = route.params;
  const [text, onChangeText] = React.useState('');

  console.log('STORE ID:', store_id);

  // const handleOrder = useCallback(async () => {
  //   const formData = new FormData();
  //   formData.append('store_id', store_id);
  //   const result = await axiosClient.post('/create-order', formData, {
  //     headers: {'content-type': 'multipart/form-data'},
  //   });
  //   console.log(result.data);
  //   navigation.navigate('OrderProcess');
  // }, []);

  const handleOrder = useCallback(async () => {
    const formData = new FormData();
    formData.append('store_id', store_id);
    try {
      const result = await axiosClient.post('/order/create-order', formData, {
        headers: {'content-type': 'multipart/form-data'},
      });
      console.log(result.data);
      navigation.navigate('OrderProcess');
    } catch (error) {
      Alert.alert('Lỗi hệ thống', 'Có lỗi xảy ra vui lòng thử lại sau!');
    }
  }, []);

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
            padding: 0,
            flex: 1,
          }}
          autoCompleteType={undefined}
          rightElement={
            <MessageIcon style={{marginRight: 3, marginBottom: 40}} />
          }
        />
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
