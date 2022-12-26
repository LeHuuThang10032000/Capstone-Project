import React, {useCallback, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {UText, Utitle} from '../../components/UText';
import LockIcon from '../../assets/svg/lock.svg';
import PhoneIcon from '../../assets/svg/phone_icon.svg';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import CheckBox from '@react-native-community/checkbox';
import BlindIcon from '../../assets/svg/blind_icon.svg';
import EyeIcon from '../../assets/svg/eye_icon.svg';
import {Flex, HStack, VStack} from 'native-base';
import strings from '../../components/helpers/Strings';
import Input from '../../components/InputForm';
import {Control, Controller, useForm} from 'react-hook-form';
import {ILoginInfoValue} from './useHook';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';
import {useSelector, useDispatch} from 'react-redux';
import {Login} from '../../redux/actions/authAction';
import {InputProps} from '@rneui/base';
import YesNoModal from '../../components/YesNoModal';
import Icons from '../../components/icons';
import Colors from '../../components/helpers/Colors';
import {axiosClient} from '../../components/apis/axiosClient';

interface IFormInputControllerProps {
  control: Control<ILoginInfoValue, any>;
  name: keyof ILoginInfoValue;
  required: boolean;
}

const Index = function () {
  const navigation = useNavigation<MainStackNavigation>();
  const dispatch = useDispatch();
  const [visibleWarning, setVisibleWarning] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [disabled, setDisabled] = useState(false);

  const submit = async (value: any) => {
    const {phoneNumber, password} = value;
    setDisabled(true);
    try {
      const result = await axiosClient.post(
        'https://zennoshop.cf/api/user/check-phone',
        {
          phone: phoneNumber,
        },
      );

      if (result.data.status_code == 200) {
        setVisibleWarning(true);
        setPhoneError(result.data.message);
        setDisabled(false);
      }
    } catch (e) {
      console.log(e);
    }
    const result = dispatch(await Login(phoneNumber, password));
    setDisabled(false);
    if (!result.payload) {
      setVisibleWarning(true);
    }
  };

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    defaultValues: {
      phoneNumber: '',
      password: '',
    },
  });
  console.log(errors);

  const [hide, setHide] = useState(true);
  const validationPsw = useCallback((pws: string) => {
    if (!pws) {
      return 'Trường mật khẩu không được bỏ trống';
    } else if (pws.length < 6) {
      return 'Mật khẩu có ít nhất 6 kí tự';
    }
  }, []);

  const validatePhoneNumber = useCallback((phoneNumber: string) => {
    if (!phoneNumber) {
      return 'Trường số điện thoại không được bỏ trống';
    } else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(phoneNumber)) {
      return 'Số điện thoại phải 10 số và không có ký tự đặc biệt';
    }
  }, []);

  return (
    <LinearGradient
      colors={['#FEB7B1', '#FFFFFF']}
      style={styles.linearGradient}>
      <VStack flex={1}>
        <View style={styles.header}>
          <Utitle style={styles.headerItem}>Đăng nhập</Utitle>
        </View>
        <FormInputController
          title={'Số điện thoại'}
          LeftIcon={<PhoneIcon width={20} height={20} />}
          placeHolder={'Nhập số điện thoại'}
          styles={styles.textInput}
          control={control}
          name={'phoneNumber'}
          keyboardType={'phone-pad'}
          required={true}
          error={errors?.phoneNumber?.message}
          errorRequired={
            errors?.phoneNumber?.type &&
            'Trường số điện thoại không được bỏ trống'
          }
          validation={validatePhoneNumber}
        />
        <FormInputController
          title={'Mật khẩu'}
          LeftIcon={<LockIcon width={20} height={20} />}
          placeHolder={'Nhập mật khẩu của bạn'}
          styles={styles.textInput}
          control={control}
          name={'password'}
          required={true}
          validation={validationPsw}
          error={errors?.password?.message}
          errorRequired={
            errors?.password?.type && 'Trường mật khẩu không được bỏ trống'
          }
          RightIcon={
            <TouchableOpacity
              style={styles.passwordIcon}
              onPress={() => {
                setHide(!hide);
              }}>
              {hide ? <BlindIcon /> : <EyeIcon />}
            </TouchableOpacity>
          }
          hide={hide}
        />
        <HStack
          alignItems={'center'}
          style={{paddingHorizontal: 10}}
          justifyContent={'flex-end'}>
          <TouchableOpacity
            style={{marginBottom: 35}}
            onPress={() => navigation.navigate('ForgotPwd')}>
            <UText style={styles.textButtonOpacity}>Quên mật khẩu?</UText>
          </TouchableOpacity>
        </HStack>
        <Flex style={styles.buttonInput}>
          <TouchableOpacity onPress={handleSubmit(submit)}>
            <UText style={styles.textButtonInput}>Đăng nhập</UText>
          </TouchableOpacity>
        </Flex>
        <HStack
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 0,
          }}>
          <UText>Chưa có tài khoản? </UText>
          <TouchableOpacity
            style={{}}
            disabled={disabled}
            onPress={() => {
              navigation.navigate('Register');
            }}>
            <UText
              style={{
                color: '#2805FF',
              }}>
              Đăng ký
            </UText>
          </TouchableOpacity>
        </HStack>
      </VStack>
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
        title={'Lỗi đăng nhập'}
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
  console.log(error);

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
