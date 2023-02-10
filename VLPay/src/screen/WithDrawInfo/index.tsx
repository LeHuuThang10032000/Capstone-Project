import {Center, FormControl, HStack, Pressable, VStack} from 'native-base';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import HeaderBack from '../../components/HeaderBack';
import TText from '../Transfer/TText';
import YesNoModal from '../../components/YesNoModal';
import Icons from '../../components/icons';
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

interface WithDraw {
  amount: string;
}

const WithDrawInfo = (props: any) => {
  const [visibleWarning, setVisibleWarning] = useState(false);
  const [infoWithdraw, setInfoWithdraw] = useState(false);
  const [profile, setProfile] = useState({});
  const isFocused = useIsFocused();
  const balances = useMemo(() => ['200000', '500000', '1000000'], []);

  const {isWithdraw} =
    useRoute<RouteProp<MainStackParamList, 'WithDrawInfo'>>()?.params;

  const navigation = useNavigation<MainStackNavigation>();

  const fetchData = useCallback(async () => {
    const result = await axiosClient
      .get('https://zennoshop.cf/api/user/get-profile')
      .then(response => {
        setProfile(response.data);
        console.log(result);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      fetchData();
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
    formData.append('name', profile?.data?.f_name);
    formData.append('phone', profile?.data?.phone);
    formData.append('email', 'test@gmail.com');
    formData.append('mssv', '197pm09474');
    formData.append('reason', 'I need money to shoping.');
    console.log(formData);

    try {
      await axiosClient.post(
        'https://zennoshop.cf/api/user/create-withdraw-request',
        formData,
        {
          headers: {'content-type': 'multipart/form-data'},
        },
      );
      console.log('Successfully!');
      setVisibleWarning(true);
      setInterval(() => {
        setVisibleWarning(false);
        setInfoWithdraw(true);
      }, 2000);
    } catch (e) {
      console.log('Error is:', e);
      Toast.show({
        type: 'error',
        text1: 'Lỗi giao dịch',
        text2: 'Nhập số tiền từ 200.000đ trở lên!',
      });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <HeaderBack title={isWithdraw ? 'Rút tiền' : 'Nạp tiền'} />
      {infoWithdraw ? (
        <VStack style={{flex: 1}} alignItems={'center'} paddingX={3}>
          <TText style={{fontWeight: '700', fontSize: 18, marginTop: 20}}>
            {isWithdraw ? 'Thông tin rút tiền' : 'Thông tin nạp tiền'}
          </TText>
          <TText style={{fontSize: 18, marginTop: 5}}>
            {isWithdraw ? 'Mã rút' : 'Mã nạp'}: 8713
          </TText>
          <HStack
            justifyContent={'space-between'}
            width={'100%'}
            marginTop={5}
            marginBottom={5}>
            <TText style={{fontSize: 18}}>Họ tên:</TText>
            <TText style={{fontSize: 18, opacity: 0.31}}>
              {profile?.data?.f_name}
            </TText>
          </HStack>
          <HStack
            justifyContent={'space-between'}
            width={'100%'}
            marginBottom={5}>
            <TText style={{fontSize: 18}}>
              Số tiền yêu cầu {isWithdraw ? 'rút' : 'nạp'}:
            </TText>
            <TText style={{fontSize: 18, opacity: 0.31}}>1.000.000đ</TText>
          </HStack>
          <HStack
            justifyContent={'space-between'}
            width={'100%'}
            marginBottom={5}>
            <TText style={{fontSize: 18}}>Ngày giao dịch:</TText>
            <TText style={{fontSize: 18, opacity: 0.31}}>15/12/2022</TText>
          </HStack>
          <HStack
            justifyContent={'space-between'}
            width={'100%'}
            marginBottom={5}>
            <View>
              <TText
                style={{
                  fontSize: 18,
                  borderBottomWidth: 1,
                  borderBottomColor: 'red',
                }}>
                Tải xuống thông tin tại đây
              </TText>
            </View>
            <VStack alignItems={'center'}>
              <Icons.PDFIcon />
              <TText>Bấm để tải</TText>
            </VStack>
          </HStack>

          <View
            style={{
              width: '100%',
              position: 'absolute',
              bottom: 30,
            }}>
            <TText style={{marginBottom: 20, color: 'red', fontSize: 18}}>
              <TText style={{fontWeight: '700', fontSize: 18}}>Lưu ý:</TText>{' '}
              Sau khi tải xuống thông tin bạn cần đem thông tin này đến trung
              tâm hỗ trợ của VLPay tại trường để được nhân viên hỗ trợ xét duyệt
              {isWithdraw ? ' rút tiền' : ' nạp tiền'}
            </TText>
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
                paddingVertical: 10,
                borderRadius: 8,
              }}>
              <TText style={{fontWeight: '700'}}>Xong</TText>
            </TouchableOpacity>
          </View>
        </VStack>
      ) : (
        <>
          <VStack
            justifyContent={'center'}
            alignItems={'center'}
            marginY={10}
            space={5}
            marginX={1}
            paddingY={3}
            style={{elevation: 2}}>
            <TText style={{fontSize: 24, fontWeight: '700'}}>Ví của bạn</TText>
            <TText style={{fontWeight: '700', color: '#8C8C8C'}}>
              Số tiền: 10.000.000đ
            </TText>
          </VStack>

          <Controller
            control={control}
            rules={{required: 'Vui lòng nhập số tiền'}}
            render={({field: {onChange, onBlur, value}}) => (
              <FormControl isInvalid={errors.amount !== undefined}>
                <TextInput
                  placeholder="Nhập số tiền cần rút"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
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
              opacity: 0.26,
              alignSelf: 'center',
              marginBottom: 20,
              marginTop: 10,
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
                paddingVertical: 10,
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
          isWithdraw ? ' rút tiền ' : ' nạp tiền '
        }thành công`}
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
