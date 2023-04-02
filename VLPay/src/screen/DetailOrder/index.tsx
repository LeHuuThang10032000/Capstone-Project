import {Modal, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Center,
  ChevronRightIcon,
  Divider,
  FormControl,
  Heading,
  HStack,
  Image,
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
import {UText} from '../../components/UText';
import HeaderComp from '../../components/HeaderComp';
import YesNoModal from '../../components/YesNoModal';
import Icons from '../../components/Icons';
import Colors from '../../components/helpers/Colors';

interface DetailOrder {
  phone: string;
  name: string;
}

const DetailOrder = ({route}: any) => {
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

  const {store_id} = route.params;

  const navigation = useNavigation<MainStackNavigation>();
  const [cart, setCart] = useState<myCart>();
  const [totalItem, setTotalItem] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [text, onChangeText] = React.useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(false);
  const [promoCode, setPromoCode] = useState([]);
  const [radioBox, setRadioBox] = useState(null);
  const [promo_name, setPromoName] = useState('');
  const [visibleWarning, setVisibleWarning] = useState(false);
  const [generalError, setGeneralError] = useState('');
  //Get Cart
  const getCart = useCallback(async () => {
    setLoading(true);
    const result = await axiosClient.get('/cart');
    const promocode = await axiosClient.get(
      '/merchant/promocode?store_id=' +
        store_id +
        '&page=1&limit=10&status=RUNNING',
    );

    const _array = [];
    const promocodes = promocode?.data?.data;
    promocodes.forEach((item, key) => {
      const _item = promocodes[key];
      _item.isChoose = false;
      _array.push(_item);
    });

    console.log('_array', _array);

    setCart(result?.data?.data);
    setPromoCode(_array);
    setTotalPrice(result?.data?.data?.total_price);
    setTotalItem(result?.data?.data?.total_quantity);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      getCart();
    }
  }, [getCart, isFocused]);

  const toggleModal = () => {
    setVisible(!visible);
  };

  const handleChoose = (id, title) => {
    if (radioBox !== id) {
      setRadioBox(id);
      setPromoName(title);
    } else {
      setRadioBox(null);
      setPromoName('');
    }
  };

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
                <VStack>
                  <Text fontWeight={'bold'} fontSize={16}>
                    {formatCurrency((item?.price ?? 0).toString())}đ
                  </Text>
                  {item.add_ons.map(item => (
                    <Text key={item.id} color={'#747980'}>
                      {formatCurrency((item?.price ?? 0).toString())}đ
                    </Text>
                  ))}
                </VStack>
              </HStack>
            ))}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DetailCart', {store_id: store_id})
              }>
              <Text fontSize={16} fontWeight="bold" color={'#0088CC'}>
                Chỉnh sửa
              </Text>
            </TouchableOpacity>
            <VStack marginTop={5}>
              <HStack paddingBottom={3} justifyContent={'space-between'}>
                <Text>Tổng tạm tính</Text>
                <Text>
                  {formatCurrency((cart?.total_price ?? 0).toString())}đ
                </Text>
              </HStack>
              <HStack justifyContent={'space-between'}>
                <Text>Giảm giá</Text>
                <Text>0đ</Text>
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
              <TouchableOpacity onPress={toggleModal}>
                <HStack
                  marginBottom={5}
                  justifyContent={'space-between'}
                  alignItems="center">
                  <HStack alignItems={'center'}>
                    <PromoOder />
                    <Text paddingLeft={3} width={250} numberOfLines={1}>
                      {promo_name}
                    </Text>
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
              onPress={() =>
                navigation.navigate('PaymentOrder', {
                  total_price: totalPrice,
                  store_id: store_id,
                })
              }>
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
      <Modal visible={visible} animationType="slide">
        <HeaderComp title="Mã ưu đãi" onPressBack={toggleModal} />
        <View style={styles.modalContainer}>
          <VStack
            height={'100%'}
            width={'100%'}
            alignItems={'center'}
            style={{marginTop: 100, paddingHorizontal: 16}}>
            <ScrollView>
              {promoCode?.[0]?.id &&
                promoCode.map((item, key) => (
                  <View key={item.id}>
                    <Image
                      source={require('../../assets/img/promo_code.png')}
                      resizeMode="contain"
                    />
                    <View style={{position: 'absolute', top: 16, right: 10}}>
                      <UText
                        style={{fontWeight: '700', fontSize: 16, width: 230}}>
                        {item.title}
                      </UText>
                      <UText>Hạn sd đến {item.end_date}</UText>
                    </View>
                    <View style={{position: 'absolute', bottom: 20, right: 16}}>
                      <TouchableOpacity
                        // onPress={() => {
                        // promoCode[key].isChoose = true;
                        // const promoCodeArr = promoCode;
                        // setPromoCode(promoCodeArr);
                        // console.log('promoCode', promoCode);
                        // const updatedPromoCodeArr = [...promoCode, {}];
                        // updatedPromoCodeArr[key].isChoose =
                        //   !updatedPromoCodeArr[key].isChoose;
                        // setPromoCode(updatedPromoCodeArr);
                        // }}
                        onPress={() => handleChoose(item.id, item.title)}>
                        <Image
                          source={require('../../assets/img/check_promo.png')}
                          style={radioBox === item?.id ? {} : {display: 'none'}}
                        />
                        <Image
                          source={require('../../assets/img/uncheck_promo.png')}
                          style={radioBox !== item?.id ? {} : {display: 'none'}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </ScrollView>
          </VStack>
        </View>
        <View
          paddingY={5}
          paddingX={5}
          backgroundColor={'#F7F9FC'}
          style={{position: 'absolute', bottom: 20, width: '100%'}}>
          <TouchableOpacity onPress={toggleModal}>
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
                Áp dụng
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <YesNoModal
          icon={<Icons.WarningIcon />}
          visible={visibleWarning}
          btnLeftStyle={{
            backgroundColor: Colors.primary,
            width: 200,
          }}
          btnRightStyle={{
            backgroundColor: '#909192',
            width: 200,
            display: 'none',
          }}
          message={generalError}
          title={'Lỗi'}
          onActionLeft={() => {
            setVisibleWarning(false);
          }}
          onActionRight={() => {
            setVisibleWarning(false);
          }}
          btnTextLeft={'Xác nhận'}
          style={{flexDirection: 'column'}}
        />
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    width: '100%',
    height: '100%',
  },
  modalText: {
    fontSize: 24,
    color: '#fff',
  },
});
export default DetailOrder;
