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
// import auth from '@react-native-firebase/auth';

interface IFormInputControllerProps {
  control: Control<IRegisterInfoValue, any>;
  name: keyof IRegisterInfoValue;
  required: boolean;
}

const Index = function () {
  const navigation = useNavigation<MainStackNavigation>();
  const {
    setValue,
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      phoneNumber: '',
      passwordConfirmation: '',
      gender: 0,
    },
  });
  const [hide, setHide] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);

  const submit = useCallback(async (data: {phoneNumber: string}) => {
    // const isDeviceHasUserLogedIn = auth().currentUser;
    if (isDeviceHasUserLogedIn) {
      // await auth().signOut();
      // .catch(error => console.log(error));
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
              title={strings.email}
              LeftIcon={<Mail width={20} height={20} />}
              placeHolder={strings.phone_placeholder}
              styles={styles.textInput}
              control={control}
              name={'email'}
              required={false}
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
            />
            <FormInputController
              title={strings.password}
              LeftIcon={<LockIcon width={20} height={20} />}
              placeHolder={strings.password_placeholder}
              styles={styles.textInput}
              control={control}
              name={'password'}
              required={false}
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
            <FormInputController
              title={strings.password}
              LeftIcon={<LockIcon width={20} height={20} />}
              placeHolder={strings.password_confirmation}
              styles={styles.textInput}
              control={control}
              name={'passwordConfirmation'}
              required={false}
              RightIcon={
                <TouchableOpacity
                  style={styles.passwordIcon}
                  onPress={() => {
                    setHideConfirm(!hide);
                  }}>
                  {hideConfirm ? <BlindIcon /> : <EyeIcon />}
                </TouchableOpacity>
              }
              hide={hideConfirm}
            />
            <TouchableOpacity
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
    },
) => {
  const {control, name, title, placeHolder, required, ...rest} = props;
  return (
    <>
      <Utitle style={{fontSize: 18}}>{title}</Utitle>
      <Controller
        name={name}
        control={control}
        rules={{required: required}}
        render={({field: {value, onChange}}) => {
          return (
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
          );
        }}
      />
    </>
  );
};

export default Index;
