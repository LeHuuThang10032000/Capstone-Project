import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Lottie from 'lottie-react-native';
import HeaderComp from '../../components/HeaderComp';
import {Center, Heading} from 'native-base';

type Props = {};

const MyOrder = (props: Props) => {
  return (
    <View>
      <HeaderComp title="Đơn hàng" />
      <Center backgroundColor={'red'}>
        <Lottie
          source={require('../../assets/lottie-file/man-working.json')}
          autoPlay={true}
          style={{width: 300, height: 300}}
        />
        <Heading>Chức năng đang trong quá trình hoàn thiện!</Heading>
      </Center>
    </View>
  );
};

export default MyOrder;

const styles = StyleSheet.create({});
