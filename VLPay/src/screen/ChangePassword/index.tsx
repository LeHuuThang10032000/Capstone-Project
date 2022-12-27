import React, {useCallback, useState} from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
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
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {MainStackNavigation, MainStackParamList} from '../../stack/Navigation';
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
  const {phone} =
    useRoute<RouteProp<MainStackParamList, 'ChangePassword'>>()?.params;

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
      password: '',
      passwordConfirmation: '',
    },
  });
  const [hide, setHide] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);

  const submit = useCallback(async (data: any) => {
    const {password: password, passwordConfirmation: password_confirmation} =
      data;

    setBtnBlock(true);

    try {
      const result = await axiosClient.post(
        'https://zennoshop.cf/api/user/forgot-password',
        {
          phone,
          password,
          password_confirmation,
        },
      );
      setPhoneError(result.data.message);
      setVisibleWarning(true);
      dispatch(await Login(phone, password ?? ''));
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
      setBtnBlock(false);
    } catch (e) {
      console.log(e);
      setBtnBlock(false);
    }
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
            <Utitle style={styles.headerItem}>Nhập mật khẩu mới</Utitle>
          </View>
          <FormInputController
            title={'Mật khẩu mới'}
            placeHolder={'Nhập mật khẩu'}
            styles={styles.textInput}
            control={control}
            name={'password'}
            required={true}
            errorRequired={
              errors?.password?.type && 'Mật khẩu không được bỏ trống'
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
            placeHolder={'Nhập lại mật khẩu'}
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
        <View
          style={{
            width: '100%',
            marginRight: 10,
            paddingHorizontal: 15,
          }}>
          <TouchableOpacity
            disabled={btnBlock}
            onPress={handleSubmit(submit)}
            style={[styles.buttonInput]}>
            <UText style={styles.textButtonInput}>Gửi</UText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <YesNoModal
        icon={<Icons.SuccessIcon />}
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
