import {StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import HeaderBack from '../../components/HeaderBack';
import {MainStackNavigation, MainStackParamList} from '../../stack/Navigation';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  Center,
  Image,
  Button,
  Text,
  TextArea,
  View,
  Input,
  FormControl,
  VStack,
  Pressable,
  HStack,
  ScrollView,
} from 'native-base';
import CurrencyInput from 'react-native-currency-input';
import ContactIcon from '../../assets/svg/contact.svg';
import {Controller, useForm} from 'react-hook-form';
import {PermissionsAndroid} from 'react-native';
import Contacts from 'react-native-contacts';
import WarningIcon from '../../assets/svg/warning.svg';
import {
  escapeCurrency,
  formatCurrency,
} from '../../components/helpers/formatNum';
import TText from './TText';
import YesNoModal from '../../components/YesNoModal';
import Icons from '../../components/icons';
import Colors from '../../components/helpers/Colors';
import {axiosClient} from '../../components/apis/axiosClient';
interface Transfer {
  name: string;
  phone: string;
  money: string;
  mess: string;
}

const Index = props => {
  const {userWallet} =
    useRoute<RouteProp<MainStackParamList, 'Transfer'>>()?.params;
  const navigation = useNavigation<MainStackNavigation>();
  const balances = useMemo(() => ['50000', '100000', '200000'], []);
  const [errorDisplay, setErrorDisplay] = useState(false);
  const [errorWarning, setErroWarning] = useState('');
  const validatePhoneNumber = useCallback((phoneNumber: string) => {
    if (!phoneNumber) {
      return 'Số điện thoại không được bỏ trống';
    } else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(phoneNumber)) {
      return 'Số điện thoại chưa chính xác';
    }
  }, []);

  const onSubmit = async (data: any) => {
    if (!(data.money > userWallet)) {
      try {
        const phone = data.phone;
        console.log(123);

        const result = await axiosClient.post('/check-phone', {
          phone,
        });
        if (result?.data?.status_code == 422) {
          navigation.navigate('ConfirmPM', {data});
        } else {
          setErroWarning('Số  điện thoại không tồn tại');
          setErrorDisplay(true);
        }
      } catch (e: any) {
        setErroWarning(e?.data?.message);
      }
    } else {
      setErroWarning('Số dư trong ví không đủ. Vui lòng nạp!');
      setErrorDisplay(true);
    }
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<Transfer>({
    defaultValues: {
      name: '',
      phone: '',
      money: '',
      mess: '',
    },
  });
  // useEffect(() => {
  //   getPermission();
  // }, []);
  // const getPermission = () => {
  //   PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
  //     title: 'Contacts',
  //     message: 'This app would like to view your contacts.',
  //     buttonPositive: 'Please accept bare mortal',
  //   }).then(res => {
  //     if (res == 'granted') {
  //       Contacts.getAll()
  //         .then(contacts => {
  //           console.log(contacts);
  //         })
  //         .catch(e => {
  //           console.log(e);
  //         });
  //     }
  //   });
  // };

  return (
    <View flex={1} backgroundColor={'white'}>
      <HeaderBack title="Chuyển tiền" />
      <ScrollView>
        <Center height={'100%'} py={5}>
          <VStack>
            <HStack
              p={1}
              justifyContent={'center'}
              alignItems="center"
              borderRadius={8}
              backgroundColor="rgba(217, 217, 217, 0.42)">
              <WarningIcon style={{marginRight: 5}} />
              <View>
                <Text>Kiểm tra thật kĩ thông tin người nhận trước khi</Text>
                <Text>chuyển tiền nha</Text>
              </View>
            </HStack>
            <Controller
              control={control}
              rules={{
                required: 'Số điện thoại không được để trống',
                validate: validatePhoneNumber,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <FormControl isInvalid={errors.phone !== undefined}>
                  <FormControl.Label
                    _text={{
                      color: '#312E49',
                      fontWeight: 'bold',
                      fontSize: 16,
                    }}>
                    Số điện thoại
                  </FormControl.Label>
                  <Input
                    w="90%"
                    placeholder="Nhập số điện thoại gồm 10 số"
                    onChangeText={onChange}
                    keyboardType="phone-pad"
                    onBlur={onBlur}
                    value={value}
                    backgroundColor="white"
                    style={{fontFamily: 'Poppins-Regular', fontSize: 14}}
                    rightElement={
                      <TouchableOpacity style={{paddingRight: 10}}>
                        <ContactIcon />
                      </TouchableOpacity>
                    }
                  />
                  <FormControl.ErrorMessage>
                    {errors.phone?.message}
                  </FormControl.ErrorMessage>
                </FormControl>
              )}
              name="phone"
            />

            <Controller
              control={control}
              rules={{required: 'Họ và tên không được để trống'}}
              render={({field: {onChange, onBlur, value}}) => (
                <FormControl isInvalid={errors.name !== undefined}>
                  <FormControl.Label
                    _text={{
                      color: '#312E49',
                      fontWeight: 'bold',
                      fontSize: 16,
                    }}>
                    Họ và tên
                  </FormControl.Label>
                  <Input
                    w="90%"
                    placeholder="Nhập Họ và tên"
                    onChangeText={onChange}
                    backgroundColor="white"
                    onBlur={onBlur}
                    value={value}
                    style={{fontFamily: 'Poppins-Regular', fontSize: 14}}
                  />
                  <FormControl.ErrorMessage>
                    {errors.name?.message}
                  </FormControl.ErrorMessage>
                </FormControl>
              )}
              name="name"
            />

            <Controller
              control={control}
              rules={{required: 'Vui lòng nhập số tiền'}}
              render={({field: {onChange, onBlur, value}}) => (
                <FormControl isInvalid={errors.money !== undefined}>
                  <FormControl.Label
                    _text={{
                      color: '#312E49',
                      fontWeight: 'bold',
                      fontSize: 16,
                    }}>
                    Nhập số tiền
                  </FormControl.Label>
                  <Input
                    w="90%"
                    placeholder="Nhập số tiền muốn chuyển"
                    onChangeText={onChange}
                    onChange={() => console.log(value)}
                    keyboardType="number-pad"
                    backgroundColor="white"
                    onBlur={onBlur}
                    value={value}
                    style={{fontFamily: 'Poppins-Regular', fontSize: 14}}
                  />

                  <FormControl.ErrorMessage>
                    {errors.money?.message}
                  </FormControl.ErrorMessage>
                </FormControl>
              )}
              name="money"
            />

            <HStack space={2} py={5}>
              {balances.map(value => (
                <Pressable
                  padding={3}
                  flex={1}
                  borderRadius={8}
                  key={value}
                  backgroundColor={'#D9D9D9'}
                  onPress={() => setValue('money', value)}>
                  <TText style={{textAlign: 'center'}}>
                    {formatCurrency(value.toString())}
                  </TText>
                </Pressable>
              ))}
            </HStack>

            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <FormControl isInvalid={errors.mess !== undefined}>
                  <FormControl.Label
                    _text={{
                      color: '#312E49',
                      fontWeight: 'bold',
                      fontSize: 16,
                    }}>
                    Lời nhắn
                  </FormControl.Label>
                  <TextArea
                    w={'90%'}
                    mb="5"
                    placeholder="Nhập lời nhắn..."
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    autoCompleteType={undefined}
                  />
                  <FormControl.ErrorMessage>
                    {errors.mess?.message}
                  </FormControl.ErrorMessage>
                </FormControl>
              )}
              name="mess"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(onSubmit)}>
              <Text style={styles.text}>Chuyển tiền</Text>
            </TouchableOpacity>
          </VStack>
        </Center>
      </ScrollView>
      <YesNoModal
        icon={<Icons.WarningIcon />}
        visible={errorDisplay}
        btnLeftStyle={{
          backgroundColor: Colors.primary,
          width: 200,
        }}
        hideRight={true}
        btnRightStyle={{
          backgroundColor: '#909192',
          width: 200,
        }}
        message={errorWarning}
        onActionLeft={() => {
          setErrorDisplay(false);
        }}
        onActionRight={() => {
          setErrorDisplay(false);
        }}
        btnTextLeft={'Xác nhận'}
        style={{flexDirection: 'column'}}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#B5EAD8',
    padding: 15,
    marginTop: 50,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Poppins-ExtraBold',
    color: '#514545',
  },
});
