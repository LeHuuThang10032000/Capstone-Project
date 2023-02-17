import {View, Text} from 'react-native';
import React from 'react';
import HeaderComp from '../../../../components/HeaderComp';

type Props = {};

const AccountScreen = (props: Props) => {
  return (
    <View>
      <HeaderComp title="Tài khoản" />
      <Text>AccountScreen</Text>
    </View>
  );
};

export default AccountScreen;
