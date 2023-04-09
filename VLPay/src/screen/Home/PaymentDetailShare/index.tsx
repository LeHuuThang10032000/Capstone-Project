import {View, Text} from 'react-native';
import React, {useCallback, useState} from 'react';
import HeaderBack from '../../../components/HeaderBack';
import {HStack, ScrollView, VStack} from 'native-base';
import {UText} from '../../../components/UText';
import Icons from '../../../components/Icons';
import styles from './styles';
import moment from 'moment';
import {formatCurrency} from '../../../components/helper';
import {axiosClient} from '../../../components/apis/axiosClient';

type Props = {};

const PaymentDetailShare = ({route}: any) => {
  const {amount, shared_name, phone, message} = route.params;

  const [userWallet, setUserWallet] = useState(0);
  const [credit, setCredit] = useState(0);

  console.log(userWallet, credit);

  const fetchData = useCallback(async () => {
    const result = await axiosClient.get('/user-wallet');
    setUserWallet(result?.data?.data?.balance);
    setCredit(result?.data?.data?.credit_limit);
  }, []);

  console.log({
    amount,
    shared_name,
    phone,
    message,
  });
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
            <VStack my={3} justifyContent={'center'} alignItems={'center'}>
              <UText>Chuyển tiền qua VLPAY</UText>
              <UText style={{fontSize: 18, fontWeight: '700'}}>
                -{formatCurrency((amount ?? 0).toString())}đ
              </UText>
              <UText style={{fontSize: 15}}>
                Mã giao dịch:{' '}
                <UText style={{color: '#0088CC'}}>
                  {Math.floor(Math.random() * 100000)}
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
                <UText style={styles.leftContent}>
                  {moment().format('DD/MM/YYYY')}
                </UText>
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
              <UText style={styles.leftContent}>{shared_name}</UText>
            </HStack>
            <View style={styles.separate} />

            <HStack style={styles.blockContent}>
              <UText>Tên danh bạ</UText>
              <UText style={styles.leftContent}>{shared_name}</UText>
            </HStack>
            <View style={styles.separate} />

            <HStack style={styles.blockContent}>
              <UText>Số điện thoại</UText>
              <UText style={styles.leftContent}>{phone}</UText>
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
            <UText>{message}</UText>
          </HStack>
        </VStack>
      </ScrollView>
    </View>
  );
};

export default PaymentDetailShare;
