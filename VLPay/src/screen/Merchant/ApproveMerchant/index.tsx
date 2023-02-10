import {StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import HeaderBack from '../../../components/HeaderBack';
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
  Image,
} from 'native-base';
import {Controller, useForm} from 'react-hook-form';
import {axiosClient} from '../../../components/apis/axiosClient';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {isValidEmail} from '../../../components/helpers/validator';
import {MainStackNavigation} from '../../../stack/Navigation';
import WarningIcon from '../../../assets/svg/warning-red.svg';
import ImagePicker from 'react-native-image-crop-picker';
import {UText} from '../../../components/UText';

interface CreateShop {
  email: string;
  name: string;
  location: string;
  products: string;
}

const Index = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<CreateShop>({
    defaultValues: {
      email: '',
      name: '',
      location: '',
      products: '',
    },
  });

  const ChoosePhotoFromLibrary = async () => {
    const image = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    });
    setImage(image);
  };
  const onSubmit = async (data: any) => {
    console.log(data);
    const {email, location, name, products} = data;
    const formData = new FormData();
    formData.append('email', email);
    formData.append('location', location);
    formData.append('name', name);
    formData.append('selling_products', products);
    formData.append('user_id', profile?.data?.id);
    formData.append('phone', profile?.data?.phone);
    let fileName = image?.path.split('/');
    fileName = fileName[fileName.length - 1];
    const filename = `${new Date().getTime()}-${fileName}`;
    const file = {
      uri: image.path,
      name: filename,
      type: 'image/png',
    };
    formData.append('image', file);
    try {
      await axiosClient.post(
        'https://zennoshop.cf/api/user/create-store',
        formData,
        {
          headers: {'content-type': 'multipart/form-data'},
        },
      );
      setApprove(false);
    } catch (e) {
      console.log('====================================');
      console.log(e);
      console.log('====================================');
    }
  };

  const navigation = useNavigation<MainStackNavigation>();
  const [profile, setProfile] = useState({});
  const [approve, setApprove] = useState(true);
  const isFocused = useIsFocused();
  const [image, setImage] = useState({});

  console.log(profile);

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
      <HeaderBack title="Tạo Shop" />
      {approve ? (
        <ScrollView>
          <VStack mx={3}>
            <Center mt={10}>
              <Heading size={'md'}>Đăng ký mở shop trên VLPay</Heading>
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
                    fontSize: 14,
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
                    fontSize: 14,
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
                  required: 'Tên quán không được để trống',
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <FormControl isInvalid={errors.name !== undefined} mb={10}>
                    <HStack>
                      <FormControl.Label
                        _text={{
                          color: '#000',
                          fontWeight: 'bold',
                          fontSize: 16,
                        }}>
                        Tên quán:
                      </FormControl.Label>
                      <TextInput
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType="email-address"
                        placeholder="Vui lòng nhập tên quán"
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
                      {errors.name?.message}
                    </FormControl.ErrorMessage>
                  </FormControl>
                )}
                name="name"
              />

              <Controller
                control={control}
                rules={{
                  required: 'Vị trí quán không được để trống',
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <FormControl
                    isInvalid={errors.location !== undefined}
                    mb={10}>
                    <HStack>
                      <FormControl.Label
                        _text={{
                          color: '#000',
                          fontWeight: 'bold',
                          fontSize: 16,
                        }}>
                        Vị trí:
                      </FormControl.Label>
                      <TextInput
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType="email-address"
                        placeholder="Vui lòng nhập vị trí quán"
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
                      {errors.location?.message}
                    </FormControl.ErrorMessage>
                  </FormControl>
                )}
                name="location"
              />

              <Controller
                control={control}
                rules={{
                  required: 'Sản phẩm kinh doanh không được để trống',
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <FormControl
                    isInvalid={errors.products !== undefined}
                    mb={10}>
                    <HStack>
                      <FormControl.Label
                        _text={{
                          color: '#000',
                          fontWeight: 'bold',
                          fontSize: 16,
                        }}>
                        Sản phẩm kinh doanh:
                      </FormControl.Label>
                      <TextInput
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType="email-address"
                        placeholder="Nhập sản phẩm KD"
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
                      {errors.products?.message}
                    </FormControl.ErrorMessage>
                  </FormControl>
                )}
                name="products"
              />
              <View style={{width: '100%', marginBottom: 10}}>
                <UText style={{fontWeight: '700'}}>Hình ảnh shop: </UText>
              </View>
              <TouchableOpacity onPress={ChoosePhotoFromLibrary}>
                <Image
                  source={
                    image?.path
                      ? {uri: image?.path}
                      : require('../../../assets/img/user_default.png')
                  }
                  alt="img"
                  width={150}
                  height={150}
                  marginBottom={10}
                />
              </TouchableOpacity>

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
