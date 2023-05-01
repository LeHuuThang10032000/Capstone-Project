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
import {Alert, BackHandler, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../../stack/Navigation';
import {axiosClient} from '../../../components/apis/axiosClient';
import RNRestart from 'react-native-restart';

interface Image {
  path: string;
}

const FinalShareBillDetail = ({route}: any) => {
  const {data} = route.params;
  console.log(data);

  const [text, onChangeText] = useState('');
  const [image, setImage] = useState<Image>();
  const [masterDataSource, setMasterDataSource] = useState([]);
  const navigation = useNavigation<MainStackNavigation>();
  const [profile, setProfile] = useState([]);

  const fetchData = async () => {
    try {
      const responseJson = await axiosClient.get('/friends');
      const friends = responseJson?.data?.data.filter(item => {
        if (data?.checkedItems.includes(item?.id)) {
          return item;
        }
      });
      const result = await axiosClient.get(
        'https://zennoshop.cf/api/user/get-profile',
      );
      setProfile(result?.data?.data);

      setMasterDataSource(friends);
    } catch (error) {
      Alert.alert(error.error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ChoosePhotoFromLibrary = async () => {
    const image = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    });
    setImage(image);
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Thông báo!', 'Bạn sẽ thoát ra trang chủ', [
        {
          text: 'Huỷ',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'Đồng ý',
          onPress: () => RNRestart.Restart(),
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View flex={1} backgroundColor="#ffffff">
      <HeaderBack
        title="Chia tiền"
        hideLeft={!data?.isFinal ? false : true}
        style={data?.isFinal ? {justifyContent: 'center'} : {}}
      />
      <ScrollView flex={1}>
        <Center padding={5}>
          <HStack w="100%" justifyContent="flex-start" paddingBottom={20}>
            <VStack>
              <Heading>Thông tin đơn hàng.</Heading>
              <Text textDecorationLine="underline" color="#4285F4">
                Bấm vào đây để xem chi tiết
              </Text>
            </VStack>
          </HStack>
          <HStack w="100%" justifyContent="space-between">
            <Text fontSize={16} fontWeight="bold">
              Danh sách chia tiền({masterDataSource?.length + 1 ?? 0})
            </Text>
          </HStack>
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
                source={{uri: profile?.image}}
                w={42}
                height={42}
                alt="image"
                borderRadius={50}
              />
              <Text paddingLeft={3} fontWeight={'700'}>
                {profile.f_name} (Tôi)
              </Text>
            </HStack>
            <VStack>
              <Text>
                {(
                  parseInt(data?.amount) /
                  (masterDataSource?.length + 1)
                ).toLocaleString()}
                đ
              </Text>
            </VStack>
          </HStack>
          {masterDataSource.map(item => {
            return (
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
                    source={{uri: item?.picture}}
                    w={42}
                    height={42}
                    alt="image"
                    borderRadius={50}
                  />
                  <Text paddingLeft={3}>{item.f_name}</Text>
                </HStack>
                <VStack>
                  <Text>
                    {(
                      parseInt(data?.amount) /
                      (masterDataSource?.length + 1)
                    ).toLocaleString()}
                    đ
                  </Text>
                </VStack>
              </HStack>
            );
          })}
        </Center>
      </ScrollView>
      <View padding={5}>
        <TouchableOpacity
          onPress={async () => {
            navigation.navigate('Home');
            data.masterDataSource = masterDataSource;
            navigation.navigate('Home');
          }}>
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

export default FinalShareBillDetail;
