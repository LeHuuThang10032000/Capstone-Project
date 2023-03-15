import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Center,
  Image,
  Text,
  View,
  Pressable,
  HStack,
  VStack,
  Switch,
  Flex,
  Skeleton,
} from 'native-base';
import ExtendIcon from '../../../../assets/svg/extend.svg';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../../../stack/Navigation';
import {axiosClient} from '../../../../components/apis/axiosClient';

type Props = {
  id: string;
  name: string;
  image: string;
  cover_photo: string;
};

const InfoShop = (props: Props) => {
  const navigation = useNavigation<MainStackNavigation>();
  const [data, setData] = useState(props);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  console.log('myDAta:', data);

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
    <View>
      <Center borderRadius={10} borderWidth={1} borderColor="#EFEFF4">
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('DetailShop')}>
          <View style={styles.info}>
            {isLoading ? (
              <Skeleton
                borderWidth={1}
                borderColor="coolGray.200"
                endColor="warmGray.50"
                size="16"
                rounded="full"
              />
            ) : (
              <Image
                source={{uri: data.cover_photo}}
                style={styles.image}
                alt="image-shop"
              />
            )}
            <View style={{paddingLeft: 10}}>
              <>
                <Text style={styles.textButton}>Quản lý thông tin quán</Text>
              </>
            </View>
          </View>
          <View>
            <ExtendIcon />
          </View>
        </Pressable>
        <Center py={2}>
          <Text style={styles.text}>Tổng đơn hàng</Text>
          <Text style={styles.textButton}>0</Text>
        </Center>
      </Center>

      <Center
        mt={5}
        borderRadius={10}
        borderWidth={1}
        borderColor="#EFEFF4"
        backgroundColor={'#C7CEEA4A'}>
        <HStack justifyContent={'space-between'} width="100%" py={3} px={2}>
          <VStack>
            <Text style={styles.textButton}>Tình trạng quán</Text>
            <Text>Tắt để tạm dừng nhận đơn hàng đến</Text>
          </VStack>
          <Switch size={'md'} />
        </HStack>
      </Center>

      <Center
        mt={5}
        borderRadius={10}
        borderWidth={1}
        borderColor="#EFEFF4"
        backgroundColor={'#FEB7B1'}>
        <HStack
          justifyContent={'space-between'}
          alignItems={'center'}
          width="100%"
          py={3}
          px={2}>
          <HStack alignItems={'center'}>
            <Image
              source={require('../../../../assets/img/balance_wallet.png')}
              style={styles.image}
              alt="image-shop"
            />
            <VStack>
              <Text style={[styles.text, {color: '#FFFFFF', fontSize: 14}]}>
                Doanh thu hôm nay
              </Text>
              <Text
                style={[styles.textButton, {color: '#FFFFFF', fontSize: 16}]}>
                3.654.000đ
              </Text>
            </VStack>
          </HStack>
          <VStack>
            <Text style={[styles.text, {color: '#FFFFFF', fontSize: 11}]}>
              Tổng doanh thu
            </Text>
            <Text style={[styles.textButton, {color: '#FFFFFF', fontSize: 11}]}>
              3.654.000đ
            </Text>
          </VStack>
        </HStack>
      </Center>

      <Center
        mt={5}
        borderRadius={10}
        borderWidth={1}
        borderColor="#000000"
        backgroundColor={'#FFFFFF'}>
        <View
          position={'absolute'}
          top={-12}
          left={3}
          backgroundColor="#FFFFFF">
          <Text style={styles.text}>Tiền của quán</Text>
        </View>
        <HStack
          justifyContent={'space-between'}
          alignItems="center"
          width="100%"
          py={5}
          px={3}>
          <VStack>
            <Text style={styles.text}>Số tiền được rút</Text>
            <Text style={[styles.textButton, {color: '#4285F4'}]}>
              5.653.000đ
            </Text>
          </VStack>
          <TouchableOpacity>
            <View
              width={100}
              backgroundColor="#FEB7B1"
              justifyContent={'center'}
              p={2}
              borderRadius={8}>
              <Center>
                <Text style={[styles.textButton, {color: '#FFFFFF'}]}>
                  Rút tiền
                </Text>
              </Center>
            </View>
          </TouchableOpacity>
        </HStack>
      </Center>

      <Center
        mt={1}
        borderRadius={10}
        borderBottomWidth={1}
        borderColor="#EFEFF4">
        <Pressable
          onPress={() => console.log('clicked')}
          flexDirection="row"
          py={3}
          w={'100%'}
          alignItems={'center'}
          justifyContent={'space-between'}>
          <HStack alignItems={'center'}>
            <Image
              source={require('../../../../assets/img/promo.png')}
              style={styles.imagePromo}
              alt="image-shop"
            />
            <TouchableOpacity onPress={() => navigation.navigate('PromoType')}>
              <VStack pl={2}>
                <Text style={[styles.text, {fontSize: 14}]}>
                  Chương trình quảng cáo
                </Text>
                <Text style={[styles.text, {color: '#818181', fontSize: 10}]}>
                  Tạo và theo dõi các chương trình giảm giá của bạn
                </Text>
              </VStack>
            </TouchableOpacity>
          </HStack>
          <View>
            <ExtendIcon />
          </View>
        </Pressable>
      </Center>

      {/* <Center
        mt={5}
        mb={3}
        borderRadius={10}
        borderBottomWidth={1}
        borderColor="#EFEFF4">
        <View py={3}>
          <Text style={styles.textButton}>Cài đặt</Text>
        </View>
        <Pressable
          onPress={() => console.log('clicked')}
          flexDirection="row"
          w={'100%'}
          pb={3}
          alignItems={'center'}
          justifyContent={'space-between'}>
          <HStack alignItems={'center'}>
            <Image
              source={require('../../../../assets/img/store.png')}
              style={styles.imagePromo}
              alt="image-shop"
            />
            <VStack pl={2}>
              <Text style={[styles.text, {fontSize: 14}]}>
                Quản lý cửa hàng
              </Text>
            </VStack>
          </HStack>
          <View>
            <ExtendIcon />
          </View>
        </Pressable>
      </Center> */}
    </View>
  );
};

export default InfoShop;

const styles = StyleSheet.create({
  image: {
    width: 52,
    height: 52,
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
  text: {
    fontFamily: 'Poppins-Regular',
    color: '#312E49',
    fontSize: 16,
    fontWeight: '600',
  },
  textButton: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#312E49',
  },
});
