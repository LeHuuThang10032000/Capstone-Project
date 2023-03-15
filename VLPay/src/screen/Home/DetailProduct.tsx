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
import {Center, Heading, HStack, Text, View, Skeleton} from 'native-base';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ChevronLeft from '../../assets/svg/close.svg';
import {MainStackNavigation} from '../../stack/Navigation';
import {formatCurrency} from '../../components/helper';
import useCartStore, {CartItem} from '../../store/cart';
import {Product, myCart} from '../../store/cart';
import CartIcon from '../../assets/svg/cart.svg';
import IncreaseIcon from '../../assets/svg/increase.svg';
import DecreaseIcon from '../../assets/svg/decrease.svg';
import {Checkbox} from 'react-native-paper';

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

const DetailProduct = ({route, productId}: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const {id, store_id} = route.params;
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
  const [cart, setCart] = useState<myCart>();
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [totalItem, setTotalItem] = useState(0);
  const [isLoading, setLoading] = useState(false);

  console.log('TOTAL', totalItem);

  console.log(checkedItems);
  console.log('QUANTITY: ', quantity);
  console.log('Price: ', price);
  console.log('Product ID:', id);
  console.log('Store ID:', store_id);
  console.log('Current Cart:', cart);

  //Get detail product
  const getDetailProduct = useCallback(async () => {
    setLoading(true);
    const result = await axiosClient.get(`/product/${id}`);
    setProduct(result.data?.data);
    setPrice(result?.data?.data?.price);
    setLoading(false);
  }, []);

  //Get Cart
  const getCart = useCallback(async () => {
    const result = await axiosClient.get('/cart');
    setCart(result?.data?.data);
    setTotalItem(result?.data?.data?.total_quantity);
  }, []);

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      getDetailProduct();
      getCart();
    }
  }, [getDetailProduct, getCart, isFocused]);

  // const handleAddToCart = () => {
  //   if (product) {
  //     addToCart(product, quantity);
  //     navigation.goBack();
  //   }
  // };

  const addCart = useCallback(async () => {
    const formData = new FormData();
    formData.append('product_id', id);
    formData.append('store_id', store_id);
    formData.append('quantity', quantity);
    formData.append('add_ons[]', [checkedItems]);
    const result = await axiosClient.post('/cart', formData, {
      headers: {'content-type': 'multipart/form-data'},
    });
    console.log(result.data);
    getCart();
  }, [quantity, checkedItems]);

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
          <View marginY={5} paddingX={3}>
            <Heading>{product?.name}</Heading>
            <Heading paddingTop={5} size={'md'} color="#4285F4">
              {formatCurrency((product?.price ?? 0).toString())}đ
            </Heading>
          </View>

          <View>
            <HStack
              alignItems={'center'}
              paddingX={3}
              justifyContent="space-between">
              <Heading size="md">Chọn Toppings</Heading>
              <View
                padding={'1.5'}
                borderRadius={4}
                backgroundColor={'#B5EAD8'}>
                <Text fontWeight={'bold'} color="#319674">
                  Tùy chọn
                </Text>
              </View>
            </HStack>
            {product?.add_ons.map(item => (
              <HStack px={3} justifyContent="space-between" alignItems="center">
                <Checkbox.Item
                  style={{paddingLeft: -10}}
                  color="#4285F4"
                  key={item.id}
                  label={item.name}
                  position="leading"
                  status={
                    checkedItems.includes(item.id) ? 'checked' : 'unchecked'
                  }
                  onPress={() => {
                    if (checkedItems.includes(item.id)) {
                      setCheckedItems(
                        checkedItems.filter(value => value !== item.id),
                      );
                    } else {
                      setCheckedItems([...checkedItems, item.id]);
                    }
                  }}
                />
                <Text>{formatCurrency((item.price ?? 0).toString())}đ</Text>
              </HStack>
            ))}
          </View>

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
          <TouchableOpacity onPress={addCart}>
            <View
              justifyContent="center"
              alignItems={'center'}
              style={{
                width: 250,
                padding: 19,
                backgroundColor: '#B5EAD8',
                borderRadius: 10,
              }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                color={'#000000'}
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
          <TouchableOpacity onPress={addCart}>
            <View
              justifyContent="center"
              alignItems={'center'}
              style={{
                width: '100%',
                padding: 20,
                backgroundColor: '#B5EAD8',
                borderRadius: 10,
              }}>
              <Text color={'#000000'} fontWeight="bold" fontSize={16}>
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
