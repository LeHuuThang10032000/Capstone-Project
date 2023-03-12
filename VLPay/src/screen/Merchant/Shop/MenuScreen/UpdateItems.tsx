import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Input, VStack, Icon, Text, HStack} from 'native-base';
import React, {useState} from 'react';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import {Menu, MenuItem} from 'react-native-material-menu';
import {axiosClient} from '../../../../components/apis/axiosClient';
import {baseUrl} from '../../../../components/apis/baseUrl';
import HeaderComp from '../../../../components/HeaderComp';
import Icons from '../../../../components/Icons';
import {UText} from '../../../../components/UText';
import YesNoModal from '../../../../components/YesNoModal';
import {
  MainStackNavigation,
  MainStackParamList,
} from '../../../../stack/Navigation';
import Colors from '../../../Transfer/Colors';
import styles from './styles';

const UpdateItem = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const {data} =
    useRoute<RouteProp<MainStackParamList, 'UpdateItem'>>()?.params;

  const {id, isAddCategories, name, store_id, price} = data;
  const [addItem, setAddItem] = useState(name ?? '');
  const [addItemPrice, setAddItemPrice] = useState(price ?? 0);

  const [isDisabled, setDisabled] = useState(false);
  const [visibleWarning, setVisibleWarning] = useState(false);

  const [url, setUrl] = useState(
    isAddCategories ? 'product-category' : 'add-on',
  );

  return (
    <View>
      <HeaderComp title={isAddCategories ? 'Danh sách mới' : 'Món Thêm'} />
      <View style={{paddingVertical: 16, paddingHorizontal: 16}}>
        <View
          style={{
            width: '100%',
            paddingHorizontal: 26,
            borderRadius: 10,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#E1E1E1',
            borderWidth: 1,
            paddingVertical: 10,
          }}>
          <View style={{width: '100%'}}>
            <UText style={{fontWeight: '700', marginBottom: 10}}>
              {isAddCategories
                ? 'Nhập tên mới cho danh sách'
                : 'Nhập tên món thêm'}
            </UText>
          </View>
          <Input
            placeholder={isAddCategories ? 'Danh sách mới' : 'Món thêm mới'}
            rightElement={
              <TouchableOpacity
                onPress={() => {
                  setAddItem('');
                }}>
                <Icons.RemoveIcon />
                <View style={{width: 20}} />
              </TouchableOpacity>
            }
            value={addItem}
            onChangeText={text => {
              setAddItem(text);
            }}
            width={'100%'}
            borderColor={'#FEB7B1'}
            borderRadius={10}
          />
          {!isAddCategories && (
            <Input
              value={addItemPrice.toString()}
              placeholder={'Giá tiền'}
              rightElement={
                <TouchableOpacity
                  onPress={() => {
                    setAddItemPrice('0');
                  }}>
                  <Icons.RemoveIcon />
                  <View style={{width: 20}} />
                </TouchableOpacity>
              }
              onChangeText={text => {
                setAddItemPrice(parseInt(text));
              }}
              width={'100%'}
              borderColor={'#FEB7B1'}
              borderRadius={10}
              keyboardType={'numeric'}
              marginTop={2}
            />
          )}
          <TouchableOpacity
            onPress={async () => {
              try {
                setDisabled(true);
                const formData = new FormData();
                formData.append('name', addItem);
                if (addItemPrice) {
                  formData.append('price', addItemPrice);
                  formData.append('id', id);
                } else {
                  formData.append('category_id', id);
                }
                formData.append('store_id', store_id);
                await axiosClient.post(
                  baseUrl + 'merchant/' + url + '/update',
                  formData,
                  {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  },
                );
                const typeItem = isAddCategories
                  ? 'product-category'
                  : 'add-on';
                const result = await axiosClient.get(
                  baseUrl + 'merchant/' + typeItem + '?store_id=' + store_id,
                );
                setAddItem('');
                setAddItemPrice(0);
                setDisabled(false);
                navigation.goBack();
              } catch (e) {
                console.log(e);
                setDisabled(false);
              }
            }}
            disabled={isDisabled}
            style={{
              width: 150,
              backgroundColor: '#FEB7B1',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            <UText style={{fontWeight: '700', color: 'white'}}>Cập nhập</UText>
          </TouchableOpacity>
        </View>
      </View>
      <YesNoModal
        icon={<Icons.ErrorIcon />}
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
        message={'Không thể xóa do đang có món ăn thuộc danh sách này'}
        title={'Thông báo lỗi'}
        onActionLeft={() => {
          setVisibleWarning(false);
        }}
        onActionRight={() => {
          setVisibleWarning(false);
        }}
        btnTextLeft={'Xác nhận'}
        style={{flexDirection: 'column'}}
      />
    </View>
  );
};

export default UpdateItem;
