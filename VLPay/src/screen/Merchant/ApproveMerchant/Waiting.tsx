import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import HeaderBack from '../../../components/HeaderBack';

const Waiting = () => {
  const [approve, setApprove] = useState(false);
  return (
    <View>
      <HeaderBack title="Tạo Shop" />
      <Text>Waiting</Text>
    </View>
  );
};

export default Waiting;

const styles = StyleSheet.create({});
