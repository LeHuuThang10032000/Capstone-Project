import {View, Text} from 'react-native';
import React from 'react';
import HeaderComp from '../../../../components/HeaderComp';

type Props = {};

const MenuScreen = (props: Props) => {
  return (
    <View>
      <HeaderComp title="Menu" />
      <Text>MenuScreen</Text>
    </View>
  );
};

export default MenuScreen;
