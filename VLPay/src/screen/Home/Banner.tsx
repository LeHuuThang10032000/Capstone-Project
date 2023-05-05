import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';
import {Center, Image} from 'native-base';
import YesNoModal from '../../components/YesNoModal';
import Icons from '../../components/Icons';
import Colors from '../../components/helpers/Colors';
import {axiosClient} from '../../components/apis/axiosClient';
import QRCode from 'react-native-qrcode-svg';
import Lottie from 'lottie-react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {moderateScale} from '../../../android/app/src/helper/ScaleUtils';
import {UText} from '../../components/UText';
import axios from 'axios';

type Props = {
  wallet: any;
};

const Banner = (props: Props) => {
  const navigation = useNavigation<MainStackNavigation>();
  const [visibleWarning, setVisibleWarning] = useState(false);
  const paymentType = 'T';
  const [modal, setModal] = useState(false);
  const [value, setValue] = useState('0');
  const [phoneError, setPhoneError] = useState('');
  return (
    <>
      <View>
        <ImageBackground
          source={require('../../assets/img/banner.png')}
          resizeMode="cover"
          style={{justifyContent: 'center', height: 150}}>
          {!props?.loading ? (
            <Center>
              <Lottie
                source={require('../../assets/lottie-file/loading.json')}
                autoPlay={true}
                style={{width: 100, height: 100}}
              />
            </Center>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <View style={styles.wrapperButton}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Transfer', {
                      userWallet: props.wallet,
                      payment_type: paymentType,
                    })
                  }>
                  <View style={styles.buttonTranfer}>
                    <Image
                      source={require('../../assets/img/moneytranfer.png')}
                      style={{width: 52, height: 52}}
                      alt={'just image'}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.text}>CHUYỂN TIỀN</Text>
              </View>

              <View style={styles.wrapperButton}>
                <TouchableOpacity
                  onPress={() => {
                    if (props.wallet > 3000) {
                      navigation.navigate('ScanQR', props.wallet);
                    } else {
                      setVisibleWarning(true);
                    }
                  }}>
                  <View style={styles.buttonTranfer}>
                    <Image
                      source={require('../../assets/img/scan.png')}
                      style={{width: 52, height: 52}}
                      alt={'just image'}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.text}>QUÉT MÃ</Text>
              </View>

              {!props?.isSecurity && (
                <View style={styles.wrapperButton}>
                  <TouchableOpacity
                    onPress={async () => {
                      setModal(true);
                      // const result = await axiosClient.post('/parking-fee/pay');
                      // setValue(result?.data?.data);
                      // navigation.navigate('QRCodeCheck', {
                      //   value: result?.data?.data,
                      //   isParking: true,
                      // });
                    }}>
                    <View style={styles.buttonTranfer}>
                      <Image
                        source={require('../../assets/img/scan.png')}
                        style={{width: 52, height: 52}}
                        alt={'just image'}
                      />
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.text}>GỬI XE 3K</Text>
                </View>
              )}

              {props?.isSecurity !== 0 && (
                <View style={styles.wrapperButton}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('QRCodeCheck', props.wallet);
                    }}>
                    <View style={styles.buttonTranfer}>
                      <View
                        style={{
                          backgroundColor: 'white',
                          borderRadius: 10,
                          padding: 5,
                        }}>
                        <Image
                          source={require('../../assets/img/check_qrcode.png')}
                          style={{
                            width: 40,
                            height: 40,
                          }}
                          alt={'just image'}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.text}>KIỂM TRA MÃ</Text>
                </View>
              )}

              <View style={styles.wrapperButton}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('WithDraw', {
                      isWithdraw: true,
                    })
                  }>
                  <View style={styles.buttonTranfer}>
                    <Image
                      source={require('../../assets/img/withdraw.png')}
                      style={{width: 52, height: 52}}
                      alt={'just image'}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.text}>RÚT TIỀN</Text>
              </View>
            </View>
          )}
        </ImageBackground>
      </View>
      {modal && (
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: 100000,
            overflow: 'hidden',
            flexDirection: 'row',
            justifyContent: 'center',
            paddingTop: 250,
          }}>
          <TouchableOpacity
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundColor: 'black',
              opacity: 0.5,
            }}
            onPress={() => setModal(false)}></TouchableOpacity>
          <View
            style={{
              height: 150,
              backgroundColor: 'white',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{position: 'absolute', right: 10, top: 10}}
              onPress={() => setModal(false)}>
              <UText>X</UText>
            </TouchableOpacity>
            <UText>Nhập mật khẩu</UText>
            <View
              style={{
                paddingHorizontal: 8,
                borderWidth: 1,
                borderColor: 'black',
                borderRadius: 30,
                width: '80%',
                height: 40,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'white',
              }}>
              <OTPInputView
                style={{height: 100, justifyContent: 'center'}}
                pinCount={6}
                autoFocusOnLoad
                codeInputFieldStyle={{
                  width: 40,
                  height: 60,
                  color: Colors.cloudBurst,
                  fontSize: moderateScale(28),
                  borderWidth: 0,
                  alignItems: 'center',
                  paddingHorizontal: -30,
                }}
                keyboardType="number-pad"
                onCodeChanged={async value => {
                  if (value.length === 6) {
                    try {
                      await axios.post(
                        'https://zennoshop.cf/api/user/checkPassword',
                        {phone: props?.phone, password: value},
                        {
                          headers: {'content-type': 'multipart/form-data'},
                        },
                      );
                      const result = await axiosClient.post('/parking-fee/pay');
                      setValue(result?.data?.data);
                      setModal(false);
                      navigation.navigate('QRCodeCheck', {
                        value: result?.data?.data,
                        isParking: true,
                      });
                    } catch (e) {
                      console.log(e);
                      setModal(false);
                      setPhoneError('Mật khẩu không chính xác');
                      setVisibleWarning(true);
                      setTimeout(() => {
                        setVisibleWarning(false);
                      }, 3000);
                    }
                  }
                }}
                secureTextEntry={true}
                onCodeFilled={setValue}
                //   onCodeChanged={() => setIsError(false)}
              />
            </View>
          </View>
        </View>
      )}
      <YesNoModal
        icon={<Icons.WarningIcon />}
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
        message={phoneError}
        onActionLeft={() => {
          setVisibleWarning(false);
        }}
        onActionRight={() => {
          setVisibleWarning(false);
        }}
        btnTextLeft={'Xác nhận'}
        style={{flexDirection: 'column'}}
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffffff',
    width: 52,
    height: 52,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  buttonTranfer: {
    width: 52,
    height: 52,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  wrapperButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
    paddingTop: 5,
    fontFamily: 'Poppins-Regular',
  },
});

export default Banner;
