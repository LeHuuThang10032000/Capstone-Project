import {StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
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

interface Profile {
  name: string;
  phone: string;
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

const Index = () => {
  const [name, setName] = useState('Lâm Thái Bảo Nguyên');
  const [phone, setPhone] = useState('0123456789');
  const [image, setImage] = useState(
    'https://randomuser.me/api/portraits/men/62.jpg',
  );

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<Profile>();
  const onSubmit = (data: any) => console.log(data);

  const ChoosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
      setImage(image.path);
    });
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
      <HeaderBack title="Your profile" />
      <Pressable onPress={ChoosePhotoFromLibrary}>
        <Center style={{paddingVertical: 40}}>
          <Image
            source={{uri: image}}
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
            rules={{required: 'không được để trống', validate: validateName}}
            render={({field: {onChange, onBlur, value}}) => (
              <FormControl isInvalid={errors.name !== undefined}>
                <FormControl.Label
                  _text={{color: '#312E49', fontWeight: 'bold', fontSize: 16}}>
                  Full name
                </FormControl.Label>
                <Input
                  w="90%"
                  onChangeText={onChange}
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

          <FormControl isDisabled>
            <FormControl.Label
              _disabled={{
                _text: {
                  color: '#312E49',
                  fontWeight: 'bold',
                  fontSize: 16,
                },
              }}>
              Phone number
            </FormControl.Label>
            <Input
              w="90%"
              value="0123456789"
              style={{fontFamily: 'Poppins-Regular', fontSize: 14}}
            />
          </FormControl>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}>
            <Text style={styles.text}>Save edit</Text>
          </TouchableOpacity>
        </VStack>
      </Center>
    </View>
  );
};

export default Index;
