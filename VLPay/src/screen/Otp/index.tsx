import {UText} from '../../components/UText';
import {View, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import {HStack, ScrollView, Text} from 'native-base';
import Header from '../../components/Header';
import KeyboardInputScrollView from '../../components/KeyboardInputScrollView';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import NormalButton from '../../components/helpers/NormalButton';
import Arrow from '../../assets/svg/arrow_left.svg';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';

const RESEND_OTP_TIME_LIMIT = 60; // 60 secs
let resendOtpTimerInterval: any;

const Otp = (props: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT,
  );
  const [isError, setIsError] = useState<boolean>(false);
  const [value, setValue] = useState('');

  const startResendOtpTimer = useCallback(async () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      if (resendButtonDisabledTime <= 0) {
        clearInterval(resendOtpTimerInterval);
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    startResendOtpTimer();

    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
  }, [resendButtonDisabledTime, startResendOtpTimer]);
  const Header = () => {
    return (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <HStack style={{marginTop: 25}}>
          <Arrow style={{marginRight: 10}} />
        </HStack>
      </TouchableOpacity>
    );
  };
  return (
    <LinearGradient
      colors={['#FEB7B1', '#FFFFFF']}
      style={styles.linearGradient}>
      <Header />
      <ScrollView>
        <KeyboardInputScrollView>
          <Text style={styles.titleBG}>Xác thực số điện thoại</Text>
          <View style={styles.otpMain}>
            <OTPInputView
              style={styles.otpContainer}
              pinCount={6}
              autoFocusOnLoad
              codeInputFieldStyle={styles.underlineStyleBase}
              keyboardType="number-pad"
              secureTextEntry={true}
              onCodeFilled={setValue}
              onCodeChanged={() => setIsError(false)}
            />
          </View>
          <Text style={styles.error}>{isError ? 'Mã otp không đúng' : ''}</Text>
          <NormalButton
            title={'Xác nhận'}
            // onPress={verifyFireBase}
            disabled={(value?.length || 0) < 6}
            containerStyle={styles.btnMain}
          />
          <View style={styles.containerOPT}>
            {/* <Text style={styles.optText}>Not receipt otp</Text>
            {resendButtonDisabledTime > 0 ? (
              <View>
                <Text style={styles.optText}>
                  {`Resend (${resendButtonDisabledTime || ''}s)`}
                </Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.resendText}>
                <Text style={styles.resend}> Gửi lại</Text>
              </TouchableOpacity>
            )} */}
          </View>
        </KeyboardInputScrollView>
      </ScrollView>
    </LinearGradient>
  );
};

export default Otp;
