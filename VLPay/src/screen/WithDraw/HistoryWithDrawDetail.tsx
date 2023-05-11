import {Linking, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import HeaderBack from '../../components/HeaderBack';
import {axiosClient} from '../../components/apis/axiosClient';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Center, HStack, Pressable, Text, View} from 'native-base';
import TText from '../Transfer/TText';
import moment from 'moment';
import {formatCurrency} from '../../components/helper';
import CallMe from '../../assets/svg/call-me.svg';
import {MainStackNavigation} from '../../stack/Navigation';
import Lottie from 'lottie-react-native';

interface HistoryDetail {
  id: number;
  transaction_id: string;
  amount: number;
  created_at: string;
  user_name: string;
}

const HistoryWithDrawDetail = ({route}: any) => {
  const {id} = route.params;
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryDetail>();
  const phoneNumber = '028 7105 9999';
  const navigation = useNavigation<MainStackNavigation>();
  console.log(history);

  const getDetailProduct = useCallback(async () => {
    setLoading(true);
    const result = await axiosClient.get(`/withdraw-history/${id}`);
    setHistory(result.data?.data);
    setLoading(false);
  }, []);
  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      getDetailProduct();
    }
  }, [getDetailProduct, isFocused]);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <HeaderBack title={'Thông tin chi tiết'} />
      {loading ? (
        <Center flex={1}>
          <Lottie
            source={require('../../assets/lottie-file/loading.json')}
            autoPlay={true}
            style={{width: 100, height: 100}}
          />
        </Center>
      ) : (
        <View flex={1} alignContent={'center'}>
          <Center
            margin={5}
            borderWidth={1}
            borderRadius={8}
            alignItems={'center'}
            borderColor="#E0E0E0">
            <TText
              style={{
                fontWeight: '700',
                fontSize: 18,
                marginTop: 20,
              }}>
              Thông tin rút tiền
            </TText>
            <TText style={{fontSize: 18, marginTop: 5}}>
              Mã rút: {history?.transaction_id}
            </TText>

            <HStack
              justifyContent={'space-between'}
              alignItems={'center'}
              width={'100%'}
              marginTop={5}
              px={3}
              marginBottom={5}>
              <TText style={{fontSize: 18}}>Họ tên:</TText>
              <TText style={{fontSize: 18, opacity: 0.31}}>
                {history?.user_name}
              </TText>
            </HStack>
            <HStack
              px={3}
              justifyContent={'space-between'}
              width={'100%'}
              marginBottom={5}>
              <TText style={{fontSize: 18}}>Số tiền yêu cầu rút</TText>
              <TText style={{fontSize: 18, opacity: 0.31}}>
                {formatCurrency((history?.amount ?? 0).toString())}đ
              </TText>
            </HStack>
            <HStack
              px={3}
              justifyContent={'space-between'}
              width={'100%'}
              marginBottom={5}>
              <TText style={{fontSize: 18}}>Ngày giao dịch:</TText>
              <TText style={{fontSize: 18, opacity: 0.31}}>
                {moment(history?.created_at).format('HH:mm [-] DD/MM/YYYY')}
              </TText>
            </HStack>

            <Center
              w="100%"
              backgroundColor="#FEB7B1"
              padding={3}
              marginTop={10}
              borderRadius={8}>
              <Pressable onPress={() => Linking.openURL(`tel:${phoneNumber}`)}>
                <HStack>
                  <CallMe />
                  <Text marginLeft={3} fontSize={16} fontWeight="bold">
                    Liên hệ hỗ trợ
                  </Text>
                </HStack>
              </Pressable>
            </Center>
          </Center>
          <View
            style={{
              width: '100%',
              position: 'absolute',
              bottom: 30,
              paddingHorizontal: 15,
              marginTop: 30,
            }}>
            <Text style={{marginBottom: 30}}>
              <Text style={{fontWeight: 'bold', color: 'black'}}>Lưu ý:</Text>{' '}
              <Text style={{color: 'red'}}>
                Sau khi tải xuống thông tin bạn cần đem thông tin này đến trung
                tâm hỗ trợ của VLPay tại trường để được nhân viên hỗ trợ xét
                duyệt rút tiền.
              </Text>
            </Text>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                backgroundColor: '#B5EAD8',
                padding: 20,
                borderRadius: 8,
              }}>
              <TText style={{fontWeight: '700'}}>Xong</TText>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default HistoryWithDrawDetail;

const styles = StyleSheet.create({});
