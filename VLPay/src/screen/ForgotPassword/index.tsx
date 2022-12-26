import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {useCallback} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import {UText, Utitle} from '../../components/UText';
import Arrow from '../../assets/svg/arrow_left.svg';
import {Control, Controller, useForm} from 'react-hook-form';
import {ILoginInfoValue} from '../Login/useHook';
// import { TextInput } from 'react-native-gesture-handler';
import PhoneIcon from '../../assets/svg/phone_icon.svg';
import {InputProps} from '@rneui/base';
import Input from '../../components/InputForm';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';
import {HStack} from 'native-base';

interface IFormInputControllerProps {
  control: Control<ILoginInfoValue, any>;
  name: keyof ILoginInfoValue;
  required: boolean;
}

const Index = (props: Props) => {
  const navigation = useNavigation<MainStackNavigation>();
  const {
    setValue,
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    defaultValues: {
      phoneNumber: '',
      password: '',
    },
  });
  const validatePhoneNumber = useCallback((phoneNumber: string) => {
    if (!phoneNumber) {
      return 'Trường số điện thoại không được bỏ trống';
    } else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(phoneNumber)) {
      return 'Số điện thoại phải 10 số và không có ký tự đặc biệt';
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
      <View style={{paddingBottom: 20, flex: 1, paddingHorizontal: 15}}>
        <View style={styles.header}>
          <Utitle style={styles.headerItem}>Quên mật khẩu</Utitle>
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
        <TouchableOpacity
          style={styles.buttonInput}
          onPress={() => navigation.navigate('Otp')}>
          <UText style={styles.textButtonInput}>Xác nhận</UText>
        </TouchableOpacity>
      </View>
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
      validation?: any;
      error?: any;
      errorRequired?: any;
    },
) => {
  const {
    control,
    name,
    title,
    placeHolder,
    errorRequired,
    validation,
    required,
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
