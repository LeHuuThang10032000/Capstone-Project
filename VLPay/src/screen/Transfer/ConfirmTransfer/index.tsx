import {
  ActivityIndicator,
  BackHandler,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import HeaderBack from '../../../components/HeaderBack';
import {Center, Heading, HStack, VStack, View} from 'native-base';
import {
  MainStackNavigation,
  MainStackParamList,
} from '../../../stack/Navigation';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {UText} from '../../../components/UText';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Colors from '../../../components/helpers/Colors';
import {moderateScale} from '../ScaleUtils';
import {axiosClient} from '../../../components/apis/axiosClient';
import YesNoModal from '../../../components/YesNoModal';
import Icons from '../../../components/Icons';
import axios from 'axios';
import {formatCurrency} from '../../../components/helper';

type Props = {};

const Index = ({route}: any) => {
  const {data} = useRoute<RouteProp<MainStackParamList, 'Transfer'>>()?.params;
  const [input, setInput] = useState(false);
  const [value, setValue] = useState('');
  const [visibleWarning, setVisibleWarning] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [isLoading, setLoading] = useState(false);

  const [profile, setProfile] = useState({});
  const {payment_type} = route.params;

  console.log('PAYMENT_TYPE==>', payment_type);

  const fetchData = useCallback(async () => {
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/get-profile',
    );
    setProfile(result.data);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const navigation = useNavigation<MainStackNavigation>();
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setInput(false);
        setKeyboardVisible(false); // or some other action
      },
    );

    Keyboard.addListener('keyboardDidShow', e => {
      const height = e.endCoordinates.height;
      setKeyboardHeight(height);
    });

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [input]);

  const otpRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      otpRef?.current?.focusField(0);
    }, 250);
    setInput(true);
  }, []);

  return (
    <View>
      <HeaderBack title="Xác nhận giao dịch" />
      <View pt={3}>
        <Heading pl={'5'} py={'5'} size={'sm'}>
          Chi tiết giao dịch
        </Heading>
        <Center>
          <VStack
            p={3}
            borderWidth={2}
            borderColor="#D9D9D9"
            borderRadius="8"
            w={'90%'}>
            <HStack justifyContent={'space-between'} pb="10">
              <Text style={styles.textTitle}>Thanh toán</Text>
              <Text style={styles.text}>{data.name}</Text>
            </HStack>
            <HStack justifyContent={'space-between'} pb="10">
              <Text style={styles.textTitle}>Số điện thoại</Text>
              <Text style={styles.text}>{data.phone}</Text>
            </HStack>
            <HStack justifyContent={'space-between'} pb="10">
              <Text style={styles.textTitle}>Số tiền</Text>
              <Text style={styles.text}>
                {formatCurrency(data?.money ?? 0)}đ
              </Text>
            </HStack>
            <HStack justifyContent={'space-between'} pb="10">
              <Text style={styles.textTitle}>Tin nhắn</Text>
              <Text style={styles.text}>{data.mess}</Text>
            </HStack>
          </VStack>
        </Center>
        <View style={{marginHorizontal: 20}}>
          <TouchableOpacity
            style={styles.button}
            disabled={isLoading}
            onPress={() => {
              setInput(!input);
              setTimeout(() => otpRef?.current?.focusField(0), 250);
            }}>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.textBtn}>Xác nhận</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={
          input
            ? {
                width: '100%',
                position: 'absolute',
                bottom: 0,
                height: keyboardHeight,
                backgroundColor: 'white',
              }
            : {
                width: 0,
                height: 0,
                display: 'none',
              }
        }>
        <View style={{backgroundColor: 'white'}}>
          <VStack alignItems={'center'}>
            <UText style={{marginBottom: 3, marginTop: 15}}>
              Nhập mật khẩu
            </UText>
            <View
              style={{
                paddingHorizontal: 8,
                borderWidth: 1,
                borderColor: 'black',
                borderRadius: 30,
                width: '70%',
                height: 40,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <OTPInputView
                style={styles.otpContainer}
                pinCount={6}
                autoFocusOnLoad={false}
                codeInputFieldStyle={styles.underlineStyleBase}
                keyboardType="number-pad"
                ref={otpRef}
                onCodeChanged={async value => {
                  if (value.length === 6) {
                    setLoading(true);
                    try {
                      const formData = new FormData();
                      formData.append('f_name', data.name);
                      formData.append('cash', data.money);
                      formData.append('phone', data.phone);
                      formData.append('message', data.message);
                      formData.append('payment_type', payment_type);
                      await axios.post(
                        'https://zennoshop.cf/api/user/checkPassword',
                        {phone: data.current_user, password: value},
                        {
                          headers: {'content-type': 'multipart/form-data'},
                        },
                      );

                      const _result = await axiosClient.post(
                        '/create-transaction',
                        formData,
                        {
                          headers: {'content-type': 'multipart/form-data'},
                        },
                      );
                      data.code = _result?.data?.code;

                      data.from_user = _result?.data?.from_user;
                      console.log('_result?.data', formData);

                      navigation.replace('PaymentDetails', {
                        data: data,
                      });
                      setLoading(false);
                    } catch (e) {
                      setPhoneError('Mật khẩu không chính xác');
                      setVisibleWarning(true);
                      console.log(e);
                      setLoading(false);
                    }
                  }
                }}
                secureTextEntry={true}
                onCodeFilled={setValue}
                //   onCodeChanged={() => setIsError(false)}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ChangePassword', {
                  phone: profile.data?.phone,
                });
              }}>
              <UText style={{color: '#3495CB', fontSize: 14, paddingTop: 10}}>
                Quên mật khẩu
              </UText>
            </TouchableOpacity>
          </VStack>
        </View>
      </View>
      <YesNoModal
        icon={<Icons.WarningIcon />}
        visible={visibleWarning}
        btnLeftStyle={{
          backgroundColor: Colors.primary,
          width: 200,
        }}
        btnRightStyle={{
          backgroundColor: '#909192',
          width: 200,
          display: 'none',
        }}
        message={phoneError}
        title={'Thông báo'}
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

export default Index;

const styles = StyleSheet.create({
  textTitle: {
    fontFamily: 'Poppins-Regular',
    color: '#000',
  },
  text: {
    fontFamily: 'Poppins-Regular',
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF',
  },
  otpContainer: {
    height: 100,
    justifyContent: 'center',
  },
  underlineStyleBase: {
    width: 40,
    height: 60,
    color: Colors.cloudBurst,
    fontSize: moderateScale(28),
    borderWidth: 0,
    alignItems: 'center',
    paddingHorizontal: -30,
  },
  button: {
    backgroundColor: '#B5EAD8',
    padding: 15,
    marginTop: 50,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  textBtn: {
    fontFamily: 'Poppins-ExtraBold',
    color: '#514545',
  },
});
