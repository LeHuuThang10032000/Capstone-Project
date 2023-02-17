import {View, Text} from 'react-native';
import React from 'react';
import HeaderBack from '../../../../components/HeaderBack';

type Props = {};

const OrderScreen = (props: Props) => {
  return (
    <View>
      <HeaderBack title="Quán trà sữa" hideRight={true} />
      <Text>OrderScreen</Text>
    </View>
  );
};

export default OrderScreen;
