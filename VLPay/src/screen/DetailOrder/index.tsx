import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Center,
  ChevronRightIcon,
  Divider,
  FormControl,
  Heading,
  HStack,
  Input,
  ScrollView,
  Text,
  TextArea,
  View,
  VStack,
} from 'native-base';
import HeaderBack from '../../components/HeaderBack';
import {Controller, useForm} from 'react-hook-form';
import {myCart} from '../../store/cart';
import {axiosClient} from '../../components/apis/axiosClient';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {formatCurrency} from '../../components/helper';
import PromoOder from '../../assets/svg/promo_order.svg';
import ContactIcon from '../../assets/svg/contact.svg';
import {MainStackNavigation} from '../../stack/Navigation';

interface DetailOrder {
  phone: string;
  name: string;
}

const DetailOrder = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<DetailOrder>({
    defaultValues: {
      name: '',
      phone: '',
    },
  });

  const navigation = useNavigation<MainStackNavigation>();
  const [cart, setCart] = useState<myCart>();
  const [totalItem, setTotalItem] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [text, onChangeText] = React.useState('');
  const isFocused = useIsFocused();

  console.log(cart);

  //Get Cart
  const getCart = useCallback(async () => {
    setLoading(true);
    const result = await axiosClient.get('/cart');
    setCart(result?.data?.data);
    setTotalItem(result?.data?.data?.total_quantity);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      getCart();
    }
  }, [getCart, isFocused]);

  return (
    <View flex={1} backgroundColor="#FFFFFF">
      <HeaderBack title="Chi tiết đơn hàng" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View flex={1} paddingTop={10} paddingBottom={'5'}>
          <Center paddingBottom={3}>
            <Text>THÔNG TIN NGƯỜI NHẬN</Text>
            <VStack space={3}>
              <FormControl isDisabled>
                <FormControl.Label
                  _disabled={{
                    _text: {
                      color: '#312E49',
                      fontWeight: 'bold',
                      fontSize: 16,
                    },
                  }}>
                  Số điện thoại
                </FormControl.Label>
                <Input
                  w="90%"
                  value="0123456789"
                  style={{fontFamily: 'Poppins-Regular', fontSize: 14}}
                  rightElement={
                    <TouchableOpacity style={{paddingRight: 10}}>
                      <ContactIcon />
                    </TouchableOpacity>
                  }
                />
              </FormControl>

              <FormControl isDisabled>
                <FormControl.Label
                  _disabled={{
                    _text: {
                      color: '#312E49',
                      fontWeight: 'bold',
                      fontSize: 16,
                    },
                  }}>
                  Họ tên
                </FormControl.Label>
                <Input
                  w="90%"
                  value="Đặng Thị Minh Ngọc"
                  style={{fontFamily: 'Poppins-Regular', fontSize: 14}}
                />
              </FormControl>
            </VStack>
          </Center>
          <Divider
            my="2"
            _light={{
              bg: 'muted.300',
            }}
            _dark={{
              bg: 'muted.50',
            }}
          />
          <View paddingTop={3} marginX={5}>
            <Heading paddingBottom={10} size={'sm'}>
              Nội dung đơn hàng
            </Heading>
            {cart?.products.map(item => (
              <HStack
                marginY={1}
                alignItems={'center'}
                justifyContent="space-between">
                <VStack>
                  <HStack alignItems={'center'}>
                    <Text fontSize={16} fontWeight={'bold'} color="#000000">
                      {item.name}
                    </Text>
                    <Text paddingLeft={1}>({item.quantity})</Text>
                  </HStack>
                  {item.add_ons.map(item => (
                    <Text key={item.id} color={'#747980'}>
                      {item.name}
                    </Text>
                  ))}
                </VStack>
                <Text fontWeight={'bold'} fontSize={16}>
                  {formatCurrency((item?.price ?? 0).toString())}đ
                </Text>
              </HStack>
            ))}
            <TouchableOpacity>
              <Text fontSize={16} fontWeight="bold" color={'#0088CC'}>
                Chỉnh sửa
              </Text>
            </TouchableOpacity>
            <VStack marginTop={5}>
              <HStack paddingBottom={3} justifyContent={'space-between'}>
                <Text>Tổng tạm tính</Text>
                <Text>150.000đ</Text>
              </HStack>
              <HStack justifyContent={'space-between'}>
                <Text>Giảm giá</Text>
                <Text>35.000đ</Text>
              </HStack>

              {/* <Controller
              control={control}
            //   rules={{
            //     required: 'Lí do không được để trống',
            //   }}
              render={({field: {onChange, onBlur, value}}) => ( */}
              <FormControl my={5}>
                <FormControl.Label
                  _text={{
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  Ghi chú:
                </FormControl.Label>
                <TextArea
                  value={text}
                  // onBlur={onBlur}
                  onChangeText={onChangeText}
                  keyboardType="email-address"
                  placeholder="Nhập nội dung"
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: 14,
                    padding: 0,
                    paddingLeft: 10,
                    marginLeft: 10,
                    flex: 1,
                  }}
                  autoCompleteType={undefined}
                />

                {/* <FormControl.ErrorMessage>
                    {errors.reason?.message}
                  </FormControl.ErrorMessage> */}
              </FormControl>
              {/* )}
            /> */}
              <TouchableOpacity>
                <HStack
                  marginBottom={5}
                  justifyContent={'space-between'}
                  alignItems="center">
                  <HStack alignItems={'center'}>
                    <PromoOder />
                    <Text paddingLeft={3}>Ưu đãi 35k</Text>
                  </HStack>
                  <ChevronRightIcon />
                </HStack>
              </TouchableOpacity>
            </VStack>
          </View>
          <Divider />
          <HStack
            marginTop={5}
            marginX={5}
            alignItems={'center'}
            justifyContent="space-between">
            <Text fontSize={20}>Tổng cộng</Text>
            <Text fontSize={20} fontWeight="bold">
              {formatCurrency((cart?.total_price ?? 0).toString())}đ
            </Text>
          </HStack>
          <View paddingY={5} paddingX={5}>
            <TouchableOpacity
              onPress={() => navigation.navigate('PaymentOrder')}>
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
                  Thanh Toán
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DetailOrder;

const styles = StyleSheet.create({});
