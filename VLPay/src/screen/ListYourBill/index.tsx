import {StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {HStack, Pressable, ScrollView, Text, VStack, View} from 'native-base';
import HeaderBack from '../../components/HeaderBack';
import {axiosClient} from '../../components/apis/axiosClient';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';

type Props = {
  id: number;
  created_at: string;
  order_id: number;
  title: string;
};

const ListYourBill = ({route}: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const {userWallet} = route.params;
  const [data, setData] = useState<Props[]>([]);

  console.log('Paid==>', data);

  const fetchData = useCallback(async () => {
    const result = await axiosClient.get(
      '/share-bill/my-share-bill?page=1&limit=100',
    );
    setData(result?.data?.data);
  }, []);
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <View flex={1} backgroundColor={'#FFFFFF'}>
      <HeaderBack title="Thông tin thanh toán chia tiền" />
      <ScrollView width={'100%'}>
        {data.map(item => (
          <View key={item.id} marginX={3} marginY={3}>
            <Pressable
              onPress={() =>
                navigation.navigate('PaidBillDetail', {
                  order_id: item.order_id,
                  userWallet: userWallet,
                })
              }>
              <View
                p={5}
                w={'100%'}
                marginY={1}
                borderRadius={10}
                backgroundColor="#ffffff"
                justifyContent={'center'}
                borderWidth={1}
                style={{elevation: 5}}>
                <HStack justifyContent="space-between">
                  <Text style={styles.text}>VLPAY</Text>
                  <Text>
                    {moment(item.created_at).format('dd, DD/MM/YYYY')}
                  </Text>
                </HStack>
                <Text style={styles.titleText}>{item.title}</Text>
              </View>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ListYourBill;

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins-Light',
  },
  titleText: {
    fontFamily: 'Poppins-Bold',
    color: '#312E49',
  },
});
