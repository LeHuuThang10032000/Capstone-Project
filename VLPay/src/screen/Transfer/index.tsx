import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
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
import TText from './TText';
import YesNoModal from '../../components/YesNoModal';
import Icons from '../../components/Icons';
import Colors from '../../components/helpers/Colors';
import {axiosClient} from '../../components/apis/axiosClient';
import {UText} from '../../components/UText';
import Toast from 'react-native-toast-message';
import {
  convertStringNumber,
  escapeCurrency,
  formatCurrency,
} from '../../components/helper';
interface Transfer {
  current_wallet: any;
  current_user: string;
  name: string;
  phone: string;
  money: string;
  mess: string;
}

const Index = (props: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const balances = useMemo(() => ['50000', '100000', '200000'], []);
  const [errorDisplay, setErrorDisplay] = useState(false);
  const [errorWarning, setErroWarning] = useState('');
  const [profile, setProfile] = useState('');
  const [errorPhone, setErrorPhone] = useState('');
  const [userProfile, setUserProfile] = useState('');
  const [isLoading, setLoading] = useState(false);
  const {userWallet, payment_type} = props.route.params;

  console.log('PAYMENT_TYPE', payment_type);
  console.log('USER_WALLET', userWallet);

  const validatePhoneNumber = useCallback((phoneNumber: string) => {
    if (!phoneNumber) {
      return 'Số điện thoại không được bỏ trống';
    } else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(phoneNumber)) {
      return 'Vui lòng nhập đúng 10 số';
    }
  }, []);

  const fetchData = useCallback(async () => {
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/get-profile',
    );
    setUserProfile(result?.data?.data?.phone);
  }, []);

  useEffect(() => {
    // Call only when screen open or when back on screen
    fetchData();
  }, [fetchData]);

  const onSubmit = async (data: Transfer) => {
    console.log('DATA CASH', data);
    const money = convertStringNumber(data.money);
    if (!(money > parseInt(props.route.params))) {
      if (money > 10000000) {
        setErroWarning('Không nhập số tiền lớn hơn 10.000.000đ!');
        setErrorDisplay(true);
      } else if (money >= 1000) {
        setLoading(true);
        try {
          const phone = data.phone;
          const own_phone = userProfile;
          console.log('Phone: ', phone);
          console.log('own_phone: ', own_phone);

          data.name = profile;
          data.current_user = userProfile;
          data.current_wallet = props.route.params;
          const result = await axiosClient.post('/check-phone', {
            phone,
            own_phone,
          });
          console.log('Status code: ', result?.data?.status_code);
          if (result?.data?.status_code == 422) {
            navigation.navigate('ConfirmPM', {
              data,
              payment_type: payment_type,
            });
          } else if (result?.data?.status_code == 200) {
            setErroWarning('Số điện thoại không tồn tại');
            setErrorDisplay(true);
          } else if (result?.data?.status_code == 430) {
            setErroWarning('Số điện thoại này bạn đang sử dụng');
            setErrorDisplay(true);
          }
        } catch (e: any) {
          setErroWarning(e?.data?.message);
        }
      } else {
        setErroWarning('Không nhập số tiền nhỏ hơn 1.000đ!');
        setErrorDisplay(true);
      }
    } else {
      setErroWarning('Số dư trong ví không đủ. Vui lòng nạp!');
      setErrorDisplay(true);
    }
    setLoading(false);
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
              render={({field: {onChange, onBlur, value}}) => {
                const fetchData = async () => {
                  try {
                    const result = await axiosClient.post(
                      'https://zennoshop.cf/api/user/check-phone',
                      {
                        phone: value,
                      },
                    );
                    console.log(
                      'result?.data?.user?.phone == profile',
                      result?.data?.user?.phone === profile,
                    );
                    if (result.data.status_code == 200) {
                      Toast.show({
                        type: 'error',
                        text1: 'Lỗi',
                        text2: 'Số điện thoại chưa được đăng ký',
                      });
                    } else if (result?.data?.user?.phone == userProfile) {
                      Toast.show({
                        type: 'error',
                        text1: 'Lỗi',
                        text2: 'Số điện thoại này bạn đang sử dụng',
                      });
                    }
                    setErrorPhone('');
                    setProfile(result?.data?.user?.f_name);
                  } catch (e) {
                    console.log(e);
                  }
                };

                if (/(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(value)) {
                  fetchData();
                  console.log(123);
                }
                return (
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
                    {errorPhone && (
                      <UText style={{color: 'red', fontSize: 12}}>
                        {errorPhone}
                      </UText>
                    )}
                    <FormControl.ErrorMessage
                      style={{position: 'absolute', bottom: 0}}>
                      {errors.phone?.message}
                    </FormControl.ErrorMessage>
                  </FormControl>
                );
              }}
              name="phone"
            />

            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <FormControl isInvalid={errors.name !== undefined}>
                  {console.log(value)}
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
                    placeholder="Nhập họ và tên"
                    backgroundColor="white"
                    value={profile}
                    isDisabled={true}
                    style={{
                      fontFamily: 'Poppins-Regular',
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#FF0000',
                    }}
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
              rules={{required: 'Chưa nhập số tiền'}}
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
                    onChangeText={newValue => {
                      let number = newValue.replace(/\./g, ''); // Remove all dots from the string
                      onChange(number);
                    }}
                    keyboardType="number-pad"
                    backgroundColor="white"
                    onBlur={onBlur}
                    value={formatCurrency(escapeCurrency(value))}
                    style={{fontFamily: 'Poppins-Regular', fontSize: 14}}
                  />

                  {parseInt(props.route.params) - parseInt(value) < 0 && (
                    <UText
                      style={{
                        color: 'red',
                        fontSize: 12,
                      }}>
                      Số dư ví không đủ
                    </UText>
                  )}
                  {/* {parseInt(value) < 3000 && (
                    <UText
                      style={{
                        color: 'red',
                        fontSize: 12,
                      }}>
                      Số tiền cần chuyển tối thiểu 3.000đ
                    </UText>
                  )} */}
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
                    {formatCurrency(value)}
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
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.text}>Chuyển tiền</Text>
              )}
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
