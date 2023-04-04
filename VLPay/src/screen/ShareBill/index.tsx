import React, {useEffect, useState} from 'react';
import HeaderBack from '../../components/HeaderBack';
import {Center, Divider, HStack, Image, Text, View, VStack} from 'native-base';
import CallMe from '../../assets/svg/call-me.svg';
import {TouchableOpacity} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {MainStackNavigation, MainStackParamList} from '../../stack/Navigation';
import {axiosClient} from '../../components/apis/axiosClient';

type Props = {};

const ShareBill = () => {
  const {data} = useRoute<RouteProp<MainStackParamList, 'WithDraw'>>()?.params;
  const [userWallet, setUserWallet] = useState(0);
  const fetchData = async () => {
    const result = await axiosClient.get('/user-wallet');
    setUserWallet(result?.data?.data?.balance);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const navigation = useNavigation<MainStackNavigation>();
  console.log(data);

  return (
    <View flex={1} backgroundColor="#ffffff">
      <HeaderBack title="Chi tiết giao dịch" />
      <Center
        margin={5}
        padding={3}
        borderWidth={1}
        borderRadius={8}
        borderColor="#E0E0E0">
        <Text fontSize={16}>Thanh toán đơn hàng</Text>
        <Text fontSize={16} fontWeight="bold">
          {data?.amount.toLocaleString()}đ
        </Text>
        <Text fontSize={16}>Mã giao dịch: {data?.code}</Text>
        <HStack
          marginY={5}
          alignItems="center"
          justifyContent="space-between"
          w={'100%'}
          padding={3}
          borderRadius={8}
          backgroundColor="#ccfcd2">
          <Image
            source={require('../../assets/img/success.png')}
            style={{width: 30, height: 30}}
            alt="img"
          />
          <Text fontSize={16}>Giao dịch thành công</Text>
          <View></View>
        </HStack>
        <VStack w="100%">
          <HStack justifyContent="space-between">
            <Text fontSize={16}>Thời gian thành toán</Text>
            <Text fontSize={16} fontWeight="bold">
              {data?.created_at}
            </Text>
          </HStack>
          <Divider marginY={3} />
          <HStack justifyContent="space-between">
            <Text fontSize={16}>Nguồn tiền</Text>
            <Text fontSize={16} fontWeight="bold">
              Ví VLPAY
            </Text>
          </HStack>
          <Divider marginY={3} />
          <HStack justifyContent="space-between">
            <Text fontSize={16}>Tổng phí</Text>
            <Text fontSize={16} fontWeight="bold">
              Miễn phí
            </Text>
          </HStack>
          <Divider marginY={3} />
          <Center
            w="100%"
            backgroundColor="#d1d1d1"
            padding={3}
            borderRadius={8}>
            <HStack>
              <CallMe />
              <Text marginLeft={3} fontSize={16} fontWeight="bold">
                Liên hệ hỗ trợ
              </Text>
            </HStack>
          </Center>
        </VStack>
      </Center>
      <Center
        margin={5}
        padding={3}
        borderWidth={1}
        borderRadius={8}
        borderColor="#E0E0E0">
        <HStack w="100%" justifyContent="space-between">
          <Text fontSize={16}>Số dư ví</Text>
          <Text fontSize={16} fontWeight="bold">
            {(userWallet ?? 0).toLocaleString()}đ
          </Text>
        </HStack>
      </Center>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ChooseSharer', {
            data: data,
          })
        }>
        <Center
          borderRadius={8}
          backgroundColor="#B5EAD8"
          margin={5}
          padding={5}>
          <Text fontSize={16} fontWeight="bold">
            Chia tiền
          </Text>
        </Center>
      </TouchableOpacity>
    </View>
  );
};

export default ShareBill;
