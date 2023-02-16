import {View, Text} from 'native-base';
import React from 'react';
import HeaderBack from '../../../components/HeaderBack';

type Props = {};

const MyStore = (props: Props) => {
  return (
    <View flex={1}>
      <HeaderBack title="Quán của tui" hideRight={true} />
    </View>
  );
};

export default MyStore;
