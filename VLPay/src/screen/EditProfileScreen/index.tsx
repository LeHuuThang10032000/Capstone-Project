import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import HeaderBack from '../../components/HeaderBack';
import ImagePicker from 'react-native-image-crop-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  Box,
  Center,
  FormControl,
  Image,
  Input,
  Pressable,
  VStack,
} from 'native-base';
import CameraIcon from '../../assets/svg/camera.svg';
import styles from './styles';
import {useForm, Controller} from 'react-hook-form';
import {validateName, validatePhone} from '../../components/helpers/validator';
import {axiosClient} from '../../components/apis/axiosClient';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';
import TText from '../Transfer/TText';
import {default_image} from '../../components/apis/api';

interface Profile {
  name: string;
}

const options: any = {
  title: 'Select Image',
  type: 'library',
  options: {
    selectionLimit: 1,
    mediaType: 'photo',
    includeBase64: true,
  },
};

const Index = ({route}: any) => {
  const [image, setImage] = useState({});
  const [profile, setProfile] = useState({});
  const isFocused = useIsFocused();
  const [isLoading, setLoading] = useState(false);
  const {name, phone} = route.params;

  const fetchData = useCallback(async () => {
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/get-profile',
    );
    setProfile(result);
  }, []);

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      fetchData();
    }
  }, [fetchData, isFocused]);
  const navigation = useNavigation<MainStackNavigation>();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<Profile>({
    defaultValues: {
      name: name,
    },
  });
  const onSubmit = async (data: any) => {
    const formData = new FormData();
    setLoading(true);
    formData.append(
      'full_name',
      data.name ? data.name : profile?.data?.data.f_name,
    );
    if (image?.path) {
      let fileName = image?.path.split('/');
      fileName = fileName[fileName.length - 1];
      const filename = `${new Date().getTime()}-${fileName}`;
      const file = {
        uri: image.path,
        name: filename,
        type: 'image/png',
      };
      formData.append('image', file);
    }
    try {
      await axiosClient.post(
        'https://zennoshop.cf/api/user/updateProfile',
        formData,
        {
          headers: {'content-type': 'multipart/form-data'},
        },
      );
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const ChoosePhotoFromLibrary = async () => {
    const image = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    });
    setImage(image);
  };

  // const openGallery = async () => {
  //   launchImageLibrary(options, response => {
  //     console.log(response);
  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.errorMessage) {
  //       console.log('Error');
  //     } else {
  //       const source = {uri: response.uri};
  //     }
  //   });
  // };

  return (
    <View>
      <HeaderBack title="Hồ sơ của bạn" />
      <Pressable onPress={ChoosePhotoFromLibrary}>
        <Center style={{paddingVertical: 40}}>
          <Image
            source={
              image?.path
                ? {uri: image?.path}
                : profile?.data?.data?.media[0]?.original_url
                ? {
                    uri: profile.data.data.media[0].original_url,
                  }
                : require('../../assets/img/user_default.png')
            }
            alt="img"
            borderRadius={100}
            width={150}
            height={150}
            opacity={0.5}
          />
          <Box
            width={6}
            height={6}
            position="absolute"
            alignItems="center"
            justifyContent="center"
            borderRadius={20}
            padding={1}
            shadow={9}>
            <CameraIcon />
          </Box>
        </Center>
      </Pressable>
      <Center>
        <VStack space={3}>
          <Controller
            control={control}
            rules={{
              required: 'Không được để trống Họ và tên',
              validate: validateName,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <FormControl isInvalid={errors.name !== undefined}>
                <FormControl.Label
                  _text={{color: '#312E49', fontWeight: 'bold', fontSize: 16}}>
                  Họ và tên
                </FormControl.Label>
                <Input
                  w="90%"
                  placeholder="Nhập họ và tên của bạn"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  style={{fontFamily: 'Poppins-Regular', fontSize: 14}}
                  maxLength={50}
                />
                <FormControl.ErrorMessage>
                  {errors.name?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            )}
            name="name"
          />

          <FormControl isDisabled>
            <FormControl.Label
              _disabled={{
                _text: {
                  color: '#312E49',
                  fontWeight: 'bold',
                  fontSize: 16,
                },
              }}>
              Số điện thoại
            </FormControl.Label>
            <Input
              w="90%"
              value={phone}
              style={{fontFamily: 'Poppins-Regular', fontSize: 14}}
            />
          </FormControl>

          <TouchableOpacity
            style={styles.button}
            disabled={isLoading}
            onPress={handleSubmit(onSubmit)}>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.text}>Lưu chỉnh sửa</Text>
            )}
          </TouchableOpacity>
        </VStack>
      </Center>
    </View>
  );
};

export default Index;
