import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import HeaderBack from '../../components/HeaderBack';

type Props = {};

const HistoryWithDrawDetail = ({route}: any) => {
  const {id} = route.params;
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <HeaderBack title={'Thông tin chi tiết'} />
      <Text>{id}</Text>
    </View>
  );
};

export default HistoryWithDrawDetail;

const styles = StyleSheet.create({});
