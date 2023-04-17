import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Input, VStack, Icon, Text, HStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, ScrollView, BackHandler} from 'react-native';
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

const AddItems = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const {data} = useRoute<RouteProp<MainStackParamList, 'AddItems'>>()?.params;
  const {addons, isAddCategories, products, store_id} = data;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visible, setVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const [addItem, setAddItem] = useState('');
  const [addItemPrice, setAddItemPrice] = useState('0');
  const [isDisabled, setDisabled] = useState(false);
  const [item, setItem] = useState(isAddCategories ? products : addons);
  const [visibleWarning, setVisibleWarning] = useState(false);

  const [url, setUrl] = useState(
    isAddCategories ? 'product-category' : 'add-on',
  );

  const showMenu = (id, e) => {
    setSelectedProduct(id);
    setVisible(true);
    setMenuPosition({x: e.nativeEvent.pageX, y: e.nativeEvent.pageY});
  };

  const fetchData = async () => {
    try {
      const typeItem = isAddCategories ? 'product-category' : 'add-on';
      const _result = await axiosClient.get(
        baseUrl + 'merchant/' + typeItem + '?store_id=' + store_id,
      );
      setItem(_result.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  const handleUpdatePress = item => {
    setVisible(false);
  };

  const DataList = ({data}) => {
    return (
      <ScrollView style={{height: 400}}>
        {data.map(item => (
          <View
            key={item.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <VStack style={{marginTop: 16, marginBottom: 8}}>
              <Text style={{fontSize: 16}}>
                {isAddCategories
                  ? item.category_name
                    ? item.category_name
                    : item.name
                  : item.name}
              </Text>

              {item?.price && (
                <Text style={{fontSize: 16}}>
                  {item?.price.toLocaleString()}đ
                </Text>
              )}
            </VStack>
            {selectedProduct === item.id && (
              <Menu
                visible={visible}
                onRequestClose={() => setVisible(false)}
                style={[
                  styles.menuContainer,
                  menuPosition && {
                    top: menuPosition.y,
                    left: menuPosition.x - 90,
                  },
                ]}>
                <MenuItem
                  onPress={() => {
                    const _localItems = {
                      id: item.id,
                      price: item.price,
                      store_id: store_id,
                      isAddCategories: isAddCategories,
                      name: isAddCategories
                        ? item.category_name
                          ? item.category_name
                          : item.name
                        : item.name,
                    };
                    navigation.navigate('UpdateItem', {
                      data: _localItems,
                    });
                  }}>
                  Cập nhập
                </MenuItem>
                <MenuItem
                  onPress={async () => {
                    try {
                      await axiosClient.post(
                        baseUrl + 'merchant/' + url + '/delete',
                        {
                          id: item.id,
                        },
                      );
                      const typeItem = isAddCategories
                        ? 'product-category'
                        : 'add-on';
                      const _result = await axiosClient.get(
                        baseUrl +
                          'merchant/' +
                          typeItem +
                          '?store_id=' +
                          store_id,
                      );
                      setItem(_result.data.data);
                    } catch (e) {
                      setVisibleWarning(true);
                    }
                  }}>
                  xoá
                </MenuItem>
              </Menu>
            )}
            <TouchableOpacity
              onPress={e => showMenu(item.id, e)}
              style={{
                height: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 20}}>
                <Icons.ThreeHorizontalDot />
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View>
      <View>
        <HeaderComp
          title={isAddCategories ? 'Danh sách mới' : 'Món Thêm'}
          onPressBack={() => {
            navigation.goBack();
          }}
        />
      </View>
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
              placeholder={'Giá tiền'}
              rightElement={
                <TouchableOpacity
                  onPress={() => {
                    setAddItemPrice(0);
                  }}>
                  <Icons.RemoveIcon />
                  <View style={{width: 20}} />
                </TouchableOpacity>
              }
              value={addItemPrice}
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
                  formData.append('price', parseInt(addItemPrice));
                }
                formData.append('store_id', store_id);
                await axiosClient.post(
                  baseUrl + 'merchant/' + url + '/create',
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
                setAddItemPrice('0');
                setItem(result.data.data);
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
            <UText style={{fontWeight: '700', color: 'white'}}>Thêm</UText>
          </TouchableOpacity>
        </View>
        <UText style={{fontWeight: '700', fontSize: 16, marginTop: 20}}>
          {isAddCategories ? 'Danh sách đã tạo' : 'Món thêm đã tạo'}
        </UText>
        {item && <DataList data={item} />}
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

export default AddItems;
