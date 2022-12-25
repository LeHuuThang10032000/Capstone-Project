import {UText} from '../../components/UText';
import {View, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import {HStack, ScrollView, Text} from 'native-base';
import KeyboardInputScrollView from '../../components/KeyboardInputScrollView';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import NormalButton from '../../components/helpers/NormalButton';
import Arrow from '../../assets/svg/arrow_left.svg';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {MainStackNavigation, MainStackParamList} from '../../stack/Navigation';
import authFireBase, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {axiosClient} from '../../components/apis/axiosClient';
import YesNoModal from '../../components/YesNoModal';
import Icons from '../../components/icons';
import strings from '../../components/helpers/Strings';
import Colors from '../../components/helpers/Colors';
import {Login} from '../../redux/actions/authAction';
import {useDispatch} from 'react-redux';

const RESEND_OTP_TIME_LIMIT = 60; // 60 secs
let resendOtpTimerInterval: any;

const Otp = (props: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const dispatch = useDispatch();
  const {full_name, phone, password, password_confirmation, confirmation} =
    useRoute<RouteProp<MainStackParamList, 'Otp'>>()?.params;
  const [btnBlock, setBtnBlock] = useState(false);
  const [visibleWarning, setVisibleWarning] = useState(false);
  const [visibleSuccess, setVisibleSuccess] = useState(false);
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT,
  );
  const [isError, setIsError] = useState<boolean>(false);
  const [confirmationFirebase, setConfirmationFirebase] =
    useState<any>(confirmation);
  const [value, setValue] = useState('');
  const [userFireBase, setUserFireBase] = useState<any>();
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

  useEffect(() => {
    authFireBase().onAuthStateChanged(user => {
      if (user) {
        console.log('user:', user);
        setUserFireBase(user);
        // setValue('');
      }
    });
  }, []);

  const verifyFireBase = async () => {
    let idTokenResult: string = '';
    setBtnBlock(true);
    if (userFireBase) {
      idTokenResult = await (await userFireBase.getIdTokenResult()).token;
    } else {
      let usercredential: FirebaseAuthTypes.UserCredential;
      try {
        usercredential = await confirmationFirebase.confirm(value);
        const result = await usercredential.user.getIdTokenResult();
        idTokenResult = result?.token || '';
      } catch (err) {
        console.log(err);
        setVisibleWarning(true);
        setIsError(true);
        return;
      }
    }
    try {
      await axiosClient.post('https://zennoshop.cf/api/user/register', {
        full_name,
        phone,
        password,
        password_confirmation,
      });
      setVisibleSuccess(true);
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
      setBtnBlock(false);
    } catch (e) {
      console.log('====================================');
      console.log(e);
      setVisibleWarning(true);
      dispatch(await Login(phone, password ?? ''));
      setBtnBlock(false);
      console.log('====================================');
    }
  };

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
            onPress={verifyFireBase}
            disabled={(value?.length || 0) < 6 && btnBlock}
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
        message="Mã otp không đúng"
        title={'Thông báo'}
        onActionLeft={() => {
          setVisibleWarning(false);
        }}
        onActionRight={() => {
          setVisibleWarning(false);
        }}
        btnTextLeft={strings.confirm}
        style={{flexDirection: 'column'}}
      />
      <YesNoModal
        icon={<Icons.SuccessIcon />}
        visible={visibleSuccess}
        btnLeftStyle={{
          backgroundColor: Colors.primary,
          width: 200,
        }}
        btnRightStyle={{
          backgroundColor: '#909192',
          width: 200,
          display: 'none',
        }}
        message="Đăng ký thành công"
        title={'Thông báo'}
        onActionLeft={() => {
          setVisibleSuccess(false);
        }}
        onActionRight={() => {
          setVisibleSuccess(false);
        }}
        btnTextLeft={strings.confirm}
        style={{flexDirection: 'column'}}
      />
    </LinearGradient>
  );
};

export default Otp;
