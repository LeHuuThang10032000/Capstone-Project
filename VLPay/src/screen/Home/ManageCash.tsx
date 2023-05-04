import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HStack, Skeleton, VStack} from 'native-base';
import {axiosClient} from '../../components/apis/axiosClient';
import {formatCurrency} from '../../components/helper';
import {black} from 'react-native-paper/lib/typescript/styles/colors';

const ManageCash = (props: {
  wallet: number;
  credit: number;
  loading: boolean;
}) => {
  return (
    <VStack
      alignItems={'center'}
      justifyContent={'center'}
      style={styles.container}>
      <HStack w={'90%'} justifyContent={'space-between'} alignItems="center">
        <View>
          <Text style={styles.text}>Số dư trong ví của bạn</Text>
        </View>
        {props.loading ? (
          <View>
            <Text style={styles.price}>
              {formatCurrency((props.wallet ?? 0).toString())}đ
            </Text>
          </View>
        ) : (
          <View>
            <Skeleton h="4" w="24" borderRadius={5} />
          </View>
        )}
      </HStack>

      <HStack w={'90%'} justifyContent={'space-between'} alignItems="center">
        <View>
          <Text style={styles.text}>Số dư trong ví Tín dụng</Text>
        </View>
        {props.loading ? (
          <View>
            <Text style={styles.price}>
              {formatCurrency((props.credit ?? 0).toString())}đ
            </Text>
          </View>
        ) : (
          <View>
            <Skeleton h="4" w="32" borderRadius={5} />
          </View>
        )}
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
    color: 'black',
  },
  price: {
    fontFamily: 'Poppins-Regular',
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default ManageCash;
