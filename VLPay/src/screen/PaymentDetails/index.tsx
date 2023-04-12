import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {HStack, Pressable, VStack} from 'native-base';
import {getRandomString} from 'native-base/lib/typescript/theme/tools';
import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler, Linking, ScrollView, View} from 'react-native';
import HeaderBack from '../../components/HeaderBack';
import {formatCurrency} from '../../components/helper';
import Icons from '../../components/Icons';
import {UText} from '../../components/UText';
import {MainStackNavigation, MainStackParamList} from '../../stack/Navigation';
import styles from '../Login/styles';
import {axiosClient} from '../../components/apis/axiosClient';
import {TouchableOpacity} from 'react-native-gesture-handler';

const PaymentDetails = () => {
  const {data} =
    useRoute<RouteProp<MainStackParamList, 'PaymentDetails'>>()?.params;
  const navigation = useNavigation<MainStackNavigation>();
  const {name, phone, current_wallet, mess, code, money} = data;
  console.log(data);

  console.log(data);
  console.log('====================================');
  console.log(code);
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('Home');
      return true;
    });
  }, []);

  const [userWallet, setUserWallet] = useState(0);
  const [credit, setCredit] = useState(0);
  const phoneNumber = '028 7105 9999';

  console.log(userWallet, credit);

  const fetchData = useCallback(async () => {
    const result = await axiosClient.get('/user-wallet');
    setUserWallet(result?.data?.data?.balance);
    setCredit(result?.data?.data?.credit_limit);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <View style={{flex: 1, paddingBottom: 10, backgroundColor: '#ffffff'}}>
      <HeaderBack title="Xác nhận giao dịch" isReset={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
        }}>
        <VStack width={'100%'} alignItems={'center'}>
          <VStack
            width={'90%'}
            alignItems={'center'}
            borderWidth={1}
            marginTop={30}
            borderRadius={8}
            paddingY={3}
            borderColor={'#E0E0E0'}>
            <VStack my={3}>
              <UText>Chuyển tiền qua VLPAY</UText>
              <UText style={{fontSize: 18, fontWeight: '700'}}>
                -{formatCurrency(money ?? 0)}đ
              </UText>
              <UText style={{fontSize: 15}}>
                Mã giao dịch:
                <UText style={{color: '#0088CC'}}>
                  {' '}
                  {parseInt(
                    Math.floor(Math.random() * 90000000) + 10000000,
                  ).toString()}
                </UText>
              </UText>
            </VStack>
            <HStack
              width={'85%'}
              alignItems={'center'}
              backgroundColor={'#DEFCCC'}
              borderRadius={8}
              paddingY={2}
              paddingX={2}>
              <Icons.SuccessIcon />
              <View style={{width: 20}} />
              <UText>Giao dịch thành công</UText>
            </HStack>
            <VStack width={'90%'} alignItems={'center'}>
              <HStack style={styles.blockContent}>
                <UText>Thời gian thanh toán</UText>
                <UText style={styles.leftContent}>{data?.date ?? ''}</UText>
              </HStack>
              <View style={styles.separate} />
              <HStack style={styles.blockContent}>
                <UText>Nguồn tiền</UText>
                <UText style={styles.leftContent}>Ví VLPAY</UText>
              </HStack>
              <View style={styles.separate} />
              <HStack style={styles.blockContent}>
                <UText>Tổng phí</UText>
                <UText style={styles.leftContent}>Miễn phí</UText>
              </HStack>
              <View style={styles.separate} />
              <Pressable
                w={'100%'}
                onPress={() => Linking.openURL(`tel:${phoneNumber}`)}>
                <HStack
                  style={[
                    {
                      backgroundColor: '#EEFAF6',
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}>
                  <Icons.SupportIcon />
                  <View style={{width: 5}} />
                  <UText style={{fontSize: 15, fontWeight: '700'}}>
                    Liên hệ hỗ trợ
                  </UText>
                </HStack>
              </Pressable>
            </VStack>
          </VStack>
          <VStack width={'90%'} alignItems={'center'}>
            <HStack
              borderColor={'#BDBDBD'}
              borderWidth={1}
              borderRadius={8}
              width={'100%'}
              marginY={6}
              paddingY={2}
              justifyContent={'center'}>
              <HStack width={'90%'} justifyContent={'space-between'}>
                <UText>Số dư ví</UText>
                <UText>{formatCurrency((userWallet ?? 0).toString())}đ</UText>
              </HStack>
            </HStack>
          </VStack>
          <HStack width={'90%'} marginBottom={3}>
            <UText
              style={{
                fontSize: 18,
                fontWeight: '700',
                width: '100%',
                alignSelf: 'flex-start',
              }}>
              Thông tin thêm
            </UText>
          </HStack>
          <VStack
            width={'90%'}
            alignItems={'center'}
            borderColor={'#E0E0E0'}
            borderWidth={1}
            paddingY={3}
            borderRadius={8}>
            <HStack style={styles.blockContent}>
              <UText>Tên ví VLPAY</UText>
              <UText style={styles.leftContent}>{name ?? ''}</UText>
            </HStack>
            <View style={styles.separate} />

            <HStack style={styles.blockContent}>
              <UText>Tên danh bạ</UText>
              <UText style={styles.leftContent}>{name ?? ''}</UText>
            </HStack>
            <View style={styles.separate} />

            <HStack style={styles.blockContent}>
              <UText>Số điện thoại</UText>
              <UText style={styles.leftContent}>{phone ?? ''}</UText>
            </HStack>
            <View style={styles.separate} />
          </VStack>
          <HStack
            width={'90%'}
            justifyContent={'flex-start'}
            mt={5}
            borderColor={'#E0E0E0'}
            borderWidth={1}
            paddingY={3}
            paddingX={3}
            height={150}
            borderRadius={8}>
            <Icons.NoteIcon />
            <UText>{mess !== 'undefined' ? mess : 'Không có ghi chú'}</UText>
          </HStack>
        </VStack>
      </ScrollView>
    </View>
  );
};

export default PaymentDetails;
