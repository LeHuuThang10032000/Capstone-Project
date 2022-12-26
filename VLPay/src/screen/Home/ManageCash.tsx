import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {HStack, VStack} from 'native-base';

const ManageCash = () => {
  return (
    <VStack
      alignItems={'center'}
      justifyContent={'center'}
      style={styles.container}>
      <HStack w={'90%'} justifyContent={'space-between'} alignItems="center">
        <View>
          <Text style={styles.text}>Số dư trong ví của bạn</Text>
        </View>
        <View>
          <Text style={styles.price}>10.000 VND</Text>
        </View>
      </HStack>

      <HStack w={'90%'} justifyContent={'space-between'} alignItems="center">
        <View>
          <Text style={styles.text}>Số dư trong ví Tín dụng</Text>
        </View>
        <View>
          <Text style={styles.price}>10.000.000 VND</Text>
        </View>
      </HStack>
    </VStack>
  );
};

const styles = StyleSheet.create({
  wrapperContainer: {
    overflow: 'hidden',
    paddingBottom: 5,
  },
  container: {
    backgroundColor: '#ffffff',
    height: 60,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    // paddingHorizontal: 20,
    // paddingVertical: 20,
  },
  text: {
    fontFamily: 'Poppins-Regular',
  },
  price: {
    fontFamily: 'Poppins-Regular',
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default ManageCash;
