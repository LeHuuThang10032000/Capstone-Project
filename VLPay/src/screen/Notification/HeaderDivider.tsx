import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {Divider} from 'native-base';

type Props = {};

const HeaderDivider = (props: Props) => {
  return (
    <View style={styles.header}>
      <Divider mx="2" />
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    color: '#000000',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
  },
  header: {
    backgroundColor: '#FFFFFF',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
});
export default HeaderDivider;
