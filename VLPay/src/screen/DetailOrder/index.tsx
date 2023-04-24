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
import Lottie from 'lottie-react-native';
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

  const {store_id, phone, name, image} = route.params;

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
  const [promo_name, setPromoName] = useState('Phiếu giảm giá');
  const [visibleWarning, setVisibleWarning] = useState(false);
  const [finalMoney, setFinalMoney] = useState(0);
  const [generalError, setGeneralError] = useState('');
  const [discount_money, setDiscount] = useState(0);
  const [search, setSearch] = useState('');
  const [profile, setProfile] = useState({});
  const [filteredDataSource, setFilteredDataSource] = useState([]);

  const fetchData = useCallback(async () => {
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/get-profile',
    );
    setProfile(result?.data?.data);
  }, []);

  useEffect(() => {
    // Call only when screen open or when back on screen
    fetchData();
  }, [fetchData]);
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

    setCart(result?.data?.data);
    setFinalMoney(result?.data?.data?.total_price);
    setPromoCode(_array);
    setFilteredDataSource(_array);
    setTotalPrice(result?.data?.data?.total_price);
    setTotalItem(result?.data?.data?.total_quantity);
    setLoading(false);
  }, []);

  const searchFilterFunction = (text: string) => {
    // Check if searched text is not blank
    if (text !== '') {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const item = promoCode.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item?.title ? item.title : '';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });

      setFilteredDataSource(item);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(promoCode);
      setSearch(text);
    }
  };

  useEffect(() => {
    // Call only when screen open or when back on screen
    getCart();
  }, []);

  const toggleModal = () => {
    setVisible(!visible);
  };

  const handleChoose = ({
    id,
    title,
    max_discount,
    min_purchase,
    discount_type,
    discount,
  }) => {
    if (radioBox !== id) {
      if (parseInt(cart?.total_price) > parseInt(min_purchase)) {
        setRadioBox(id);
        setPromoName(title);
        if (discount_type == 'percentage') {
          setCart({...cart, total_price: finalMoney});
          const item = parseInt(cart?.total_price) * (parseInt(discount) / 100);
          if (item <= max_discount) {
            setCart({...cart, total_price: parseInt(finalMoney) - item});
            setDiscount(item);
          } else {
            setCart({
              ...cart,
              total_price: parseInt(finalMoney) - parseInt(max_discount),
            });
            setDiscount(max_discount);
          }
        } else if (discount_type == 'amount') {
          setCart({...cart, total_price: finalMoney});
          const item = parseInt(cart?.total_price) - parseInt(discount);
          setCart({
            ...cart,
            total_price: parseInt(cart?.total_price) - parseInt(discount),
          });
          setDiscount(item);
        }
      } else {
        setGeneralError('Không đủ điều kiện để áp mã');
        setVisibleWarning(true);
      }
    } else {
      setRadioBox(null);
      setPromoName('Phiếu giảm giá');
      setCart({...cart, total_price: finalMoney});
      setDiscount(0);
    }
  };

  return (
    <View flex={1} backgroundColor="#FFFFFF">
      <HeaderBack title="Chi tiết đơn hàng" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <Center>
            <Lottie
              source={require('../../assets/lottie-file/loading.json')}
              autoPlay={true}
              style={{width: 100, height: 100}}
            />
          </Center>
        ) : (
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
                    value={phone}
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
                    value={name}
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
                      <Text fontSize={16} fontWeight={'bold'} paddingLeft={1}>
                        {item.quantity} x{' '}
                      </Text>
                      <Text fontSize={16} fontWeight={'bold'} color="#000000">
                        {item.name}
                      </Text>
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
                  <Text>
                    {formatCurrency((discount_money ?? 0).toString())}đ
                  </Text>
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
                  navigation.navigate('PaymentTypes', {
                    total_price: cart?.total_price,
                    store_id: store_id,
                    promo_id: radioBox,
                    image: image,
                    name: name,
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
        )}
      </ScrollView>

      <Modal visible={visible} animationType="slide">
        <HeaderComp title="Mã ưu đãi" onPressBack={toggleModal} />
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            height: 100,
            paddingHorizontal: 30,
            paddingTop: 20,
          }}>
          <Input
            placeholder="Nhập phiếu giảm giá ở đây"
            width={'75%'}
            backgroundColor={'#EDF1F7'}
            fontWeight={'700'}
            borderRadius={10}
            fontSize={16}
            onChangeText={text => searchFilterFunction(text)}
            color={'rgba(143, 155, 179, 1)'}
            value={search}
            borderWidth={0}
            placeholderTextColor={'rgba(143, 155, 179, 1)'}
          />
          <TouchableOpacity
            style={{
              borderRadius: 10,
              borderWidth: 1,
              padding: 8,
              borderColor: 'rgba(172, 177, 192, 1)',
            }}
            onPress={toggleModal}>
            <UText style={{color: 'rgba(172, 177, 192, 1)', fontWeight: '700'}}>
              Áp dụng
            </UText>
          </TouchableOpacity>
        </View>
        <View style={styles.modalContainer}>
          <VStack
            height={'100%'}
            width={'100%'}
            alignItems={'center'}
            style={{paddingHorizontal: 16}}>
            <ScrollView>
              {filteredDataSource?.[0]?.id &&
                filteredDataSource.map((item, key) => (
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
                      <TouchableOpacity onPress={() => handleChoose(item)}>
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
    paddingTop: 20,
  },
  modalText: {
    fontSize: 24,
    color: '#fff',
  },
});
export default DetailOrder;
