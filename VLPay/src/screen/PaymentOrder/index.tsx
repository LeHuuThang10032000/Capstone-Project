import {
  Alert,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import HeaderBack from '../../components/HeaderBack';
import {
  Center,
  Divider,
  Image,
  Input,
  Text,
  TextArea,
  VStack,
  View,
} from 'native-base';
import MessageIcon from '../../assets/svg/message.svg';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';
import {formatCurrency} from '../../components/helper';
import {axiosClient} from '../../components/apis/axiosClient';
import {UText} from '../../components/UText';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import axios from 'axios';
import Colors from '../../components/helpers/Colors';
import {moderateScale} from '../Transfer/ScaleUtils';
import YesNoModal from '../../components/YesNoModal';
import Icons from '../../components/Icons';

const PaymentOrder = ({route}: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const {total_price, store_id, promo_id, payment_type, image, name} =
    route.params.data;
  const [text, onChangeText] = React.useState('');
  const [orderId, setOrderId] = useState(0);
  const [visibleWarning, setVisibleWarning] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [phoneError, setPhoneError] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [input, setInput] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [profile, setProfile] = useState('');
  const [value, setValue] = useState('');

  console.log(payment_type);

  const fetchData = useCallback(async () => {
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/get-profile',
    );
    setProfile(result.data.data.phone);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleOrder = useCallback(async () => {
    const formData = new FormData();
    formData.append('store_id', store_id);
    formData.append('wallet_type', payment_type);
    if (promo_id) {
      formData.append('promocode_id', promo_id);
    }
    try {
      const result = await axiosClient.post('/order/create-order', formData, {
        headers: {'content-type': 'multipart/form-data'},
      });
      const request_id = result.data.data.request_id;
      navigation.navigate('OrderProcess', {
        order_id: request_id,
        store_id: store_id,
      });
    } catch (error) {
      console.log(error);
    }
  }, [orderId]);

  return (
    <View flex={1} backgroundColor="#FFFFFF">
      <HeaderBack title="Thanh toán đơn hàng" />
      <Center paddingTop={10}>
        <Divider position={'absolute'} top={90} />
        <Image
          source={{
            uri: image,
          }}
          width={100}
          height={100}
          borderRadius={50}
          alt="food"
        />
        <Text style={{marginTop: 10, fontSize: 16}}>{name}</Text>
        <Text
          borderBottomWidth={1}
          borderBottomColor="#FFA0A7"
          style={{marginTop: 10, fontSize: 16}}>
          {formatCurrency((total_price ?? 0).toString())}đ
        </Text>
        <TextArea
          value={text}
          // onBlur={onBlur}
          onChangeText={onChangeText}
          autoFocus={false}
          keyboardType="email-address"
          placeholder="Nhập nội dung"
          marginTop={5}
          marginX={3}
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: 14,
            padding: 3,
            flex: 1,
          }}
          autoCompleteType={undefined}
          rightElement={
            <MessageIcon style={{marginRight: 3, marginBottom: 40}} />
          }
        />
        <View position={'absolute'} top={210} background="#ffffff" left={5}>
          <Text color="#99A3A4">Ghi chú</Text>
        </View>
        <Divider marginTop={200} />
      </Center>
      <View paddingY={5} paddingX={3}>
        <TouchableOpacity
          onPress={() => {
            setInput(!input);
            setTimeout(() => otpRef?.current?.focusField(0), 250);
          }}>
          <View
            justifyContent="center"
            alignItems={'center'}
            style={{
              width: '100%',
              padding: 20,
              backgroundColor: '#B5EAD8',
              borderRadius: 10,
            }}>
            <Text color={'#000000'} fontWeight="bold" fontSize={16}>
              Đặt hàng
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={
          input
            ? {
                width: '100%',
                // position: 'absolute',
                bottom: 290,
                height: keyboardHeight,
                backgroundColor: 'white',
              }
            : {
                // width: 0,
                // height: 0,
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
                autoFocusOnLoad={true}
                codeInputFieldStyle={styles.underlineStyleBase}
                keyboardType="number-pad"
                ref={otpRef}
                onCodeChanged={async value => {
                  if (value.length === 6) {
                    setLoading(true);
                    try {
                      const formData = new FormData();
                      formData.append('store_id', store_id);
                      formData.append('wallet_type', payment_type);
                      if (promo_id) {
                        formData.append('promocode_id', promo_id);
                      }
                      console.log(formData);
                      await axios.post(
                        'https://zennoshop.cf/api/user/checkPassword',
                        {phone: profile, password: value},
                        {
                          headers: {'content-type': 'multipart/form-data'},
                        },
                      );
                      console.log(123);

                      const result = await axiosClient.post(
                        '/order/create-order',
                        formData,
                        {
                          headers: {'content-type': 'multipart/form-data'},
                        },
                      );
                      const request_id = result.data.data.request_id;
                      navigation.navigate('OrderProcess', {
                        order_id: request_id,
                        store_id: store_id,
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
                  phone: profile,
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

export default PaymentOrder;

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    padding: 0,
    paddingTop: 15,
    fontSize: 18,
    borderBottomColor: '#FFA0A7',
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
});
