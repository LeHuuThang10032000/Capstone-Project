import React, {useEffect, useState} from 'react';
import HeaderBack from '../../../components/HeaderBack';
import {
  Center,
  Heading,
  HStack,
  Image,
  ScrollView,
  Text,
  TextArea,
  View,
  VStack,
} from 'native-base';
import MessageIcon from '../../../assets/svg/message.svg';
import CloseIcon from '../../../assets/svg/close.svg';
import ImagePicker from 'react-native-image-crop-picker';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../../stack/Navigation';

interface Image {
  path: string;
}

const DetailBill = () => {
  const [text, onChangeText] = useState('');
  const [image, setImage] = useState<Image>();
  const [masterDataSource, setMasterDataSource] = useState([]);
  const navigation = useNavigation<MainStackNavigation>();

  console.log(masterDataSource);

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=3')
      .then(response => response.json())
      .then(responseJson => {
        setMasterDataSource(responseJson.results);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const ChoosePhotoFromLibrary = async () => {
    const image = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    });
    setImage(image);
  };

  return (
    <View flex={1} backgroundColor="#ffffff">
      <HeaderBack title="Chia tiền" />
      <ScrollView flex={1}>
        <Center padding={5}>
          <View borderBottomWidth={1}>
            <Heading>300.000đ</Heading>
          </View>
          <TextArea
            value={text}
            // onBlur={onBlur}
            w="100%"
            onChangeText={onChangeText}
            keyboardType="email-address"
            placeholder="Nhập nội dung"
            marginTop={5}
            marginX={3}
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 14,
              padding: 0,
              flex: 1,
            }}
            autoCompleteType={undefined}
            rightElement={
              <MessageIcon style={{marginRight: 3, marginBottom: 40}} />
            }
          />
          <Heading paddingTop={5} size="sm">
            Hình ảnh đính kèm
          </Heading>
          <TouchableOpacity onPress={ChoosePhotoFromLibrary}>
            <Image
              source={
                image?.path
                  ? {uri: image?.path}
                  : require('../../../assets/img/user_default.png')
              }
              width={150}
              height={150}
              alt="bill"
              marginY={3}
            />
          </TouchableOpacity>
          <HStack w="100%" justifyContent="space-between">
            <Text fontSize={16} fontWeight="bold">
              Danh sách chia tiền(3)
            </Text>
            <Text fontSize={16} fontWeight="bold" color="#FF0000">
              Thêm người
            </Text>
          </HStack>
          {masterDataSource.map(item => (
            <HStack
              w="100%"
              alignItems="center"
              justifyContent="space-between"
              borderWidth={1}
              padding={3}
              borderRadius={8}
              marginY={3}>
              <HStack alignItems="center">
                <Image
                  source={{uri: item.picture?.large}}
                  w={42}
                  height={42}
                  alt="image"
                  borderRadius={50}
                />
                <Text paddingLeft={3}>
                  {item.name.title} {item.name.first} {item.name.last}
                </Text>
              </HStack>
              <VStack>
                <View position="absolute" top={-15} right={0}>
                  <CloseIcon width={15} height={15} />
                </View>
                <Text>100.000đ</Text>
              </VStack>
            </HStack>
          ))}
        </Center>
      </ScrollView>
      <View padding={5}>
        <TouchableOpacity
          onPress={() => navigation.navigate('SendRequestShare')}>
          <Center backgroundColor="#B5EAD8" padding={5} borderRadius={10}>
            <Text fontSize={16} fontWeight="bold">
              Chia tiền
            </Text>
          </Center>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DetailBill;
