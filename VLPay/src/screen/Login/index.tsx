import React, {useCallback, useState} from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import {UText, Utitle} from '../../components/UText';
import LockIcon from '../../assets/svg/lock.svg';
import PhoneIcon from '../../assets/svg/phone_icon.svg';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import CheckBox from '@react-native-community/checkbox';
import BlindIcon from '../../assets/svg/blind_icon.svg';
import EyeIcon from '../../assets/svg/eye_icon.svg';
import {Flex, HStack, Image, VStack} from 'native-base';
import strings from '../../components/helpers/Strings';
import Input from '../../components/InputForm';
import {Control, Controller, useForm} from 'react-hook-form';
import {ILoginInfoValue} from './useHook';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';
import {useSelector, useDispatch} from 'react-redux';
import {Login} from '../../redux/actions/authAction';
import {InputProps} from '@rneui/base';

interface IFormInputControllerProps {
  control: Control<ILoginInfoValue, any>;
  name: keyof ILoginInfoValue;
  required: boolean;
}

const Index = function () {
  const navigation = useNavigation<MainStackNavigation>();
  const dispatch = useDispatch();

  const submit = async (value: any) => {
    console.log(value);
    const {phoneNumber, password} = value;

    dispatch(await Login(phoneNumber, password));
  };

  const [toggleCheckBox, setToggleCheckBox] = useState(false);
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
  const [hide, setHide] = useState(true);
  const validationPsw = useCallback((pws: string) => {
    if (!pws) {
      return 'Password is required';
    } else if (pws.length < 6) {
      return 'Password must have at least 6 character';
    }
  }, []);

  const validatePhoneNumber = useCallback((phoneNumber: string) => {
    if (!phoneNumber) {
      return 'Phone number is required';
    } else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(phoneNumber)) {
      return 'Format phone number is wrong';
    }
  }, []);

  return (
    <LinearGradient
      colors={['#FEB7B1', '#FFFFFF']}
      style={styles.linearGradient}>
      <VStack flex={1}>
        <View style={styles.header}>
          <Utitle style={styles.headerItem}>{strings.login}</Utitle>
        </View>
        <FormInputController
          title={strings.phone_number}
          LeftIcon={<PhoneIcon width={20} height={20} />}
          placeHolder={strings.phone_placeholder}
          styles={styles.textInput}
          control={control}
          name={'phoneNumber'}
          keyboardType={'phone-pad'}
          required={true}
          error={errors?.phoneNumber?.message}
          validation={validatePhoneNumber}
        />
        <FormInputController
          title={strings.password}
          LeftIcon={<LockIcon width={20} height={20} />}
          placeHolder={strings.password_placeholder}
          styles={styles.textInput}
          control={control}
          name={'password'}
          required={true}
          validation={validationPsw}
          error={errors?.password?.message}
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
        <HStack alignItems={'center'} justifyContent={'flex-end'}>
          <TouchableOpacity style={{marginBottom: 35}}>
            <UText style={styles.textButtonOpacity}>
              {strings.forgotPassword}?
            </UText>
          </TouchableOpacity>
        </HStack>
        <Flex style={styles.buttonInput}>
          <TouchableOpacity onPress={handleSubmit(submit)}>
            <UText style={styles.textButtonInput}>{strings.login}</UText>
          </TouchableOpacity>
        </Flex>
        <TouchableOpacity
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 0,
          }}
          onPress={() => {
            navigation.navigate('Register');
          }}>
          <UText>
            Don't have an account?{' '}
            <UText
              style={{
                color: '#2805FF',
              }}>
              {strings.register}
            </UText>
          </UText>
        </TouchableOpacity>
      </VStack>
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
    },
) => {
  const {
    control,
    name,
    title,
    placeHolder,
    required,
    validation,
    error,
    ...rest
  } = props;
  return (
    <View>
      <Utitle style={{fontSize: 18}}>{title}</Utitle>
      <Controller
        name={name}
        control={control}
        rules={{required: true, validate: validation}}
        render={({field: {value, onChange}}) => (
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
        )}
      />
      {error && <UText style={styles.error}>{error}</UText>}
    </View>
  );
};

export default Index;
