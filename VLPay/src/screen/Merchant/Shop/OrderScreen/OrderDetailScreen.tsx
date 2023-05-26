import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Input} from '@rneui/base';
import {HStack, ScrollView, TextArea, VStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import {TextInput, TouchableOpacity, View, Linking} from 'react-native';
import {axiosClient} from '../../../../components/apis/axiosClient';
import {baseUrl} from '../../../../components/apis/baseUrl';
import HeaderComp from '../../../../components/HeaderComp';
import Colors from '../../../../components/helpers/Colors';
import Icons from '../../../../components/Icons';
import {UText} from '../../../../components/UText';
import YesNoModal from '../../../../components/YesNoModal';
import {
  MainStackNavigation,
  MainStackParamList,
} from '../../../../stack/Navigation';
import Order from '../../../../assets/svg/order.svg';
import Call from '../../../../assets/svg/call-user.svg';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {moderateScale} from '../../../Transfer/ScaleUtils';
import axios from 'axios';

const OrderDetailScreen = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const {data} = useRoute<RouteProp<MainStackParamList, 'Transfer'>>()?.params;
  const [orderDetail, setOrderDetail] = useState([]);
  const [status, setStatus] = useState(data?.status);
  const [visibleWarning, setVisibleWarning] = useState(false);
  const [isGetCash, setGetCash] = useState(false);
  const {modalVisible, toggleModal, closeModal} = ModalProvider();

  console.log(orderDetail.taken_code);
  const [modal, setModal] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [_visibleWarning, _setVisibleWarning] = useState(false);
  const [value, setValue] = useState('0');

  const fetchData = async () => {
    const result = await axiosClient.get(
      baseUrl +
        'merchant/order/detail?order_id=' +
        data?.id +
        '&store_id=' +
        data?.store_id,
    );
    setOrderDetail(result.data.data);
  };

  useEffect(() => {
    fetchData();
  }, [navigation]);

  const UpdateState = async state => {
    switch (state) {
      case 'canceled':
        const item = {
          order_id: data?.id,
          status: 'canceled',
          store_id: data?.store_id,
        };
        navigation.navigate('OrderDetailCancel', {
          data: item,
        });
        break;
      case 'accepted':
        const formData = new FormData();
        formData.append('order_id', data?.id);
        formData.append('status', 'accepted');
        formData.append('store_id', data?.store_id);
        console.error('formData', formData);

        const result = await axiosClient.post(
          baseUrl + 'merchant/order/update-status',
          formData,
          {
            headers: {'content-type': 'multipart/form-data'},
          },
        );
        setOrderDetail(result.data.data);
        break;
      case 'processing':
        const formData_processing = new FormData();
        formData_processing.append('order_id', data?.id);
        formData_processing.append('status', 'processing');
        formData_processing.append('store_id', data?.store_id);
        const result_processing = await axiosClient.post(
          baseUrl + 'merchant/order/update-status',
          formData_processing,
          {
            headers: {'content-type': 'multipart/form-data'},
          },
        );
        setOrderDetail(result_processing.data.data);
        break;
      case 'finished':
        const formData_finished = new FormData();
        formData_finished.append('order_id', data?.id);
        formData_finished.append('status', 'finished');
        formData_finished.append('store_id', data?.store_id);
        const result_finished = await axiosClient.post(
          baseUrl + 'merchant/order/update-status',
          formData_finished,
          {
            headers: {'content-type': 'multipart/form-data'},
          },
        );
        setOrderDetail(result_finished.data.data);
        break;
    }
  };

  const ButtonCustom = () => {
    switch (orderDetail?.status ?? '') {
      case 'pending':
        return (
          <HStack
            justifyContent={'space-evenly'}
            position={'absolute'}
            width={'100%'}
            bottom={10}>
            <TouchableOpacity
              style={{
                paddingVertical: 16,
                backgroundColor: '#B5EAD8',
                borderRadius: 10,
                width: '30%',
              }}
              onPress={async () => {
                UpdateState('accepted');
              }}>
              <UText style={{alignSelf: 'center', fontWeight: '700'}}>
                Bắt đầu
              </UText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: 16,
                backgroundColor: '#FEB7B1',
                borderRadius: 10,
                width: '30%',
              }}
              onPress={() => {
                UpdateState('canceled');
              }}>
              <UText style={{alignSelf: 'center', fontWeight: '700'}}>
                Hủy
              </UText>
            </TouchableOpacity>
          </HStack>
        );
      case 'accepted':
        return (
          <HStack
            justifyContent={'space-evenly'}
            position={'absolute'}
            width={'100%'}
            bottom={10}>
            <TouchableOpacity
              style={{
                paddingVertical: 16,
                backgroundColor: '#B5EAD8',
                borderRadius: 10,
                width: '90%',
              }}
              onPress={async () => {
                UpdateState('processing');
              }}>
              <UText style={{alignSelf: 'center', fontWeight: '700'}}>
                Chuẩn bị đơn
              </UText>
            </TouchableOpacity>
          </HStack>
        );
      case 'processing':
        return (
          <HStack
            justifyContent={'space-evenly'}
            position={'absolute'}
            width={'100%'}
            bottom={10}>
            <TouchableOpacity
              style={{
                paddingVertical: 16,
                backgroundColor: '#B5EAD8',
                borderRadius: 10,
                width: '90%',
              }}
              onPress={async () => {
                setVisibleWarning(true);
              }}>
              <UText style={{alignSelf: 'center', fontWeight: '700'}}>
                Hoàn Thành Món
              </UText>
            </TouchableOpacity>
          </HStack>
        );
      case 'finished':
        return (
          <>
            <HStack
              justifyContent={'space-evenly'}
              position={'absolute'}
              width={'100%'}
              bottom={10}>
              <TouchableOpacity
                style={{
                  paddingVertical: 16,
                  backgroundColor: '#B5EAD8',
                  borderRadius: 10,
                  width: '90%',
                }}
                onPress={toggleModal}>
                <UText style={{alignSelf: 'center', fontWeight: '700'}}>
                  Nhập mã
                </UText>
              </TouchableOpacity>
            </HStack>

            <Modal
              isVisible={modalVisible}
              animationIn="slideInUp"
              animationOut="fadeOutDown"
              style={{
                paddingVertical: 16,
                backgroundColor: '#B5EAD8',
                borderRadius: 10,
                width: '90%',
              }}
              onPress={async () => {
                setModal(true);
              }}>
              <UText style={{alignSelf: 'center', fontWeight: '700'}}>
                Xác nhận nhận hàng
              </UText>
            </TouchableOpacity>
          </HStack>
        );
    }
  };

  return (
    <>
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>
        <HeaderComp
          title={'Chi tiết đơn hàng'}
          onPressBack={() => navigation.goBack()}
        />
        <ScrollView style={{paddingHorizontal: 16}}>
          <HStack
            paddingTop={5}
            justifyContent={'space-between'}
            alignItems={'center'}>
            <VStack>
              <UText style={{color: '#4285F4', fontWeight: '700'}}>
                #{orderDetail?.order_code}
              </UText>
              <UText style={{color: '#000000', fontWeight: '700'}}>
                {orderDetail?.taken_code}
              </UText>
            </VStack>
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 5,
                backgroundColor: '#CDD3E6',
                borderRadius: 30,
              }}>
              <UText style={{fontWeight: '700'}}>
                {orderDetail?.status === 'canceled' && (
                  <UText>Đơn đã được hủy</UText>
                )}
                {orderDetail?.status === 'pending' && <UText>Đơn mới</UText>}
                {orderDetail?.status === 'accepted' && (
                  <UText>Đơn tiếp nhận</UText>
                )}
                {orderDetail?.status === 'processing' && (
                  <UText>Đơn đang chuẩn bị</UText>
                )}
                {orderDetail?.status === 'finished' && (
                  <UText>Đơn chờ lấy</UText>
                )}
              </UText>
            </View>
          </HStack>
          <VStack>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <UText style={{fontWeight: '700', marginVertical: 10}}>
                Khách hàng
              </UText>
              <View
                style={{width: '100%', height: 1, backgroundColor: '#E4E9F2'}}
              />
            </View>
            <HStack justifyContent="space-between">
              <UText>{orderDetail?.user?.f_name}</UText>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(`tel:${orderDetail?.user?.phone}`)
                }>
                <Call />
              </TouchableOpacity>
            </HStack>
            <VStack>
              <UText style={{fontWeight: '700', marginVertical: 10}}>
                Ghi chú
              </UText>
              <TextInput
                editable={false}
                placeholder={orderDetail?.note ?? 'Khong'}
                placeholderTextColor={'#979797'}
              />
            </VStack>
            <VStack>
              <UText style={{fontWeight: '700'}}>Menu</UText>
              {orderDetail?.product_detail &&
                orderDetail?.product_detail.map(item => {
                  return (
                    <View style={{marginVertical: 10}}>
                      <HStack justifyContent={'space-between'}>
                        <HStack>
                          <UText>
                            {item.quantity} x {item.name}
                          </UText>
                          <View style={{width: 10}} />
                        </HStack>
                        <UText>{(item?.price ?? 0).toLocaleString()}đ</UText>
                      </HStack>
                      {item?.add_ons.map(item => {
                        return (
                          <HStack justifyContent={'space-between'}>
                            <UText style={{color: '#50555C', fontSize: 14}}>
                              {item.name}
                            </UText>
                            <UText style={{color: '#50555C', fontSize: 14}}>
                              {(item?.price ?? 0).toLocaleString()}đ
                            </UText>
                          </HStack>
                        );
                      })}
                      <View
                        style={{
                          width: '100%',
                          height: 1,
                          backgroundColor: '#E4E9F2',
                          marginVertical: 10,
                        }}
                      />
                    </View>
                  );
                })}
              <HStack
                justifyContent={'space-between'}
                alignItems={'center'}
                style={{marginVertical: 10}}>
                <UText style={{fontWeight: '700'}}>
                  Tổng tiền món (giá gốc)
                </UText>
                <UText>
                  {(orderDetail?.order_total ?? 0).toLocaleString()}đ
                </UText>
              </HStack>
              <HStack
                justifyContent={'space-between'}
                alignItems={'center'}
                style={{marginVertical: 10}}>
                <UText style={{fontWeight: '700'}}>Phiếu giảm giá</UText>
                <UText>
                  {(orderDetail?.discount_amount ?? 0).toLocaleString()}đ
                </UText>
              </HStack>
              <HStack
                marginBottom={200}
                justifyContent={'space-between'}
                alignItems={'center'}
                style={{marginVertical: 10}}>
                <UText style={{fontWeight: '700'}}>Quán phải thu</UText>
                <UText style={{fontWeight: '700', color: '#4285F4'}}>
                  {(
                    orderDetail?.order_total - orderDetail?.discount_amount ?? 0
                  ).toLocaleString()}
                  đ
                </UText>
              </HStack>
            </VStack>
          </VStack>
        </ScrollView>
        <ButtonCustom />
        <YesNoModal
          icon={<Icons.WarningIcon />}
          visible={_visibleWarning}
          btnLeftStyle={{
            backgroundColor: Colors.primary,
            width: 200,
          }}
          hideRight={true}
          hideLeft={true}
          btnRightStyle={{
            backgroundColor: '#909192',
            width: 200,
            display: 'none',
          }}
          message={phoneError}
          onActionLeft={() => {
            _setVisibleWarning(false);
          }}
          onActionRight={() => {
            _setVisibleWarning(false);
          }}
          btnTextLeft={'Xác nhận'}
          style={{flexDirection: 'column'}}
        />
        <YesNoModal
          icon={<Order />}
          visible={visibleWarning}
          btnLeftStyle={{
            backgroundColor: '#BEC2CE',
          }}
          btnRightStyle={{
            backgroundColor: '#B5EAD8',
          }}
          hideRight={false}
          hideLeft={false}
          message={
            'Quán đã chuẩn bị xong đơn thu số tiền là ' +
            (
              orderDetail?.order_total - orderDetail?.discount_amount ?? 0
            ).toLocaleString() +
            'đ'
          }
          onActionLeft={() => {
            setGetCash(false);
            setVisibleWarning(false);
          }}
          onActionRight={() => {
            UpdateState('finished');
            setVisibleWarning(false);
          }}
          btnTextLeft={'Chưa Nhận'}
          btnTextRight={'Xác nhận'}
        />
      </View>
      {modal && (
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: 100000,
            overflow: 'hidden',
            flexDirection: 'row',
            justifyContent: 'center',
            paddingTop: 250,
          }}>
          <TouchableOpacity
            style={{
              width: '100%',
              height: '1000%',
              position: 'absolute',
              backgroundColor: 'black',
              opacity: 0.5,
            }}
            onPress={() => setModal(false)}></TouchableOpacity>
          <View
            style={{
              height: 150,
              backgroundColor: 'white',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
            }}>
            <TouchableOpacity
              style={{position: 'absolute', right: 10, top: 10}}
              onPress={() => setModal(false)}>
              <UText style={{fontSize: 20}}>X</UText>
            </TouchableOpacity>
            <UText>Nhập mã xác nhận</UText>
            <View
              style={{
                paddingHorizontal: 8,
                borderWidth: 1,
                borderColor: 'black',
                borderRadius: 30,
                width: '80%',
                height: 40,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'white',
              }}>
              <OTPInputView
                style={{height: 100, justifyContent: 'center'}}
                pinCount={4}
                // autoFocusOnLoad
                codeInputFieldStyle={{
                  width: 50,
                  height: 60,
                  color: Colors.cloudBurst,
                  fontSize: moderateScale(28),
                  borderWidth: 0,
                  alignItems: 'center',
                  paddingHorizontal: -30,
                }}
                onCodeFilled={setValue}
                keyboardType="number-pad"
                onCodeChanged={async value => {
                  if (value.length === 4) {
                    try {
                      const result = await axiosClient.post(
                        '/merchant/order/update-status',
                        {
                          status: 'taken',
                          taken_code: value,
                          order_id: data?.id,
                        },
                      );
                      navigation.goBack();
                    } catch (e) {
                      console.log(e);
                      setModal(false);
                      setPhoneError(e.error);
                      _setVisibleWarning(true);
                      setTimeout(() => {
                        _setVisibleWarning(false);
                      }, 3000);
                    }
                  }
                }}
                secureTextEntry={false}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ChangePassword', {
                  phone: data?.phone,
                });
              }}>
              <UText style={{color: '#3495CB', fontSize: 14, paddingTop: 10}}>
                Quên mật khẩu
              </UText>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default OrderDetailScreen;
