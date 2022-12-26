import {Text, TouchableOpacity} from 'react-native';
import React, {useCallback} from 'react';
import HeaderBack from '../../components/HeaderBack';
import {Controller, useForm} from 'react-hook-form';
import {Center, FormControl, Input, VStack, Heading} from 'native-base';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';

interface Security {
  password: string;
  passwordConfirm: string;
}

const Index = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const {
    control,
    handleSubmit,
    getValues,
    watch,
    formState: {errors},
  } = useForm<Security>();
  const onSubmit = (data: any) => {
    console.log(data);
    // navigation.navigate('Otp');
  };
  const validationPsw = useCallback((pws: string) => {
    if (!pws) {
      return 'Không được để trống';
    } else if (pws.length < 6) {
      return 'Mật khẩu bắt buộc 6 số';
    }
  }, []);

  const validationPswConfirm = useCallback(
    (psw: string) => {
      if (!psw) {
        return 'Không được để trống';
      }
      if (getValues('password')) {
        if (
          watch('passwordConfirm') !== watch('password') &&
          getValues('passwordConfirm')
        ) {
          return 'Mật khẩu chưa trùng khớp';
        }
      }
    },
    [getValues, watch],
  );

  return (
    <LinearGradient
      colors={['#FEB7B1', '#FFFFFF']}
      style={{flex: 1, borderRadius: 5}}>
      <HeaderBack title="Thay đổi mật khẩu" />
      <Center mt={100}>
        <VStack space={3}>
          <Heading>Nhập mật khẩu mới của bạn</Heading>
          <Controller
            control={control}
            rules={{required: 'không được để trống', validate: validationPsw}}
            render={({field: {onChange, onBlur, value}}) => (
              <FormControl isInvalid={errors.password !== undefined}>
                <FormControl.Label
                  _text={{
                    fontSize: 16,
                    fontFamily: 'Poppins-Regular',
                    fontWeight: 'bold',
                  }}>
                  Nhập mật khẩu mới
                </FormControl.Label>
                <Input
                  placeholder="Nhập mật khẩu gồm 6 số"
                  keyboardType="number-pad"
                  maxLength={6}
                  secureTextEntry={true}
                  w="90%"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  borderColor={'#A2A2A6'}
                  style={{fontFamily: 'Poppins-Regular', fontSize: 14}}
                />
                <FormControl.ErrorMessage>
                  {errors.password?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            )}
            name="password"
          />

          <Controller
            control={control}
            rules={{
              required: 'không được để trống',
              validate: validationPswConfirm,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <FormControl isInvalid={errors.passwordConfirm !== undefined}>
                <FormControl.Label
                  _text={{
                    fontSize: 16,
                    fontFamily: 'Poppins-Regular',
                    fontWeight: 'bold',
                  }}>
                  Nhập lại mật khẩu mới
                </FormControl.Label>
                <Input
                  placeholder="Nhập mật khẩu gồm 6 số"
                  keyboardType="number-pad"
                  maxLength={6}
                  secureTextEntry={true}
                  w="90%"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  borderColor={'#A2A2A6'}
                  style={{fontFamily: 'Poppins-Regular', fontSize: 14}}
                />
                <FormControl.ErrorMessage>
                  {errors.passwordConfirm?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            )}
            name="passwordConfirm"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}>
            <Text style={styles.text}>Lưu</Text>
          </TouchableOpacity>
        </VStack>
      </Center>
    </LinearGradient>
  );
};

export default Index;
