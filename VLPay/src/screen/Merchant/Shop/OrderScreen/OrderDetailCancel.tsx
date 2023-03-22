import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {HStack, TextArea, VStack} from 'native-base';
import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {axiosClient} from '../../../../components/apis/axiosClient';
import {baseUrl} from '../../../../components/apis/baseUrl';
import HeaderComp from '../../../../components/HeaderComp';
import {UText} from '../../../../components/UText';
import {
  MainStackNavigation,
  MainStackParamList,
} from '../../../../stack/Navigation';

const OrderDetailCancel = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const {data} = useRoute<RouteProp<MainStackParamList, 'Transfer'>>()?.params;
  const [value, setValue] = React.useState('');
  const [note, setNote] = useState('');
  return (
    <View style={{flex: 1}}>
      <HeaderComp
        title={'Chi tiết đơn hàng'}
        onPressBack={() => navigation.goBack()}
      />
      <VStack style={{paddingHorizontal: 16, paddingVertical: 10}}>
        <UText>Quán đã gặp phải vấn đề nào:</UText>
        <RadioButton.Group
          onValueChange={newValue => setValue(newValue)}
          value={value}>
          <HStack alignItems={'center'}>
            <RadioButton value="Hết hàng" />
            <UText>Hết hàng</UText>
          </HStack>
          <HStack alignItems={'center'}>
            <RadioButton value="Quán gặp chuyện đột xuất" />
            <UText>Quán gặp chuyện đột xuất</UText>
          </HStack>
          <HStack alignItems={'center'}>
            <RadioButton value="Vấn đề khác" />
            <UText>Vấn đề khác</UText>
          </HStack>
        </RadioButton.Group>
        <UText>Chi tiết vấn đề</UText>
        <TextArea
          value={note}
          onChangeText={text => {
            setNote(text);
          }}
          autoCompleteType={undefined}
        />
      </VStack>
      <View
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 10,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={{
            width: '90%',
            paddingVertical: 10,
            backgroundColor: '#B5EAD8',
          }}
          onPress={async () => {
            const formData = new FormData();
            formData.append('order_id', data.order_id);
            formData.append('status', data.status);
            formData.append('store_id', data.store_id);
            formData.append('cancel_reason', value);
            await axiosClient.post(
              baseUrl + 'merchant/order/update-status',
              formData,
              {
                headers: {'content-type': 'multipart/form-data'},
              },
            );
            navigation.goBack();
          }}>
          <UText style={{alignSelf: 'center'}}>Xác nhận</UText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderDetailCancel;
