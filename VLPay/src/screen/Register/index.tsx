import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {UText, Utitle} from '../../components/UText';
import LockIcon from '../../assets/svg/lock.svg';
import Mail from '../../assets/svg/mail.svg';
import PhoneIcon from '../../assets/svg/phone_icon.svg';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import CheckBox from '@react-native-community/checkbox';
import BlindIcon from '../../assets/svg/blind_icon.svg';
import EyeIcon from '../../assets/svg/eye_icon.svg';
import {Flex, HStack, Image, ScrollView, VStack} from 'native-base';
import strings from '../../components/helpers/Strings';
import Input from '../../components/InputForm';
import {Control, Controller, useForm} from 'react-hook-form';
import {IRegisterInfoValue} from './useHook';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';
import {InputProps} from '@rneui/base';
import KeyboardInputScrollView from '../../components/KeyboardInputScrollView';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import {LOGIN} from '../../redux/constants';
import {useDispatch} from 'react-redux';
import {Login} from '../../redux/actions/authAction';
import Icons from '../../components/icons';
import YesNoModal from '../../components/YesNoModal';
import Colors from '../../components/helpers/Colors';
import {axiosClient} from '../../components/apis/axiosClient';
import Arrow from '../../assets/svg/arrow_left.svg';

interface IFormInputControllerProps {
  control: Control<IRegisterInfoValue, any>;
  name: keyof IRegisterInfoValue;
  required: boolean;
}

const Index = function () {
  const navigation = useNavigation<MainStackNavigation>();
  const dispatch = useDispatch();
  const [btnBlock, setBtnBlock] = useState(false);
  const [visibleWarning, setVisibleWarning] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const {
    getValues,
    handleSubmit,
    watch,
    control,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: '',
      password: '',
      phoneNumber: '',
      passwordConfirmation: '',
    },
  });
  const [hide, setHide] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);
  const [isLoading, setLoading] = useState(false);

  const submit = useCallback(async (data: any) => {
    const {
      name: full_name,
      password: password,
      passwordConfirmation: password_confirmation,
      phoneNumber: phone,
    } = data;

    setBtnBlock(true);
    setLoading(true);

    try {
      const result = await axiosClient.post(
        'https://zennoshop.cf/api/user/check-phone',
        {
          phone,
        },
      );

      if (result.data.status_code == 422) {
        setVisibleWarning(true);
        setPhoneError(result.data.message);
        setBtnBlock(false);
      } else {
        if (auth()?.currentUser) {
          await auth()
            .signOut()
            .catch(e => console.log(e));
        }
        try {
          const removeZeroPhone = phone.replace('0', '');
          const confirmation = await auth().signInWithPhoneNumber(
            `+84${removeZeroPhone}`,
          );
          setBtnBlock(false);
          navigation.replace('Otp', {
            phone: phone,
            full_name: full_name,
            password: password,
            password_confirmation: password_confirmation,
            confirmation: confirmation,
          });
        } catch (error) {
          console.log('error ', error);
          setVisibleWarning(true);
          setBtnBlock(false);
        }
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }, []);

  const validationPswConfirm = useCallback(
    (psw: string) => {
      if (!psw) {
        return 'Nhập lại mật khẩu không được để trống';
      } else if (psw.length < 6) {
        return 'Mật khẩu nhập lại bắt buộc 6 số';
      } else if (getValues('password')) {
        if (
          watch('passwordConfirmation') !== watch('password') &&
          getValues('passwordConfirmation')
        ) {
          return 'Mật khẩu chưa trùng khớp';
        }
      }
    },
    [getValues, watch],
  );

  const validationPsw = useCallback((pws: string) => {
    if (!pws) {
      return 'Mật khẩu không được để trống';
    } else if (pws.length < 6) {
      return 'Mật khẩu bắt buộc 6 số';
    }
  }, []);

  const validateName = useCallback((name: string) => {
    if (!name) {
      return 'Name is required';
    } else if (name.length < 4) {
      return 'Họ và tên phải có ít nhất 4 ký tự';
    } else if (name.length > 25) {
      return 'Họ và tên không nhiều hơn 25 ký tự';
    }
  }, []);

  const validatePhoneNumber = useCallback((phoneNumber: string) => {
    if (!phoneNumber) {
      return 'Số điện thoại không được để trống';
    } else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(phoneNumber)) {
      return 'Số điện thoại chưa đúng 10 số';
    }
  }, []);
  const Header = () => {
    return (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <HStack style={{marginTop: 25}}>
          <Arrow style={{marginLeft: 15}} />
        </HStack>
      </TouchableOpacity>
    );
  };
  return (
    <LinearGradient
      colors={['#FEB7B1', '#FFFFFF']}
      style={styles.linearGradient}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack
          style={{
            paddingBottom: 20,
            flex: 1,
            paddingHorizontal: 15,
          }}>
          <View style={styles.header}>
            <Utitle style={styles.headerItem}>Đăng ký</Utitle>
          </View>
          <FormInputController
            title={'Họ và tên'}
            placeHolder={'Nhập họ và tên'}
            styles={styles.textInput}
            control={control}
            name={'name'}
            validation={validateName}
            required={true}
            error={errors?.name?.message}
            errorRequired={
              errors?.name?.type && 'Họ và tên không được để trống'
            }
          />
          <FormInputController
            title={'Số điện thoại'}
            placeHolder={'Nhập số điện thoại gồm 10 số'}
            styles={styles.textInput}
            control={control}
            name={'phoneNumber'}
            keyboardType={'phone-pad'}
            required={true}
            validation={validatePhoneNumber}
            error={errors?.phoneNumber?.message}
            errorRequired={
              errors?.phoneNumber?.type && 'Số điện thoại không được để trống'
            }
          />
          <FormInputController
            title={'Mật khẩu'}
            placeHolder={'Nhập mật khẩu gồm 6 số'}
            styles={styles.textInput}
            control={control}
            name={'password'}
            required={true}
            errorRequired={
              errors?.password?.type && 'Mật khẩu không được để trống'
            }
            validation={validationPsw}
            RightIcon={
              <TouchableOpacity
                style={styles.passwordIcon}
                onPress={() => {
                  setHide(!hide);
                }}>
                {hide ? <BlindIcon /> : <EyeIcon />}
              </TouchableOpacity>
            }
            keyboardType="number-pad"
            maxLength={6}
            error={errors?.password?.message}
            hide={hide}
          />
          <FormInputController
            title={'Nhập lại mật khẩu'}
            placeHolder={'Nhập lại mật khẩu gồm 6 số'}
            styles={styles.textInput}
            control={control}
            name={'passwordConfirmation'}
            required={true}
            validation={validationPswConfirm}
            RightIcon={
              <TouchableOpacity
                style={styles.passwordIcon}
                onPress={() => {
                  setHideConfirm(!hideConfirm);
                }}>
                {hideConfirm ? <BlindIcon /> : <EyeIcon />}
              </TouchableOpacity>
            }
            keyboardType="number-pad"
            maxLength={6}
            error={errors?.passwordConfirmation?.message}
            hide={hideConfirm}
            errorRequired={
              errors?.passwordConfirmation?.type &&
              'Nhập lại mật khẩu không được để trống'
            }
          />
        </VStack>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 70,
          width: '100%',
          marginRight: 10,
          paddingHorizontal: 15,
        }}>
        <TouchableOpacity
          disabled={isLoading}
          onPress={handleSubmit(submit)}
          style={[styles.buttonInput]}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <UText style={styles.textButtonInput}>Đăng ký</UText>
          )}
        </TouchableOpacity>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 10,
          width: '100%',
        }}>
        <HStack justifyContent={'center'}>
          <UText>Bạn đã có tài khoản? </UText>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Login');
            }}>
            <UText style={{color: '#2805FF'}}>Đăng nhập</UText>
          </TouchableOpacity>
        </HStack>
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
        title={'Lỗi đăng ký'}
        onActionLeft={() => {
          setVisibleWarning(false);
        }}
        onActionRight={() => {
          setVisibleWarning(false);
        }}
        btnTextLeft={'Xác nhận'}
        style={{flexDirection: 'column'}}
      />
    </LinearGradient>
  );
};

const FormInputController = (
  props: IFormInputControllerProps &
    InputProps & {
      title: string;
      placeHolder: string;
      styles?: any;
      RightIcon?: any;
      LeftIcon?: any;
      hide?: boolean;
      setHide?: any;
      errorRequired?: any;
      validation?: any;
      error?: any;
    },
) => {
  const {
    control,
    name,
    title,
    placeHolder,
    required,
    validation,
    errorRequired,
    error,
    ...rest
  } = props;
  return (
    <View style={{marginBottom: -5}}>
      <Utitle
        style={{
          fontSize: 18,
          fontWeight: '700',
          color: '#312E49',
          paddingHorizontal: 10,
          marginBottom: 5,
        }}>
        {title}
      </Utitle>
      <Controller
        name={name}
        control={control}
        rules={{required: required, validate: validation}}
        render={({field: {value, onChange}}) => {
          return (
            <View style={{height: 80}}>
              <Input
                leftIcon={props.LeftIcon}
                placeholder={placeHolder}
                style={props.styles}
                secureTextEntry={props.hide}
                rightIcon={props.RightIcon}
                onChangeText={onChange}
                value={value}
                {...rest}
              />
              {error && <UText style={styles.error}>{error}</UText>}
              {errorRequired && !error && (
                <UText style={styles.error}>{errorRequired}</UText>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

export default Index;
