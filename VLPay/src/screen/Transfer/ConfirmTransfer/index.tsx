import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
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

type Props = {};

const Index = (props: Props) => {
  const {data} = useRoute<RouteProp<MainStackParamList, 'Transfer'>>()?.params;
  console.log(data);
  const [input, setInput] = useState(false);
  const [value, setValue] = useState('');
  const [result, setResult] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
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
              <Text style={styles.text}>{data.money}</Text>
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
            onPress={() => {
              setInput(!input);
              setTimeout(() => otpRef?.current?.focusField(0), 250);
            }}>
            <Text style={styles.textBtn}>Xác nhận</Text>
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
            <UText style={{marginBottom: 5, marginTop: 15}}>
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
                  console.log(value);
                  if (value.length === 6) {
                    try {
                      const formData = new FormData();
                      formData.append('f_name', data.name);
                      formData.append('cash', data.money);
                      formData.append('phone', data.phone);
                      formData.append('message', data.message);

                      const _result = await axiosClient.post(
                        '/create-transaction',
                        formData,
                        {
                          headers: {'content-type': 'multipart/form-data'},
                        },
                      );

                      const _data = [{..._result?.data}, {money: data.money}];
                      navigation.navigate('PaymentDetails', {
                        data: _data,
                      });
                    } catch (e) {
                      console.log(e);
                    }
                  }
                }}
                secureTextEntry={true}
                onCodeFilled={setValue}
                //   onCodeChanged={() => setIsError(false)}
              />
            </View>
            <TouchableOpacity>
              <UText style={{color: '#3495CB', fontSize: 14, marginTop: 5}}>
                Quên mật khẩu
              </UText>
            </TouchableOpacity>
          </VStack>
        </View>
      </View>
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
