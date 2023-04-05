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
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, TouchableOpacity, useWindowDimensions} from 'react-native';
import HeaderBack from '../../../components/HeaderBack';
import {MainStackNavigation} from '../../../stack/Navigation';
import {axiosClient} from '../../../components/apis/axiosClient';

type Props = {};

const NotiShareBill = (props: Props) => {
  const [masterDataSource, setMasterDataSource] = useState([]);
  const navigation = useNavigation<MainStackNavigation>();
  const {width} = useWindowDimensions();
  const [profile, setProfile] = useState([]);

  console.log(masterDataSource);

  const getDays = useCallback(async () => {
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/history-transaction?filter_key=days',
    );
    console.log(result.data?.data);

    // setHistory(result.data?.data?.data);
    // setLoading(false);
  }, []);

  const fetchData = async () => {
    try {
      const responseJson = await axiosClient.get('/friends');
      const result = await axiosClient.get(
        'https://zennoshop.cf/api/user/get-profile',
      );
      setProfile(result?.data?.data);
      setMasterDataSource(responseJson?.data?.data);
    } catch (error) {
      Alert.alert(error.error);
    }
  };

  useEffect(() => {
    fetchData();
    getDays();
  }, []);
  return (
    <View flex={1} backgroundColor="#ffffff">
      <HeaderBack title="Chia tiền" />
      <ScrollView flex={1}>
        <Center padding={5}>
          <HStack w="100%" justifyContent="flex-start" paddingBottom={5}>
            <VStack>
              <Heading>Thông tin đơn hàng.</Heading>
              <Text textDecorationLine="underline" color="#4285F4">
                Bấm vào đây để xem chi tiết
              </Text>
            </VStack>
          </HStack>

          <HStack w="100%" justifyContent="space-between">
            <Text fontSize={16} fontWeight="bold">
              Danh sách chia tiền(3)
            </Text>
            <Text></Text>
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
              <Text paddingLeft={3}>{profile?.f_name}</Text>
            </HStack>
            <VStack>
              <Text>100.000đ</Text>
            </VStack>
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
                  source={{uri: item?.image}}
                  w={42}
                  height={42}
                  alt="image"
                  borderRadius={50}
                />
                <Text paddingLeft={3}>{item?.f_name}</Text>
              </HStack>
              <VStack>
                <Text>100.000đ</Text>
              </VStack>
            </HStack>
          ))}
        </Center>
      </ScrollView>
      <HStack
        padding={5}
        w={width}
        backgroundColor="yellow"
        justifyContent="space-between">
        <TouchableOpacity>
          <Center
            w={160}
            backgroundColor="#ffffff"
            borderWidth={1}
            padding={5}
            borderRadius={10}>
            <Text fontSize={16} fontWeight="bold">
              Trả rồi nha
            </Text>
          </Center>
        </TouchableOpacity>

        <TouchableOpacity>
          <Center
            w={160}
            backgroundColor="#B5EAD8"
            borderWidth={1}
            padding={5}
            borderRadius={10}>
            <Text fontSize={16} fontWeight="bold">
              Chuyển tiền
            </Text>
          </Center>
        </TouchableOpacity>
      </HStack>
    </View>
  );
};

export default NotiShareBill;
