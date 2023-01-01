import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import HeaderBack from '../../../components/HeaderBack';
import {Center, Heading, HStack, VStack, View} from 'native-base';

type Props = {};

const Index = (props: Props) => {
  return (
    <View>
      <HeaderBack title="Xác nhận giao dịch" />
      <View pt={3}>
        <Heading pl={'5'} py={'5'} size={'sm'}>
          Chi tiết giao dịch
        </Heading>
        <Center>
          <VStack
            p={3}
            borderWidth={2}
            borderColor="#D9D9D9"
            borderRadius="8"
            w={'90%'}>
            <HStack justifyContent={'space-between'} pb="10">
              <Text style={styles.textTitle}>Thanh toán</Text>
              <Text style={styles.text}>Hàng Hữu Lộc</Text>
            </HStack>
            <HStack justifyContent={'space-between'} pb="10">
              <Text style={styles.textTitle}>Số điện thoại</Text>
              <Text style={styles.text}>0987654322</Text>
            </HStack>
            <HStack justifyContent={'space-between'} pb="10">
              <Text style={styles.textTitle}>Số tiền</Text>
              <Text style={styles.text}>30.000đ</Text>
            </HStack>
            <HStack justifyContent={'space-between'} pb="10">
              <Text style={styles.textTitle}>Tin nhắn</Text>
              <Text style={styles.text}>Tiền mua trà sữa</Text>
            </HStack>
          </VStack>
        </Center>
        <View style={{marginHorizontal: 20}}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => console.log('success!')}>
            <Text style={styles.textBtn}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  textTitle: {
    fontFamily: 'Poppins-Regular',
    color: '#000',
  },
  text: {
    fontFamily: 'Poppins-Regular',
  },
  button: {
    backgroundColor: '#B5EAD8',
    padding: 15,
    marginTop: 50,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  textBtn: {
    fontFamily: 'Poppins-ExtraBold',
    color: '#514545',
  },
});
