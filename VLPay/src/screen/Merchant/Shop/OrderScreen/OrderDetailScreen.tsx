import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Input} from '@rneui/base';
import {HStack, ScrollView, TextArea, VStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
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

const OrderDetailScreen = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const {data} = useRoute<RouteProp<MainStackParamList, 'Transfer'>>()?.params;
  const [orderDetail, setOrderDetail] = useState([]);
  const [status, setStatus] = useState(data?.status);
  const [visibleWarning, setVisibleWarning] = useState(false);
  const [isGetCash, setGetCash] = useState(false);

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

  console.log(data);

  useEffect(() => {
    fetchData();
  }, []);

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
                chuẩn bị đơn
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
                navigation.navigate('OrderScreen');
              }}>
              <UText style={{alignSelf: 'center', fontWeight: '700'}}>
                Đóng
              </UText>
            </TouchableOpacity>
          </HStack>
        );
    }
  };

  return (
    <View style={{height: '100%'}}>
      <HeaderComp
        title={'Chi tiết đơn hàng'}
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView style={{paddingHorizontal: 16, paddingVertical: 20}}>
        <HStack justifyContent={'space-between'} alignItems={'center'}>
          <UText style={{color: '#4285F4', fontWeight: '700'}}>
            #{orderDetail?.order_code}
          </UText>
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 5,
              backgroundColor: '#CDD3E6',
              borderRadius: 30,
            }}>
            <UText style={{fontWeight: '700'}}>{orderDetail?.status}</UText>
          </View>
        </HStack>
        <VStack>
          <View
            style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
            <UText style={{fontWeight: '700', marginVertical: 10}}>
              Khách hàng
            </UText>
            <View
              style={{width: '100%', height: 1, backgroundColor: '#E4E9F2'}}
            />
          </View>
          <HStack>
            <UText>{orderDetail?.user?.f_name}</UText>
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
                        <UText>{item.quantity}x</UText>
                        <View style={{width: 10}} />
                        <HStack>
                          <VStack>
                            <UText>{item?.name}</UText>
                            <VStack>
                              {item?.add_ons.map(item => {
                                return (
                                  <UText
                                    style={{color: '#50555C', fontSize: 14}}>
                                    {item.name}
                                  </UText>
                                );
                              })}
                            </VStack>
                          </VStack>
                        </HStack>
                      </HStack>
                      <UText>{(item?.price ?? 0).toLocaleString()}</UText>
                    </HStack>
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
              <UText style={{fontWeight: '700'}}>Tổng tiền món (giá gốc)</UText>
              <UText>{(orderDetail?.order_total ?? 0).toLocaleString()}đ</UText>
            </HStack>
            <HStack
              justifyContent={'space-between'}
              alignItems={'center'}
              style={{marginVertical: 10}}>
              <UText style={{fontWeight: '700'}}>Mã giảm giá</UText>
              <UText>
                {(orderDetail?.discount_amount ?? 0).toLocaleString()}đ
              </UText>
            </HStack>
            <HStack
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
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <UText style={{fontWeight: '700'}}>
                Đơn hàng chưa thanh toán
              </UText>
            </View>
          </VStack>
        </VStack>
      </ScrollView>
      <ButtonCustom />
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
          setGetCash(true);
          if (isGetCash) {
            UpdateState('finished');
          }
          setVisibleWarning(false);
        }}
        btnTextLeft={'Chưa Nhận'}
        btnTextRight={'Xác nhận'}
      />
    </View>
  );
};

export default OrderDetailScreen;
