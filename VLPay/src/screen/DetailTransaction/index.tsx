import React, {useEffect, useState} from 'react';
import {axiosClient} from '../../components/apis/axiosClient';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';
import {Center, Divider, HStack, Image, Text, VStack, View} from 'native-base';
import HeaderBack from '../../components/HeaderBack';
import CallMe from '../../assets/svg/call-me.svg';
import {TouchableOpacity} from 'react-native';
import Icons from '../../components/Icons';
import moment from 'moment';
import {formatCurrency} from '../../components/helper';

const DetailTransaction = ({route}: any) => {
  const {title, amount, code, created_at} = route.params;
  const [userWallet, setUserWallet] = useState(0);
  const [hide, setHide] = useState(false);
  const [status, setStatus] = useState('');
  const fetchData = async () => {
    const result = await axiosClient.get('/user-wallet');
    setUserWallet(result?.data?.data?.balance);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const navigation = useNavigation<MainStackNavigation>();

  return (
    <View flex={1} backgroundColor="#ffffff">
      <HeaderBack title="Chi tiết giao dịch" />
      <Center
        margin={5}
        padding={3}
        borderWidth={1}
        borderRadius={8}
        borderColor="#E0E0E0">
        <Text fontSize={16}>{title}</Text>
        <Text fontSize={16} fontWeight="bold">
          {formatCurrency((amount ?? 0).toString())}đ
        </Text>
        <Text fontSize={16}>Mã giao dịch: {code}</Text>
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
            <Text fontSize={16}>Thời gian thanh toán</Text>
            <Text fontSize={16} fontWeight="bold">
              {moment().format('HH:mm [-] DD/MM/YYYY')}
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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text fontSize={16}>Số dư ví</Text>
            <View style={{width: 10}} />
            <TouchableOpacity onPress={() => setHide(!hide)}>
              {hide ? <Icons.EyeCloseIcon /> : <Icons.EyeOpenIcon />}
            </TouchableOpacity>
          </View>
          {hide ? (
            <Text fontSize={16} fontWeight="bold">
              {(userWallet ?? 0).toLocaleString()}đ
            </Text>
          ) : (
            <Text>*****</Text>
          )}
        </HStack>
      </Center>
    </View>
  );
};

export default DetailTransaction;
