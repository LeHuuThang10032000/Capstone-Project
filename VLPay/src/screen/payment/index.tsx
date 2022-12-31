import {useNavigation} from '@react-navigation/native';
import {HStack, VStack} from 'native-base';
import React, {createRef, useEffect, useRef, useState} from 'react';
import {
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MainStackNavigation} from '../../stack/Navigation';
import BackIcon from '../../assets/svg/left-arrow.svg';
import styles from './styles';
import {UText} from '../../components/UText';
import {Image} from '@rneui/base';
import OTPInputView from '@twotalltotems/react-native-otp-input';
const Payment = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const handleBack = () => {
    navigation.goBack();
  };
  const [parkingPrice, setParkingPrice] = useState(true);
  const [confirmPayment, setConfirmPayment] = useState(false);
  const [input, setInput] = useState(false);
  const [value, setValue] = useState('');
  const [result, setResult] = useState(false);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setInput(false);
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [input]);

  return (
    <SafeAreaView style={{flex: 1}}>
      {result && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            zIndex: 100000,
          }}>
          <View
            style={{
              position: 'absolute',
              right: 10,
              top: 30,
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Home');
              }}>
              <Image
                source={require('../../assets/img/close.png')}
                style={{width: 20, height: 20}}
              />
            </TouchableOpacity>
          </View>
          <VStack alignItems={'center'} width={'100%'}>
            <View
              style={{
                borderRadius: 1,
                borderColor: '#BDBDBD',
                flexDirection: 'column',
                borderWidth: 1,
                marginTop: 150,
                alignItems: 'center',
                width: '90%',
                paddingHorizontal: 10,
                paddingVertical: 30,
              }}>
              <View style={{position: 'absolute', top: -15}}>
                <Image
                  source={require('../../assets/img/success.png')}
                  style={{width: 30, height: 30}}
                />
              </View>
              <UText>Giao dịch thành công</UText>
              <UText style={{fontWeight: '700'}}>+3000đ</UText>
              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: 'black',
                  opacity: 0.15,
                  marginVertical: 20,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10,
                  height: 70,
                  width: '100%',
                  backgroundColor: '#EEFAF6',
                }}>
                <Image
                  source={require('../../assets/img/warning_blue.png')}
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 10,
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                  }}
                />
                <UText style={{fontSize: 14}}>
                  Quét mã thanh toán thành công
                </UText>
              </View>
              <HStack style={styles.contentContainerH}>
                <UText style={{fontSize: 14}}>Thời gian thanh toán</UText>
                <UText
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: 'black',
                    opacity: 0.61,
                  }}>
                  09:50 - 25/20/2022
                </UText>
              </HStack>
              <HStack style={styles.contentContainerH}>
                <UText style={{fontSize: 14}}>Chi tiết giao dịch</UText>
                <UText style={{fontWeight: '700', color: 'red', fontSize: 14}}>
                  3039498474646 {'>'}
                </UText>
              </HStack>
            </View>
          </VStack>
        </View>
      )}
      <View style={styles.wrapperButton}>
        <HStack px="5" alignItems={'center'}>
          <TouchableOpacity onPress={handleBack}>
            <BackIcon />
          </TouchableOpacity>
          {parkingPrice ? (
            <VStack style={{marginLeft: 30}}>
              <UText>Nguyễn Văn Tèo</UText>
              <UText>0987665534</UText>
            </VStack>
          ) : (
            <UText style={{marginLeft: 50, marginTop: 3}}>
              Xác nhận thanh toán
            </UText>
          )}
        </HStack>
      </View>
      <ScrollView
        style={[
          {flex: 1, backgroundColor: 'white'},
          input ? {paddingBottom: 100} : {},
        ]}>
        <View>
          {parkingPrice && (
            <VStack alignItems={'center'}>
              <UText
                style={{
                  fontWeight: '700',
                  marginTop: 30,
                  marginBottom: 20,
                  fontSize: 20,
                }}>
                Tiền gửi xe
              </UText>
              <UText
                style={{fontWeight: '700', marginBottom: 20, fontSize: 24}}>
                3.000 đ
              </UText>
              <View
                style={{
                  width: '90%',
                  height: 100,
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: '#B2BABB',
                }}>
                <UText
                  style={{
                    color: '#99A3A4',
                    position: 'absolute',
                    top: -13,
                    left: 15,
                    backgroundColor: 'white',
                  }}>
                  Nhập tin nhắn
                </UText>
                <View style={{position: 'absolute', right: 10, top: 10}}>
                  <Image
                    source={require('../../assets/img/icon_input.png')}
                    style={{
                      width: 30,
                      height: 30,
                    }}
                  />
                </View>
                <TextInput
                  style={{
                    width: '100%',
                    height: '100%',
                    marginLeft: 13,
                    fontSize: 16,
                    paddingRight: 15,
                  }}
                  placeholder={'Tin nhắn'}
                  multiline={true}
                />
              </View>
            </VStack>
          )}
          {confirmPayment && (
            <VStack alignItems={'center'}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  width: '90%',
                }}>
                <UText
                  style={{fontWeight: '700', marginTop: 20, marginBottom: 20}}>
                  Chi tiết giao dịch
                </UText>
              </View>
              <VStack style={{borderWidth: 1, borderRadius: 8, width: '90%'}}>
                <HStack style={styles.contentContainer}>
                  <UText>Thanh toán</UText>
                  <UText style={styles.content}>Mã QRCode</UText>
                </HStack>
                <HStack style={styles.contentContainer}>
                  <UText>Người gửi</UText>
                  <UText style={styles.content}>Lê Hữu THắng</UText>
                </HStack>
                <HStack style={styles.contentContainer}>
                  <UText>Người nhận</UText>
                  <VStack alignItems={'flex-end'}>
                    <UText style={styles.content}>Nguyễn Văn Tèo</UText>
                    <UText style={styles.content}>0987654477</UText>
                  </VStack>
                </HStack>
                <HStack style={styles.contentContainer}>
                  <UText>Số tiền</UText>
                  <UText style={styles.content}>3.000đ</UText>
                </HStack>
                <HStack style={styles.contentContainer}>
                  <UText>Ngày chuyển tiền </UText>
                  <UText style={styles.content}>7/11/2022</UText>
                </HStack>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: 'black',
                      height: 1,
                      width: '97%',
                      opacity: 0.5,
                    }}
                  />
                </View>
                <HStack style={styles.contentContainer}>
                  <UText>Phí giao dịch</UText>
                  <UText style={styles.content}>Miễn phí</UText>
                </HStack>
              </VStack>
            </VStack>
          )}
        </View>
      </ScrollView>
      <View
        style={
          input
            ? {
                width: '100%',
                position: 'absolute',
                bottom: 286,
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
                autoFocusOnLoad
                codeInputFieldStyle={styles.underlineStyleBase}
                keyboardType="number-pad"
                onCodeChanged={value => {
                  console.log(value);
                  if (value.length === 6) {
                    setResult(true);
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

        {input && (
          <TextInput
            style={{height: 0, width: 0, display: 'none'}}
            keyboardType={'number-pad'}
            autoFocus={true}
          />
        )}
      </View>

      <View
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 0,
          paddingHorizontal: 15,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            if (parkingPrice) {
              setParkingPrice(false);
              setConfirmPayment(true);
            }

            if (!confirmPayment) {
            }
            setInput(!input);
          }}
          style={[styles.buttonInput]}>
          {parkingPrice ? (
            <UText style={styles.textButtonInput}>Xác nhận</UText>
          ) : (
            <UText style={styles.textButtonInput}>Chuyển tiền</UText>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Payment;
