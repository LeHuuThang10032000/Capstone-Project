import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderComp from '../../../components/HeaderComp';
import {Box, Center, Image, usePropsResolutionTest} from 'native-base';
import {Button} from 'react-native';
import CameraIcon from '../../../assets/svg/camera.svg';
import {Images} from '../../../components/helpers/resources';
import {ActionSheetRef} from '../../../components/ActionSheet';
import ImageCropPicker from 'react-native-image-crop-picker';
import styles from './styles';
import {formatNumber} from '../../../components/helper';
import EText from '../../../components/EText';
import {MAX_FOOD_PRICE} from '../../../components/helper/constants';
import Helper from '../../../components/helpers/helper';
import ECheckbox from '../../../components/ECheckbox';
import AddCategory from './AddCategory';
import {CheckBox, Input} from 'react-native-elements';
import Icons from '../../../components/Icons';
import {UText} from '../../../components/UText';
import {
  MainStackNavigation,
  MainStackParamList,
} from '../../../stack/Navigation';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {axiosClient} from '../../../components/apis/axiosClient';
import {baseUrl} from '../../../components/apis/baseUrl';
import EInput from '../../../components/EInput';

const ProductMerchant = () => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const openGalleryRef = React.useRef<ActionSheetRef>(null);
  const {data} = useRoute<RouteProp<MainStackParamList, 'WithDraw'>>()?.params;
  console.log('data', data?.product);

  const navigation = useNavigation<MainStackNavigation>();

  const foodNameRef = React.useRef<TextInput>(null);
  const foodPriceRef = React.useRef<TextInput>(null);
  const foodCategoryRef = React.useRef<TextInput>(null);
  const masterViewRef = React.useRef<View>(null);
  const [image, setImage] = useState(data?.product ?? {});

  const [selectedOption, setSelectedOption] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [editablePriceId, setEditablePriceId] = useState(null);
  const [addOns, setAddons] = useState(data.addons);
  const handleOptionSelect = option => {
    setSelectedOption(option);
  };

  const handleOptionsSelect = option => {
    if (selectedOptions.includes(option.id)) {
      setSelectedOptions(selectedOptions.filter(id => id !== option.id));
    } else {
      setSelectedOptions([...selectedOptions, option.id]);
    }
  };
  /**
   * onSelectedCoverImageHandler
   * @param result ImagePickerResponse
   */
  const ChoosePhotoFromLibrary = async () => {
    const image = await ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    });
    setImage(image);
  };

  /**
   * onSelectImagePress
   */
  const onCoverImagePress = React.useCallback(() => {
    openGalleryRef?.current?.open?.();
  }, []);

  const onFoodInfoTextChange = React.useCallback(
    (key: 'name' | 'description' | 'price') => (text: string) => {
      if (key === 'price') {
        text = Helper.removeNotDigit(text);
        if (text.length > 0) {
          // if price greater than MAX_FOOD_PRICE (2.000.000)
          if (Number(text) > MAX_FOOD_PRICE) {
            // set MAX_FOOD_PRICE for value
            text = String(MAX_FOOD_PRICE);
          }
        }
      }
    },
    [],
  );
  const handlePriceChange = (index, newPrice) => {
    const newAddons = [...addOns];
    let array = [];
    console.log('newPrice', newPrice);

    newAddons.map(item => {
      if (item.id == index) {
        array.push({
          id: index,
          name: item.name,
          price: newPrice,
        });
      } else {
        array.push(item);
      }
    });

    setAddons(array);
    console.log('newAddons', newAddons);
  };

  const validatePrice = price => {
    if (price < 1000 || price > 1000000) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (data?.product?.add_ons) {
      let array = [];
      data.product.add_ons.forEach(element => {
        array.push(element.id);
      });
      setSelectedOptions(array);
    }
  }, []);

  return (
    <View style={styles.container} ref={masterViewRef}>
      <HeaderComp title="Món ăn" />
      <ScrollView
        style={{flex: 1, backgroundColor: 'white'}}
        ref={scrollViewRef}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps={'handled'}>
        {/* Banner */}
        <View style={styles.banner}>
          {image?.image ? (
            <Image
              source={image?.path ? {uri: image?.path} : {uri: image?.image}}
              style={{
                width: 200,
                flex: 1,
              }}
              resizeMode={'contain'}
            />
          ) : (
            <Image
              source={
                image?.path
                  ? {uri: image?.path}
                  : require('../../../assets/img/no-food.png')
              }
              style={{
                width: 200,
                flex: 1,
              }}
              resizeMode={'contain'}
            />
          )}
          <TouchableOpacity
            style={styles.changeBanner}
            onPress={ChoosePhotoFromLibrary}
            activeOpacity={1}>
            <Icons.CameraIcon />
          </TouchableOpacity>
        </View>
        {/* food information */}
        <View
          style={{
            paddingHorizontal: 24,
            paddingVertical: 20,
            backgroundColor: '#fff',
          }}>
          {/* food's name */}
          <EInput
            ref={foodNameRef}
            autoFocus={false}
            maxLength={255}
            labelStyle={{
              fontWeight: '700',
              fontSize: 14,
              color: '#010F07',
            }}
            _input={{
              paddingHorizontal: 16,
            }}
            _container={{
              marginBottom: 16,
            }}
            _focused={{
              borderWidth: 1,
              borderColor: '#4285F4',
            }}
            require={true}
            variant="outline"
            placeholder={
              data.product ? data.product.name : `Món ăn mới của Quán`
            }
            // onChangeText={onFoodInfoTextChange('name')}
            onChangeText={text => {
              setName(text);
            }}
          />

          {/* food's price */}
          <EInput
            ref={foodPriceRef}
            labelStyle={{
              fontWeight: '700',
              fontSize: 14,
              color: '#010F07',
              textTransform: 'capitalize',
            }}
            maxLength={9}
            _input={{
              flex: 1,
              paddingHorizontal: 16,
            }}
            _disabledInput={{
              flex: 1,
              padding: 16,
            }}
            _wrapper={{
              flex: 1,
              marginTop: 0,
            }}
            keyboardType={'number-pad'}
            _container={{
              flexDirection: 'row',
              marginBottom: 16,
              marginTop: 8,
            }}
            _focused={{
              borderColor: '#4285F4',
              flex: 1,
              marginTop: 0,
              marginLeft: 16,
            }}
            require={true}
            variant="outline"
            placeholder={
              data.product ? data.product.price.toString() : `Giá món ăn`
            }
            onChangeText={text => {
              setCost(text);
            }}
            rightComponent={
              <EText
                style={{
                  paddingRight: 16,
                  fontSize: 14,
                  color: '#00000090',
                }}>
                VNĐ
              </EText>
            }
          />

          {/* list */}
          <View
            ref={foodCategoryRef}
            style={{
              backgroundColor: '#fff',
              paddingVertical: 18,
              marginTop: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <EText
                style={{
                  fontWeight: '700',
                  fontSize: 16,
                  color: '#010F07',
                }}>
                Chọn danh sách
              </EText>
            </View>

            <View style={{marginTop: 16}}>
              {data.products.map(option => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => handleOptionSelect(option)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                  }}>
                  <View
                    style={{
                      height: 20,
                      width: 20,
                      borderRadius: 3,
                      borderWidth: 1,
                      marginRight: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderColor: '#4285F4',
                    }}>
                    {selectedOption?.id
                      ? selectedOption.id === option.id && (
                          <View
                            style={{
                              height: '100%',
                              width: '100%',
                              borderRadius: 2,
                              backgroundColor: '#4285F4',
                            }}
                          />
                        )
                      : option.id === data?.product?.category_id && (
                          <View
                            style={{
                              height: '100%',
                              width: '100%',
                              borderRadius: 2,
                              backgroundColor: '#4285F4',
                            }}
                          />
                        )}
                  </View>
                  <Text style={{color: 'black', fontSize: 16}}>
                    {option.category_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{flexDirection: 'row', marginTop: 30}}>
              <EText
                style={{
                  fontWeight: '700',
                  fontSize: 16,
                  color: '#010F07',
                }}>
                Món thêm
              </EText>
            </View>

            <View style={{marginTop: 16}}>
              <View>
                {addOns.map(option => {
                  return (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => handleOptionsSelect(option)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 10,
                      }}>
                      <View
                        style={{
                          height: 20,
                          width: 20,
                          borderRadius: 3,
                          borderWidth: 1,
                          marginRight: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderColor: '#4285F4',
                        }}>
                        {selectedOptions.includes(option.id) && (
                          <View
                            style={{
                              height: '100%',
                              width: '100%',
                              borderRadius: 2,
                              backgroundColor: '#4285F4',
                            }}
                          />
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          width: '85%',
                        }}>
                        <Text
                          style={{color: 'black', fontSize: 16, zIndex: 100}}>
                          {option.name}
                        </Text>
                        {editablePriceId === option.id ? (
                          <TextInput
                            style={{zIndex: 0}}
                            value={option.price}
                            placeholder={String(option.price)}
                            onChangeText={value => {
                              handlePriceChange(option.id, value);
                            }}
                            keyboardType="numeric"
                            // onBlur={event => {
                            //   const newPrice = parseInt(event.nativeEvent.text);
                            //   if (validatePrice(newPrice)) {
                            //     handlePriceChange(option.id, newPrice);
                            //   } else {
                            //     Alert.alert(
                            //       'Price must be between 1000 and 1000000',
                            //     );
                            //   }
                            // }}
                            autoFocus
                            selectTextOnFocus
                          />
                        ) : (
                          <Text onPress={() => setEditablePriceId(option.id)}>
                            {option.price}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
        <View style={{width: '100%', paddingHorizontal: 26}}>
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              paddingVertical: 20,
              backgroundColor: '#B5EAD8',
              width: '100%',
              justifyContent: 'center',
              flexDirection: 'row',
              borderRadius: 10,
            }}
            onPress={async () => {
              const _addOns = [];
              let totalPrice = 0;
              selectedOptions.forEach(item => {
                addOns.map(_item => {
                  if (item == _item.id) {
                    totalPrice += parseInt(_item.price);
                    _addOns.push({id: _item.id});
                  }
                });
              });

              totalPrice += parseInt(cost);
              const formData = new FormData();
              if (image?.path) {
                let fileName = image?.path.split('/');
                fileName = fileName[fileName.length - 1];
                const filename = `${new Date().getTime()}-${fileName}`;
                const file = {
                  uri: image.path,
                  name: filename,
                  type: 'image/png',
                };
                formData.append('image', file);
              }
              formData.append('name', name ? name : data.product.name);
              formData.append(
                'price',
                totalPrice ? totalPrice : data.product.price,
              );
              formData.append(
                'category_id',
                selectedOption.id
                  ? selectedOption.id
                  : data.product.category_id,
              );
              formData.append('store_id', data.store_id);
              formData.append('product_id', data?.product?.id);
              if (_addOns) {
                formData.append('add_ons', JSON.stringify(_addOns));
              }

              console.log(formData);
              const url = data?.isUpdated ? 'update' : 'create';
              const result = await axiosClient.post(
                baseUrl + 'merchant/product/' + url,
                formData,
                {
                  headers: {'content-type': 'multipart/form-data'},
                },
              );

              if (result) {
                navigation.goBack();
              }
            }}>
            <Text> {data?.isUpdated ? 'cập nhập món' : 'Tạo món mới'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductMerchant;
