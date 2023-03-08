import {
  Alert,
  Animated,
  Button,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {axiosClient} from '../../components/apis/axiosClient';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Heading, HStack, Image, View, VStack} from 'native-base';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ChevronLeft from '../../assets/svg/close.svg';
import {MainStackNavigation} from '../../stack/Navigation';
import {formatCurrency} from '../../components/helper';
import {useCart} from '../../store/cart';

type Products = {
  id: number;
  name: string;
  image: string;
  price: string;
  add_ons: AddOns[];
};

interface AddOns {
  id: number;
  name: string;
  price: string;
}

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

const DetailProduct = ({route}: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const {addToCart, increaseQuantity, decreaseQuantity, totalItems} = useCart();
  const {id} = route.params;
  const isFocused = useIsFocused();

  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT_EXPANDED = 190;
  const HEADER_HEIGHT_NARROWED = 60 + insets.top;
  const scrollY = useRef(new Animated.Value(0)).current;

  const [product, setProduct] = useState<Products>();
  console.log(product);

  //Get detail product
  const getDetailProduct = useCallback(async () => {
    const result = await axiosClient.get(`/product/${id}`);
    setProduct(result.data?.data);
  }, []);

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      getDetailProduct();
    }
  }, [getDetailProduct, isFocused]);

  const handleIncreaseQuantity = () => {
    increaseQuantity(id);
  };

  const handleDecreaseQuantity = () => {
    decreaseQuantity(id);
  };

  const handleAddToCart = () => {
    addToCart(id);
    navigation.goBack();
  };

  return (
    <ScrollView style={{flex: 1}}>
      <View flex={1}>
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
          <Heading paddingTop={5} size={'md'}>
            {formatCurrency((product?.price ?? 0).toString())}đ
          </Heading>
          {/* <Button title="-" onPress={handleDecreaseQuantity} />
          <Text>{quantity}</Text>
          <Button title="+" onPress={handleIncreaseQuantity} /> */}
          <View paddingTop={10}>
            <Button title="add to cart" onPress={handleAddToCart} />
          </View>
        </View>
      </View>
    </ScrollView>
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
