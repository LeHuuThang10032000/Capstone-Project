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
import SwitchButtonSmall from '../../../../components/SwitchButtonSmall';
import {baseUrl} from '../../../../components/apis/baseUrl';

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
  const [switchValue, setSwitchValue] = useState(false);
  const [isEnabled, setIsEnabled] = useState(switchValue);
  const [order, setOrder] = useState({});
  const [statusState, setStatusState] = useState('');

  const handleSwitchValueChange = async (value: boolean) => {
    await axiosClient.post('merchant/store/update/status', {
      status: value ? 'opening' : 'closing',
    });
    setSwitchValue(value);
  };
  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
  };

  const getStore = useCallback(async () => {
    setIsLoading(true);
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/merchant/store',
    );
    setData(result.data?.data);
    setIsLoading(false);
  }, []);

  const getInfoStore = useCallback(async () => {
    const date = new Date(); // Create a new date object with the current date and time
    const isoString = date.toISOString(); // Convert the date to an ISO-formatted string
    const formattedDate = isoString.slice(0, 10); // Extract the first 10 characters of the string (YYYY-MM-DD)
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/merchant/store',
    );
    const _history = await axiosClient.get(
      baseUrl +
        'merchant/history-order?page=1&limit=10&store_id=' +
        result?.data?.data?.id +
        '&date=' +
        formattedDate,
    );
    console.log(_history?.data?.data);

    setOrder(_history?.data?.data);
  }, []);

  const fetchData = async () => {
    try {
      const result = await axiosClient.get('/merchant/store');
      setStatusState(result?.data?.data?.status !== 'closing' ? true : false);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getInfoStore();
  }, [getInfoStore]);

  console.log('order', order);

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      console.log(12335432);
      setStatusState('');
      fetchData();
      getInfoStore();
      getStore();
    }
  }, [getStore, isFocused]);

  console.log(statusState);

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
                source={{uri: data?.cover_photo}}
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
          <Text style={styles.textButton}>{order?.orders_total ?? 0}</Text>
        </Center>
      </Center>

      <Center
        mt={5}
        borderRadius={10}
        borderWidth={1}
        borderColor="#EFEFF4"
        backgroundColor={'#C7CEEA4A'}>
        <HStack
          alignItems="center"
          justifyContent={'space-between'}
          width="100%"
          py={3}
          px={2}>
          <VStack>
            <Text style={styles.textButton}>Tình trạng quán</Text>
            <Text>Tắt để tạm dừng nhận đơn hàng đến</Text>
          </VStack>
          {/* <Switch size={'md'} /> */}
          {statusState !== '' && (
            <SwitchButtonSmall
              label1={'Mở'}
              label2={'Tắt'}
              value={statusState}
              onValueChange={handleSwitchValueChange}
            />
          )}
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
              source={require('../../../../assets/img/account_balance_wallet.png')}
              style={styles.image}
              alt="image-shop"
            />
            <VStack>
              <Text style={[styles.text, {color: '#000000', fontSize: 14}]}>
                Doanh thu hôm nay
              </Text>
              <Text
                style={[styles.textButton, {color: '#000000', fontSize: 16}]}>
                {(order?.total_revenue ?? 0).toLocaleString()}đ
              </Text>
            </VStack>
          </HStack>
          <VStack>
            <Text style={[styles.text, {color: '#000000', fontSize: 11}]}>
              Tổng doanh thu
            </Text>
            <Text style={[styles.textButton, {color: '#000000', fontSize: 11}]}>
              {(order?.orders_revenue ?? 0).toLocaleString()}đ
            </Text>
          </VStack>
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
            <TouchableOpacity
              onPress={() => {
                if (data) {
                  navigation.navigate('PromoType', {
                    data,
                  });
                }
              }}>
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
      {isLoading && (
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            opacity: 0,
          }}
        />
      )}
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
