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
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';
import {InputProps} from '@rneui/base';
import KeyboardInputScrollView from '../../components/KeyboardInputScrollView';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import {LOGIN} from '../../redux/constants';
import {useDispatch} from 'react-redux';
import {Login} from '../../redux/actions/authAction';

interface IFormInputControllerProps {
  control: Control<IRegisterInfoValue, any>;
  name: keyof IRegisterInfoValue;
  required: boolean;
}

const Index = function () {
  const navigation = useNavigation<MainStackNavigation>();
  const dispatch = useDispatch();
  const [btnBlock, setBtnBlock] = useState(false);

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

  const submit = useCallback(async (data: any) => {
    const {
      email: full_name,
      password: password,
      passwordConfirmation: password_confirmation,
      phoneNumber: phone,
    } = data;
    setBtnBlock(true);
    console.log(data);

    try {
      await axios.post('https://zennoshop.cf/api/user/register', {
        full_name: full_name,
        phone: phone,
        password: password,
        password_confirmation: password_confirmation,
      });

      dispatch(await Login(phone, password));
      setBtnBlock(false);
      navigation.goBack();
    } catch (e) {
      console.log(e);
      setBtnBlock(false);
    }

    // if (auth()?.currentUser) {
    //   await auth()
    //     .signOut()
    //     .catch(e => console.log(e));
    // }
    // try {
    //   const removeZeroPhone = data.phoneNumber.replace('0', '');
    //   const confirmation = await auth().signInWithPhoneNumber(
    //     `+84${removeZeroPhone}`,
    //   );
    //   console.log(confirmation);
    // } catch (error) {
    //   console.log('error ', error);
    // }
  }, []);

  console.log(errors);

  const validationPswConfirm = useCallback(
    (psw: string) => {
      if (!psw) {
        return 'Password confirm is required';
      }
      if (getValues('password')) {
        if (
          watch('passwordConfirmation') !== watch('password') &&
          getValues('passwordConfirmation')
        ) {
          return 'Password confirm must match with password';
        }
      }
    },
    [getValues, watch],
  );

  const validationPsw = useCallback((pws: string) => {
    if (!pws) {
      return 'Password is required';
    } else if (pws.length < 10) {
      return 'Password must have at least 10 character';
    }
  }, []);

  const validateName = useCallback((name: string) => {
    if (!name) {
      return 'Name is required';
    } else if (name.length < 4) {
      return 'Field name must have at least 4 characters';
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardInputScrollView>
          <VStack style={{paddingBottom: 20}}>
            <View style={styles.header}>
              <Utitle style={styles.headerItem}>{strings.register}</Utitle>
            </View>
            <FormInputController
              title={strings.name}
              placeHolder={strings.name_placeholder}
              styles={styles.textInput}
              control={control}
              name={'name'}
              validation={validateName}
              required={true}
              error={errors?.name?.message}
            />
            <FormInputController
              title={strings.phone_number}
              LeftIcon={<PhoneIcon width={20} height={20} />}
              placeHolder={strings.phone_placeholder}
              styles={styles.textInput}
              control={control}
              name={'phoneNumber'}
              keyboardType={'phone-pad'}
              required={false}
              validation={validatePhoneNumber}
              error={errors?.phoneNumber?.message}
            />
            <FormInputController
              title={strings.password}
              LeftIcon={<LockIcon width={20} height={20} />}
              placeHolder={strings.password_placeholder}
              styles={styles.textInput}
              control={control}
              name={'password'}
              required={false}
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
              error={errors?.password?.message}
              hide={hide}
            />
            <FormInputController
              title={strings.password}
              LeftIcon={<LockIcon width={20} height={20} />}
              placeHolder={strings.password_confirmation}
              styles={styles.textInput}
              control={control}
              name={'passwordConfirmation'}
              required={false}
              validation={validationPswConfirm}
              RightIcon={
                <TouchableOpacity
                  style={styles.passwordIcon}
                  onPress={() => {
                    setHideConfirm(!hide);
                  }}>
                  {hideConfirm ? <BlindIcon /> : <EyeIcon />}
                </TouchableOpacity>
              }
              error={errors?.passwordConfirmation?.message}
              hide={hideConfirm}
            />
            <TouchableOpacity
              disabled={btnBlock}
              onPress={handleSubmit(submit)}
              style={styles.buttonInput}>
              <UText style={styles.textButtonInput}>{strings.register}</UText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}>
              <Text>Quay lại đăng nhập</Text>
            </TouchableOpacity>
          </VStack>
        </KeyboardInputScrollView>
      </ScrollView>
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
    <>
      <Utitle style={{fontSize: 18}}>{title}</Utitle>
      <Controller
        name={name}
        control={control}
        rules={{required: required, validate: validation}}
        render={({field: {value, onChange}}) => {
          return (
            <View>
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
            </View>
          );
        }}
      />
    </>
  );
};

export default Index;
