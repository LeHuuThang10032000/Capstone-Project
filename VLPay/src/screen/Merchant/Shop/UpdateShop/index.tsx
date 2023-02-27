import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import HeaderBack from '../../../../components/HeaderBack';
import ImagePicker from 'react-native-image-crop-picker';
import {useForm} from 'react-hook-form';
import {View, Text, Image, Divider} from 'native-base';
import {axiosClient} from '../../../../components/apis/axiosClient';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../../../stack/Navigation';

type Props = {};

const UpdateShop = ({route}: any) => {
  const navigation = useNavigation<MainStackNavigation>();

  const [image1, setImage1] = useState({});
  const [image2, setImage2] = useState({});
  const [isLoading, setLoading] = useState(false);
  const {store_id, image, cover_photo} = route.params;

  console.log('MyStoreId', store_id);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({});

  const onSubmit = async () => {
    const formData = new FormData();
    setLoading(true);
    formData.append('store_id', store_id);
    // formData.append('image', {
    //   uri: image.path,
    //   type: image.mime,
    //   name: image.filename || 'my_image.jpg',
    // });
    // formData.append('cover_photo', null);
    if (image1?.path) {
      let fileName = image1?.path.split('/');
      fileName = fileName[fileName.length - 1];
      const filename = `${new Date().getTime()}-${fileName}`;
      const file = {
        uri: image1.path,
        name: filename,
        type: 'image/png',
      };
      formData.append('image', file);
    }
    if (image2?.path) {
      let fileName = image2?.path.split('/');
      fileName = fileName[fileName.length - 1];
      const filename = `${new Date().getTime()}-${fileName}`;
      const file = {
        uri: image2.path,
        name: filename,
        type: 'image/png',
      };
      formData.append('cover_photo', file);
    }

    try {
      await axiosClient.post(
        'https://zennoshop.cf/api/user/merchant/store/update',
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

  const ChoosePhotoFromLibrary1 = async () => {
    const image = await ImagePicker.openPicker({
      width: 500,
      height: 300,
      cropping: true,
    });
    setImage1(image);
  };

  const ChoosePhotoFromLibrary2 = async () => {
    const image = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    });
    setImage2(image);
  };

  return (
    <View>
      <HeaderBack title="Chỉnh sửa thông tin" />
      <View p={3}>
        <Text style={styles.textTitle}>Ảnh bìa</Text>
        <Text style={styles.text}>
          Ảnh sẽ hiển thị trên đầu trang của quán bạn
        </Text>
        <View>
          <Image
            source={
              image1?.path
                ? {uri: image1?.path}
                : {
                    uri: image,
                  }
            }
            width={'100%'}
            height={200}
            alt="food"
            borderRadius={10}
          />

          <TouchableOpacity onPress={ChoosePhotoFromLibrary1}>
            <Text style={[styles.text, {color: '#4285F4', paddingVertical: 5}]}>
              Đổi ảnh
            </Text>
          </TouchableOpacity>
        </View>
        <Divider my={3} backgroundColor="#333333" />
        <Text style={styles.textTitle}>Ảnh bìa</Text>
        <Text style={styles.text}>Ảnh sẽ hiển thị cùng doanh nghiệp khác</Text>
        <View py={5}>
          <Image
            source={
              image2?.path
                ? {uri: image2?.path}
                : {
                    uri: cover_photo,
                  }
            }
            width={100}
            height={100}
            alt="food"
            borderRadius={10}
          />
          <TouchableOpacity onPress={ChoosePhotoFromLibrary2}>
            <Text style={[styles.text, {color: '#4285F4', paddingVertical: 5}]}>
              Đổi ảnh
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          disabled={isLoading}
          onPress={handleSubmit(onSubmit)}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.textTitle}>Lưu chỉnh sửa</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UpdateShop;

const styles = StyleSheet.create({
  textTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#312E49',
  },
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#7A7A7A',
  },
  button: {
    backgroundColor: '#B5EAD8',
    padding: 15,
    marginTop: 50,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
