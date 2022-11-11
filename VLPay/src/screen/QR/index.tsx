import {View, Text} from 'react-native';
import React from 'react';
import HeaderComp from '../../components/HeaderComp';

type Props = {};

const Index = (props: Props) => {
  return (
    <View>
      <HeaderComp title="QR code" />
    </View>
  );
};

export default Index;
