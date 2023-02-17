import {View, Text} from 'react-native';
import React from 'react';
import HeaderComp from '../../../../components/HeaderComp';

type Props = {};

const MailScreen = (props: Props) => {
  return (
    <View>
      <HeaderComp title="Hộp thư" />
      <Text>MailScreen</Text>
    </View>
  );
};

export default MailScreen;
