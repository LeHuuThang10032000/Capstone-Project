import {
  Alert,
  Animated,
  Button,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {axiosClient} from '../../components/apis/axiosClient';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Center, Heading, HStack, Text, View, VStack} from 'native-base';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ChevronLeft from '../../assets/svg/close.svg';
import {MainStackNavigation} from '../../stack/Navigation';
import {formatCurrency} from '../../components/helper';
import useCartStore, {CartItem} from '../../store/cart';
import {Product} from '../../store/cart';
import CartIcon from '../../assets/svg/cart.svg';
import IncreaseIcon from '../../assets/svg/increase.svg';
import DecreaseIcon from '../../assets/svg/decrease.svg';

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

const DetailProduct = ({route, productId}: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const {id} = route.params;
  const isFocused = useIsFocused();

  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT_EXPANDED = 190;
  const HEADER_HEIGHT_NARROWED = 60 + insets.top;
  const scrollY = useRef(new Animated.Value(0)).current;
  const {width} = useWindowDimensions();

  const [product, setProduct] = useState<Product | null>(null);
  const [price, setPrice] = useState<number>();
  const {totalItems, addToCart} = useCartStore();
  const [quantity, setQuantity] = useState(1);

  console.log('MY CART: ', totalItems);
  console.log('QUANTITY: ', quantity);
  console.log('Price: ', price);

  //Get detail product
  const getDetailProduct = useCallback(async () => {
    const result = await axiosClient.get(`/product/${id}`);
    setProduct(result.data?.data);
    setPrice(result?.data?.data?.price);
  }, []);

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      getDetailProduct();
    }
  }, [getDetailProduct, isFocused]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      navigation.goBack();
    }
  };

  const handlePrice = price !== undefined ? price * quantity : 0;

  return (
    <View flex={1} backgroundColor="#FFFFFF">
      <ScrollView>
        <View flex={1} paddingBottom={100} paddingX={3}>
          <HStack
            style={{zIndex: 2, top: insets.top + 20, position: 'absolute'}}
            paddingX={3}
            justifyContent="space-between">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft />
            </TouchableOpacity>
          </HStack>
          <AnimatedImageBackground
            source={{uri: product?.image}}
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
          <View marginY={5} paddingX={5}>
            <Heading>{product?.name}</Heading>
            <Heading paddingTop={5} size={'md'} color="#4285F4">
              {formatCurrency((product?.price ?? 0).toString())}đ
            </Heading>
          </View>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam
            laudantium dolor aperiam nihil assumenda error est, cum, deleniti
            amet ut vero dolorem ipsum dolor sit amet, consectetur adipisicing
            elit. Quisquam laudantium dolor aperiam nihil assumenda error est,
            cum, deleniti amet ut vero dolorem ipsum dolor sit amet, consectetur
            adipisicing elit. Quisquam laudantium dolor aperiam nihil assumenda
            error est, cum, deleniti amet ut vero dolorem ipsum dolor sit amet,
            consectetur adipisicing elit. Quisquam laudantium dolor aperiam
            nihil assumenda error est, cum, deleniti amet ut vero dolorem ipsum
            dolor sit amet, consectetur adipisicing elit. Quisquam laudantium
            dolor aperiam nihil assumenda error est, cum, deleniti amet ut
            veorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam
            laudantium dolor aperiam nihil assumenda error est, cum, deleniti
            amet ut vero dolorem ipsum dolor sit amet, consectetur adipisicing
            elit. Quisquam laudantium dolor aperiam nihil assumenda error est,
            cum, deleniti amet ut vero dolorem ipsum dolor sit amet, consectetur
            adipisicing elit. Quisquam laudantium dolor aperiam nihil assumenda
            error est, cum, deleniti amet ut vero dolorem ipsum dolor sit amet,
            consectetur adipisicing elit. Quisquam laudantium dolor aperiam
            nihil assumenda error est, cum, deleniti amet ut vero dolro dolore
            quo impedit. Asperiores vero qui architecto tempore! Earum!
          </Text>
          <Center paddingY={10}>
            <HStack alignItems={'center'}>
              <TouchableOpacity
                onPress={() => setQuantity(quantity - 1)}
                disabled={quantity === 1}>
                <DecreaseIcon />
              </TouchableOpacity>
              <Text paddingX={5} fontSize={18} fontWeight={'bold'}>
                {quantity}
              </Text>
              <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                <IncreaseIcon />
              </TouchableOpacity>
            </HStack>
          </Center>
        </View>
      </ScrollView>

      {totalItems > 0 ? (
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
              borderColor="#4285F4"
              justifyContent="center"
              alignItems={'center'}
              flexDirection="row">
              <CartIcon />
              <Text>{totalItems}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddToCart}>
            <View
              justifyContent="center"
              alignItems={'center'}
              style={{
                width: 250,
                padding: 19,
                backgroundColor: '#4285F4',
                borderRadius: 10,
              }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                color={'#FFFFFF'}
                fontWeight="bold"
                fontSize={16}>
                {`Thêm vào giỏ hàng: ${formatCurrency(
                  (handlePrice ?? 0).toString(),
                )}đ`}
              </Text>
            </View>
          </TouchableOpacity>
        </HStack>
      ) : (
        <View
          zIndex={99}
          position={'absolute'}
          width={width}
          bottom={0}
          paddingY={3}
          paddingX={3}
          backgroundColor={'#FFFFFF'}>
          <TouchableOpacity onPress={handleAddToCart}>
            <View
              justifyContent="center"
              alignItems={'center'}
              style={{
                width: '100%',
                padding: 20,
                backgroundColor: '#4285F4',
                borderRadius: 10,
              }}>
              <Text color={'#FFFFFF'} fontWeight="bold" fontSize={16}>
                Thêm vào giỏ hàng
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DetailProduct;

const styles = StyleSheet.create({
  backgroundImage: {
    // position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
  },
});
