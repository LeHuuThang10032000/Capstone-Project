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

interface IFormInputControllerProps {
  control: Control<IRegisterInfoValue, any>;
  name: keyof IRegisterInfoValue;
  required: boolean;
}

const Index = function () {
  const navigation = useNavigation<MainStackNavigation>();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
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

  return (
    <LinearGradient
      colors={['#FEB7B1', '#FFFFFF']}
      style={styles.linearGradient}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack>
          <View style={styles.header}>
            <Utitle style={styles.headerItem}>{strings.login}</Utitle>
          </View>
          <FormInputController
            title={strings.email}
            LeftIcon={<Mail width={20} height={20} />}
            placeHolder={strings.phone_placeholder}
            styles={styles.textInput}
            control={control}
            name={'email'}
            required={true}
          />
          <FormInputController
            title={strings.phone_number}
            LeftIcon={<PhoneIcon width={20} height={20} />}
            placeHolder={strings.phone_placeholder}
            styles={styles.textInput}
            control={control}
            name={'email'}
            required={true}
          />
          <FormInputController
            title={strings.password}
            LeftIcon={<LockIcon width={20} height={20} />}
            placeHolder={strings.password_placeholder}
            styles={styles.textInput}
            control={control}
            name={'password'}
            required={true}
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
            name={'password'}
            required={true}
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
          <HStack alignItems={'center'} justifyContent={'space-between'}>
            <HStack alignItems={'center'}>
              <CheckBox
                disabled={false}
                value={toggleCheckBox}
                onValueChange={newValue => setToggleCheckBox(newValue)}
              />
              <UText>{strings.rememberMe}</UText>
            </HStack>
            <TouchableOpacity>
              <UText style={styles.textButtonOpacity}>
                {strings.forgotPassword}
              </UText>
            </TouchableOpacity>
          </HStack>
          <Flex style={styles.buttonInput}>
            <UText style={styles.textButtonInput}>{strings.login}</UText>
          </Flex>
          <Flex flexDirection={'row'} justifyContent={'flex-end'} mt="1">
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Register');
              }}>
              <UText>{strings.register}</UText>
            </TouchableOpacity>
          </Flex>
        </VStack>
      </ScrollView>
    </LinearGradient>
  );
};

const FormInputController = (
  props: IFormInputControllerProps & {
    title: string;
    placeHolder: string;
    styles?: any;
    RightIcon?: React.ReactNode;
    LeftIcon?: React.ReactNode;
    hide?: boolean;
    setHide?: any;
  },
) => {
  const {control, name, title, placeHolder, required} = props;
  return (
    <>
      <Utitle style={{fontSize: 18}}>{title}</Utitle>
      <Controller
        name={name}
        control={control}
        rules={{required: required}}
        render={({field: {value, onChange}}) => (
          <Input
            LeftIcon={props.LeftIcon}
            placeholder={placeHolder}
            style={props.styles}
            secureTextEntry={props.hide}
            RightIcon={props.RightIcon}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
    </>
  );
};

export default Index;
