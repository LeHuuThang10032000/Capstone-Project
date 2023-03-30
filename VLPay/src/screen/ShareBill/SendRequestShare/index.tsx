import {useNavigation} from '@react-navigation/native';
import {
  Center,
  Heading,
  HStack,
  Image,
  ScrollView,
  Text,
  View,
  VStack,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import HeaderBack from '../../../components/HeaderBack';
import {MainStackNavigation} from '../../../stack/Navigation';
import Speaker from '../../../assets/svg/speaker.svg';

type Props = {};

const SendRequestShare = (props: Props) => {
  const [masterDataSource, setMasterDataSource] = useState([]);
  const navigation = useNavigation<MainStackNavigation>();

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
  return (
    <View flex={1} backgroundColor="#ffffff">
      <HeaderBack title="Chi tiết" />
      <ScrollView flex={1}>
        <Center padding={5}>
          <HStack w="100%" justifyContent="flex-start">
            <VStack>
              <Heading>Thông tin đơn hàng.</Heading>
              <Text textDecorationLine="underline" color="#4285F4">
                Bấm vào đây để xem chi tiết
              </Text>
            </VStack>
          </HStack>

          <Center>
            <HStack
              marginY={5}
              borderRadius={8}
              w="100%"
              backgroundColor="#B5EAD8"
              padding={3}>
              <Speaker />
              <Text w={300} paddingLeft={3}>
                VL Pay sẽ tự động gửi lời nhắc đến những ai chưa trả sau 1 ngày
                kể từ lúc yêu cầu được gửi. Trong trường hợp họ vẫn quên, VLPay
                sẽ báo bạn nha.
              </Text>
            </HStack>
          </Center>

          <HStack w="100%" justifyContent="space-between">
            <Text fontSize={16} fontWeight="bold">
              Danh sách chia tiền(3)
            </Text>
            {/* <Text fontSize={16} fontWeight="bold" color="#FF0000">
              Thêm người
            </Text> */}
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
                <Text>100.000đ</Text>
              </VStack>
            </HStack>
          ))}
        </Center>
      </ScrollView>
      <View padding={5}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Center backgroundColor="#B5EAD8" padding={5} borderRadius={10}>
            <Text fontSize={16} fontWeight="bold">
              Nhắc nhở
            </Text>
          </Center>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SendRequestShare;
