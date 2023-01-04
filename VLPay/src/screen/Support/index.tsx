import {StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import HeaderBack from '../../components/HeaderBack';
import {
  Center,
  FormControl,
  Heading,
  HStack,
  Input,
  ScrollView,
  Text,
  VStack,
  View,
  TextArea,
} from 'native-base';
import {Controller, useForm} from 'react-hook-form';
import {axiosClient} from '../../components/apis/axiosClient';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {isValidEmail} from '../../components/helpers/validator';
import {MainStackNavigation} from '../../stack/Navigation';
import WarningIcon from '../../assets/svg/warning-red.svg';

interface CreateShop {
  email: string;
  mssv: string;
  reason: string;
}

const Index = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<CreateShop>({
    defaultValues: {
      email: '',
      mssv: '',
      reason: '',
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    // navigation.navigate('WaitApprove');
    setApprove(approve == false);
  };

  const navigation = useNavigation<MainStackNavigation>();
  const [profile, setProfile] = useState({});
  const [approve, setApprove] = useState(true);
  const isFocused = useIsFocused();

  const fetchData = useCallback(async () => {
    const result = await axiosClient
      .get('https://zennoshop.cf/api/user/get-profile')
      .then(response => {
        setProfile(response.data);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      fetchData();
    }
  }, [fetchData, isFocused]);

  console.log(approve);

  return (
    <View flex={1} backgroundColor={'white'}>
      <HeaderBack title="Đăng ký xin hỗ trợ" />
      {approve ? (
        <ScrollView>
          <VStack mx={3}>
            <Center mt={10}>
              <Heading size={'md'}>Đăng kí xin hỗ trợ qua ví tín dụng</Heading>
              <HStack my={10}>
                <FormControl.Label
                  _text={{
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  Họ và tên:
                </FormControl.Label>
                <TextInput
                  value={profile.data?.f_name}
                  editable={false}
                  selectTextOnFocus={false}
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: 16,
                    borderBottomWidth: 1,
                    padding: 0,
                    paddingLeft: 20,
                    marginLeft: 10,
                    flex: 1,
                    fontWeight: 'bold',
                  }}
                />
              </HStack>
              <HStack mb={10}>
                <FormControl.Label
                  _text={{
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  Số điện thoại:
                </FormControl.Label>
                <TextInput
                  value={profile.data?.phone}
                  editable={false}
                  selectTextOnFocus={false}
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: 16,
                    borderBottomWidth: 1,
                    padding: 0,
                    paddingLeft: 20,
                    marginLeft: 10,
                    flex: 1,
                    fontWeight: 'bold',
                  }}
                />
              </HStack>

              <Controller
                control={control}
                rules={{
                  required: 'Email không được để trống',
                  validate: str => {
                    if (str.length === 0) {
                      return true;
                    }
                    if (!isValidEmail(str.replace(/\s/g, ''))) {
                      return 'Email không đúng định dạng';
                    }
                    return true;
                  },
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <FormControl isInvalid={errors.email !== undefined} mb={10}>
                    <HStack>
                      <FormControl.Label
                        _text={{
                          color: '#000',
                          fontWeight: 'bold',
                          fontSize: 16,
                        }}>
                        Email:
                      </FormControl.Label>
                      <TextInput
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType="email-address"
                        placeholder="Vui lòng nhập email"
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontSize: 14,
                          borderBottomWidth: 1,
                          padding: 0,
                          paddingLeft: 10,
                          marginLeft: 10,
                          flex: 1,
                        }}
                      />
                    </HStack>
                    <FormControl.ErrorMessage>
                      {errors.email?.message}
                    </FormControl.ErrorMessage>
                  </FormControl>
                )}
                name="email"
              />

              <Controller
                control={control}
                rules={{
                  required: 'MSSV không được để trống',
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <FormControl isInvalid={errors.mssv !== undefined} mb={10}>
                    <HStack>
                      <FormControl.Label
                        _text={{
                          color: '#000',
                          fontWeight: 'bold',
                          fontSize: 16,
                        }}>
                        MSSV:
                      </FormControl.Label>
                      <TextInput
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType="email-address"
                        placeholder="Vui lòng nhập MSSV"
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontSize: 14,
                          borderBottomWidth: 1,
                          padding: 0,
                          paddingLeft: 10,
                          marginLeft: 10,
                          flex: 1,
                        }}
                      />
                    </HStack>
                    <FormControl.ErrorMessage>
                      {errors.mssv?.message}
                    </FormControl.ErrorMessage>
                  </FormControl>
                )}
                name="mssv"
              />

              <Controller
                control={control}
                rules={{
                  required: 'Lí do không được để trống',
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <FormControl isInvalid={errors.reason !== undefined} mb={10}>
                    <FormControl.Label
                      _text={{
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}>
                      Vị trí:
                    </FormControl.Label>
                    {/* <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      placeholder="Vui lòng nhập lí do"
                      style={{
                        fontFamily: 'Poppins-Regular',
                        fontSize: 14,
                        borderBottomWidth: 1,
                        padding: 0,
                        paddingLeft: 10,
                        marginLeft: 10,
                        flex: 1,
                      }}
                    /> */}
                    <TextArea
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      placeholder="Vui lòng nhập lí do"
                      style={{
                        fontFamily: 'Poppins-Regular',
                        fontSize: 14,
                        padding: 0,
                        paddingLeft: 10,
                        marginLeft: 10,
                        flex: 1,
                      }}
                      autoCompleteType={undefined}
                    />

                    <FormControl.ErrorMessage>
                      {errors.reason?.message}
                    </FormControl.ErrorMessage>
                  </FormControl>
                )}
                name="reason"
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit(onSubmit)}>
                <Text style={styles.text}>Gửi yêu cầu</Text>
              </TouchableOpacity>
            </Center>
          </VStack>
        </ScrollView>
      ) : (
        <Center flex={1}>
          <HStack>
            <WarningIcon />
            <VStack mx={3}>
              <Text fontWeight="bold" color={'#E74C3C'}>
                Yêu cầu của bạn đã được gửi.
              </Text>
              <Text fontWeight="bold" color={'#E74C3C'}>
                Vui lòng đợi xét duyệt. Sau khi
              </Text>
              <Text fontWeight="bold" color={'#E74C3C'}>
                được xét duyệt bạn sẽ nhận
              </Text>
              <Text fontWeight="bold" color={'#E74C3C'}>
                được thông báo qua App hoặc
              </Text>
              <Text fontWeight="bold" color={'#E74C3C'}>
                bằng Email. Bạn chú ý đến{' '}
              </Text>
              <Text fontWeight="bold" color={'#E74C3C'}>
                thông báo ở App và email nhé.
              </Text>
            </VStack>
          </HStack>
        </Center>
      )}
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#B5EAD8',
    padding: 15,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  text: {
    fontFamily: 'Poppins-ExtraBold',
    color: '#514545',
  },
});
