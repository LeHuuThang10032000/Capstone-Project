import {
  StyleSheet,
  Animated,
  ImageBackground,
  ScrollView,
  Alert,
  useWindowDimensions,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {axiosClient} from '../../components/apis/axiosClient';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button, Heading, HStack, Image, Text, View, VStack} from 'native-base';
import HeaderBack from '../../components/HeaderBack';
// import {ChevronLeftIcon} from 'native-base';
import ChevronLeft from '../../assets/svg/chevron_left.svg';
import CartIcon from '../../assets/svg/cart.svg';
import Detail from '../../assets/svg/detail.svg';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {MainStackNavigation} from '../../stack/Navigation';
import {formatCurrency} from '../../components/helper';
import useCartStore, {myCart} from '../../store/cart';

interface Products {
  id: number;
  name: string;
  image: string;
  price: string;
}

interface Categories {
  id: number;
  name: string;
  products: Products[];
}

interface DetailShop {
  categories: Categories[];
  id: number;
  phone: string;
  image: string;
  cover_photo: string;
  name: string;
  location: string;
}

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

const DetailStore = ({route}: any) => {
  const navigation = useNavigation<MainStackNavigation>();

  const {store_id} = route.params;
  const [store, setStore] = useState<DetailShop[]>([]);
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT_EXPANDED = 190;
  const HEADER_HEIGHT_NARROWED = 60 + insets.top;
  const scrollY = useRef(new Animated.Value(0)).current;
  const {width} = useWindowDimensions();

  const {totalItems} = useCartStore();
  const totalPrice = useCartStore(state => state.totalPrice());
  const [cart, setCart] = useState<myCart>();
  const [totalItem, setTotalItem] = useState(0);

  console.log(cart);

  console.log('Store ID:', store_id);

  const getDetailStore = useCallback(async () => {
    const result = await axiosClient.get(`/store/${store_id}`);
    setStore(result.data?.data);
  }, []);

  const getCart = useCallback(async () => {
    const result = await axiosClient.get('/cart');
    setCart(result.data?.data);
    setTotalItem(result?.data?.data?.total_quantity);
  }, []);

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      getDetailStore();
      getCart();
    }
  }, [getDetailStore, getCart, isFocused]);

  return (
    <View flex={1} backgroundColor="#FFFFFF">
      <ScrollView showsVerticalScrollIndicator={false}>
        {store.map(item => (
          <View key={item.id} paddingBottom={50}>
            <HStack
              style={{zIndex: 2, top: insets.top + 20}}
              paddingX={3}
              justifyContent="space-between">
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <ChevronLeft />
              </TouchableOpacity>
              <TouchableOpacity>
                <Detail />
              </TouchableOpacity>
            </HStack>
            <AnimatedImageBackground
              source={{uri: item.image}}
              style={[
                styles.backgroundImage,
                {
                  height: HEADER_HEIGHT_EXPANDED + HEADER_HEIGHT_NARROWED,
                  transform: [
                    {
                      scale: scrollY.interpolate({
                        inputRange: [-200, 0],
                        outputRange: [3, 1],
                        extrapolateLeft: 'extend',
                        extrapolateRight: 'clamp',
                      }),
                    },
                  ],
                },
              ]}></AnimatedImageBackground>
            <View
              paddingX={5}
              style={{
                marginTop: 250,
                paddingBottom: 50,
              }}>
              <Heading pb={5}>{item.name}</Heading>
              {item.categories.map(item => (
                <VStack paddingBottom={'5'} key={item.id}>
                  <Heading size={'lg'}>{item.name}</Heading>
                  {item.products.map(item => (
                    <View my={3} key={item.id}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('DetailProduct', {
                            id: item.id,
                            store_id: store_id,
                          })
                        }>
                        <HStack>
                          <Image
                            source={{uri: item.image}}
                            w={100}
                            h={100}
                            borderRadius={8}
                            borderWidth={1}
                            borderColor="#333"
                            alt="image-product"
                          />
                          <VStack paddingLeft={5}>
                            <Heading size={'md'}>{item.name}</Heading>
                            <Text fontWeight={'bold'} color={'#4285F4'}>
                              {formatCurrency((item.price ?? 0).toString())}đ
                            </Text>
                          </VStack>
                        </HStack>
                      </TouchableOpacity>
                    </View>
                  ))}
                </VStack>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
      {totalItem > 0 ? (
        <HStack
          zIndex={99}
          position={'absolute'}
          justifyContent="space-between"
          width={width}
          bottom={0}
          paddingY={3}
          paddingX={'2.5'}
          backgroundColor={'#FFFFFF'}>
          <TouchableOpacity onPress={() => navigation.navigate('DetailCart')}>
            <View
              borderRadius={10}
              padding={5}
              borderWidth={1}
              borderColor="#B5EAD8"
              justifyContent="center"
              alignItems={'center'}
              flexDirection="row">
              <CartIcon />
              <Text>{totalItem}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              justifyContent="center"
              alignItems={'center'}
              style={{
                width: 250,
                padding: 19,
                backgroundColor: '#B5EAD8',
                borderRadius: 10,
              }}>
              <Text color={'#000000'} fontWeight="bold" fontSize={16}>
                {`Xem đơn hàng: ${formatCurrency(
                  (cart?.total_price ?? 0).toString(),
                )}đ`}
              </Text>
            </View>
          </TouchableOpacity>
        </HStack>
      ) : null}
    </View>
  );
};

export default DetailStore;

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
  },
  button: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'blue',
    padding: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
  },
});
