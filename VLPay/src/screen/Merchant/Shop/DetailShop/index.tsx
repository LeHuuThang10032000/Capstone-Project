import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import HeaderBack from '../../../../components/HeaderBack';
import {axiosClient} from '../../../../components/apis/axiosClient';
import {
  Center,
  HStack,
  Image,
  Pressable,
  Skeleton,
  View,
  VStack,
} from 'native-base';
import Clock from '../../../../assets/svg/clock.svg';
import ExtendIcon from '../../../../assets/svg/extend.svg';
import Phone from '../../../../assets/svg/phone.svg';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../../../stack/Navigation';

type Props = {
  id: string;
  name: string;
  image: string;
  cover_photo: string;
  phone: string;
  email: string;
};

const DetailShop = ({route}: any, props: Props) => {
  const navigation = useNavigation<MainStackNavigation>();
  const isFocused = useIsFocused();
  const [data, setData] = useState(props);
  const [isLoading, setIsLoading] = useState(false);

  const getStore = useCallback(async () => {
    setIsLoading(true);
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/merchant/store',
    );
    setData(result.data?.data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      getStore();
    }
  }, [getStore, isFocused]);

  return (
    <View flex={1} backgroundColor="#FFFFFF">
      <HeaderBack
        title="Thông tin quán"
        onPressRight={true}
        onPress={() =>
          navigation.navigate('UpdateShop', {
            store_id: data.id,
            name: data.name,
            image: data.image,
            cover_photo: data.cover_photo,
          })
        }
      />
      {isLoading ? (
        <Center w="100%">
          <VStack
            w="100%"
            maxW="400"
            space={6}
            rounded="md"
            alignItems="center"
            _dark={{
              borderColor: 'coolGray.500',
            }}
            _light={{
              borderColor: 'coolGray.200',
            }}>
            <Skeleton h="230" />
            <Skeleton
              borderWidth={1}
              borderColor="coolGray.200"
              endColor="warmGray.50"
              size="24"
              rounded="full"
              mt="-70"
            />
          </VStack>
        </Center>
      ) : (
        <>
          <Image
            source={{uri: data.image}}
            width={'100%'}
            height={'30%'}
            alt="image-store"
            resizeMode="cover"
            zIndex="-999"
          />
          <Center>
            {data.cover_photo !== null ? (
              <Image
                source={{uri: data.cover_photo}}
                width={100}
                height={100}
                borderRadius={50}
                alt="image-store"
                resizeMode="cover"
                position={'absolute'}
                borderWidth={1}
                borderColor="amber.400"
              />
            ) : (
              <Image
                source={{uri: 'https://via.placeholder.com/600/56acb2'}}
                width={100}
                height={100}
                borderRadius={50}
                alt="image-store"
                resizeMode="cover"
                position={'absolute'}
                borderWidth={1}
                borderColor="amber.400"
              />
            )}
          </Center>
        </>
      )}
      <Center>
        <View style={{paddingTop: 60}} justifyContent="center">
          <Text style={styles.text}>{data.name}</Text>
        </View>
        {/* <TouchableOpacity style={styles.button}>
          <HStack>
            <Clock />
            <VStack pl={3}>
              <Text style={styles.textButton}>Thời gian hoạt động</Text>
              <Text
                style={[styles.textButton, {color: '#7A7A7A', fontSize: 14}]}>
                Thời gian giao hàng
              </Text>
              <Text>Hàng ngày 7:00 - 22:00</Text>
            </VStack>
          </HStack>
          <Center>
            <ExtendIcon />
          </Center>
        </TouchableOpacity> */}

        <TouchableOpacity style={[styles.button, {paddingTop: 20}]}>
          <HStack>
            <Phone />
            <VStack pl={3}>
              <Text style={styles.textButton}>Liên hệ</Text>
              <Text
                style={[styles.textButton, {color: '#7A7A7A', fontSize: 14}]}>
                {data?.phone}
              </Text>
              <Text>{data?.email}</Text>
            </VStack>
          </HStack>
        </TouchableOpacity>
      </Center>
    </View>
  );
};

export default DetailShop;

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#312E49',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 50,
  },
  imagePromo: {
    width: 32,
    height: 32,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingHorizontal: 25,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  wrapperButton: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  //   text: {
  //     fontFamily: 'Poppins-Regular',
  //     color: '#312E49',
  //     fontSize: 16,
  //     fontWeight: '600',
  //   },
  textButton: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#312E49',
  },
});
