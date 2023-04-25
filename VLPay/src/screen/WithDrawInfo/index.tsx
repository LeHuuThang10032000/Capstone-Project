import {
  Center,
  Divider,
  FormControl,
  HStack,
  Pressable,
  Text,
  VStack,
  View,
} from 'native-base';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Linking, TextInput, TouchableOpacity} from 'react-native';
import HeaderBack from '../../components/HeaderBack';
import TText from '../Transfer/TText';
import YesNoModal from '../../components/YesNoModal';
import Icons from '../../components/Icons';
import Colors from '../../components/helpers/Colors';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {MainStackNavigation, MainStackParamList} from '../../stack/Navigation';
import {Controller, useForm} from 'react-hook-form';
import {formatCurrency} from '../../components/helpers/formatNum';
import {UText} from '../../components/UText';
import {axiosClient} from '../../components/apis/axiosClient';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import {escapeCurrency} from '../../components/helper';
import CallMe from '../../assets/svg/call-me.svg';

interface WithDraw {
  amount: string;
}

const WithDrawInfo = (props: any) => {
  const [visibleWarning, setVisibleWarning] = useState(false);
  const [infoWithdraw, setInfoWithdraw] = useState(false);
  const [profile, setProfile] = useState({});
  const isFocused = useIsFocused();
  const balances = useMemo(() => ['50000', '100000', '200000'], []);
  const [tranId, setTranId] = useState('');
  const [amount, setAmount] = useState('');
  const [day, setDay] = useState('');
  const [userWallet, setUserWallet] = useState(0);
  const phoneNumber = '028 7105 9999';

  console.log(tranId);
  console.log(amount);
  console.log(day);

  const {isWithdraw} =
    useRoute<RouteProp<MainStackParamList, 'WithDrawInfo'>>()?.params;

  const navigation = useNavigation<MainStackNavigation>();

  const getWallet = useCallback(async () => {
    const result = await axiosClient.get('/user-wallet');
    setUserWallet(result?.data?.data?.balance);
  }, []);

  const fetchData = useCallback(async () => {
    const result = await axiosClient
      .get('https://zennoshop.cf/api/user/get-profile')
      .then(response => {
        setProfile(response.data.data);
        console.log(result);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      fetchData();
      getWallet();
    }
  }, [fetchData, isFocused]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<WithDraw>({
    defaultValues: {
      amount: '',
    },
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    const {amount} = data;
    const formData = new FormData();
    formData.append('amount', amount);
    console.log(formData);

    try {
      await axiosClient
        .post(
          'https://zennoshop.cf/api/user/create-withdraw-request',
          formData,
          {
            headers: {'content-type': 'multipart/form-data'},
          },
        )
        .then(res => {
          const data = res.data?.data;
          setTranId(data.transaction_id);
          setAmount(data.amount);
          setDay(data.created_at);
          // console.log(res.data?.data?.transaction_id);
          // console.log(res.data?.data?.amount);
          console.log('Successfully!');
          setVisibleWarning(true);
          setInterval(() => {
            setVisibleWarning(false);
            setInfoWithdraw(true);
          }, 2000);
        })
        .catch(err => {
          console.log(err);
          return Toast.show({
            type: 'error',
            text1: 'Lỗi giao dịch',
            text2: 'Số dư ví không đủ.',
          });
        });
    } catch (e) {
      console.log('Error is:', e);
      Toast.show({
        type: 'error',
        text1: 'Lỗi giao dịch',
        text2: 'Số dư ví không đủ.',
      });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <HeaderBack title={isWithdraw ? 'Rút tiền' : 'Nạp tiền'} />
      {infoWithdraw ? (
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
            <TText style={{fontSize: 18, marginTop: 5}}>Mã rút: {tranId}</TText>

            <HStack
              justifyContent={'space-between'}
              alignItems={'center'}
              width={'100%'}
              marginTop={5}
              px={3}
              marginBottom={5}>
              <TText style={{fontSize: 18}}>Họ tên:</TText>
              <TText style={{fontSize: 18, opacity: 0.31}}>
                {profile?.f_name}
              </TText>
            </HStack>
            <HStack
              px={3}
              justifyContent={'space-between'}
              width={'100%'}
              marginBottom={5}>
              <TText style={{fontSize: 18}}>
                Số tiền yêu cầu {isWithdraw ? 'rút' : 'nạp'}:
              </TText>
              <TText style={{fontSize: 18, opacity: 0.31}}>
                {formatCurrency(amount)}đ
              </TText>
            </HStack>
            <HStack
              px={3}
              justifyContent={'space-between'}
              width={'100%'}
              marginBottom={5}>
              <TText style={{fontSize: 18}}>Ngày giao dịch:</TText>
              <TText style={{fontSize: 18, opacity: 0.31}}>
                {moment(day).format('HH:mm [-] DD/MM/YYYY')}
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
            <TouchableOpacity
              onPress={() => {
                console.log(123);

                navigation.reset({
                  index: 0,
                  routes: [{name: 'Home'}],
                });
                navigation.navigate('Home');
              }}
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
      ) : (
        <>
          <View
            p={3}
            w={'100%'}
            marginY={10}
            backgroundColor="#ffffff"
            justifyContent={'center'}
            borderWidth={1}
            style={{elevation: 5}}>
            <VStack
              paddingY={5}
              justifyContent={'center'}
              alignItems={'center'}>
              <TText
                style={{fontSize: 24, fontWeight: '700', paddingBottom: 10}}>
                Ví của bạn
              </TText>
              <TText
                style={{fontWeight: '700', color: '#8C8C8C', fontSize: 16}}>
                Số tiền: {formatCurrency((userWallet ?? 0).toString())}đ
              </TText>
            </VStack>
          </View>

          <Controller
            control={control}
            rules={{required: 'Vui lòng nhập số tiền'}}
            render={({field: {onChange, onBlur, value}}) => (
              <FormControl isInvalid={errors.amount !== undefined}>
                <TextInput
                  placeholder="Nhập số tiền cần rút"
                  placeholderTextColor={'#000'}
                  onChangeText={newValue => {
                    let number = newValue.replace(/\./g, ''); // Remove all dots from the string
                    onChange(number);
                  }}
                  onBlur={onBlur}
                  value={formatCurrency(escapeCurrency(value))}
                  style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    marginHorizontal: 20,
                    backgroundColor: '#FAFAFA',
                    paddingLeft: 15,
                  }}
                  keyboardType={'phone-pad'}
                />
                {/* {parseInt(props.route.params) - parseInt(value) < 0 && (
                  <UText
                    style={{
                      color: 'red',
                      fontSize: 12,
                    }}>
                    Số dư ví không đủ
                  </UText>
                )} */}
                <FormControl.ErrorMessage pl={5}>
                  {errors.amount?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            )}
            name="amount"
          />

          <TText
            style={{
              alignSelf: 'center',
              marginBottom: 20,
              marginTop: 10,
              color: '#8C8C8C',
              fontWeight: '700',
            }}>
            Rút tối thiểu 50.000đ. Rút tối đa 10.000.000đ
          </TText>
          <Center>
            <HStack space={5} justifyContent="center" width={'90%'}>
              {balances.map(value => (
                <Pressable
                  padding={1}
                  flex={1}
                  borderRadius={8}
                  key={value}
                  borderWidth={1}
                  borderColor={'#ABABAB'}
                  onPress={() => setValue('amount', value)}>
                  <TText style={{textAlign: 'center', fontSize: 18}}>
                    {formatCurrency(value.toString())}đ
                  </TText>
                </Pressable>
              ))}
            </HStack>
          </Center>
          <View
            style={{
              width: '100%',
              paddingHorizontal: 20,
              position: 'absolute',
              bottom: 30,
            }}>
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                backgroundColor: '#B5EAD8',
                padding: 20,
                borderRadius: 8,
              }}>
              <TText style={{fontWeight: '700'}}>Gửi yêu cầu</TText>
            </TouchableOpacity>
          </View>
        </>
      )}
      <YesNoModal
        icon={<Icons.SuccessIcon />}
        visible={visibleWarning}
        btnLeftStyle={{
          backgroundColor: Colors.primary,
          width: 200,
        }}
        hideRight={true}
        hideLeft={true}
        btnRightStyle={{
          backgroundColor: '#909192',
          width: 200,
          display: 'none',
        }}
        message={`Gửi yêu cầu ${
          isWithdraw ? 'rút tiền' : 'nạp tiền'
        } thành công`}
        onActionLeft={() => {
          setVisibleWarning(false);
        }}
        onActionRight={() => {
          setVisibleWarning(false);
        }}
        btnTextLeft={'Xác nhận'}
        style={{flexDirection: 'column'}}
      />
    </View>
  );
};

export default WithDrawInfo;
