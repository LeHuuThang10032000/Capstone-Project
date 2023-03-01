import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import HeaderComp from '../../../components/HeaderComp';
import { Box, Center, Image, usePropsResolutionTest } from 'native-base';
import { Button } from 'react-native';
import CameraIcon from '../../../assets/svg/camera.svg';
import { Images } from '../../../components/helpers/resources';
import { ActionSheetRef } from '../../../components/ActionSheet';
import ImageCropPicker from 'react-native-image-crop-picker';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import EInput from '../../../components/EInput';
import { formatNumber } from '../../../components/helper';
import EText from '../../../components/EText';
import { MAX_FOOD_PRICE } from '../../../components/helper/constants';
import Helper from '../../../components/helpers/helper';
import ECheckbox from '../../../components/ECheckbox';
import AddCategory from './AddCategory';
import { CheckBox, Input } from 'react-native-elements';
import Icons from '../../../components/Icons';
import { UText } from '../../../components/UText';
import { MainStackParamList } from '../../../stack/Navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import { axiosClient } from '../../../components/apis/axiosClient';
import { baseUrl } from '../../../components/apis/baseUrl';

const ProductMerchant = () => {
    const scrollViewRef = React.useRef<ScrollView>(null);
    const openGalleryRef = React.useRef<ActionSheetRef>(null);
    const { data } =
        useRoute<RouteProp<MainStackParamList, 'WithDraw'>>()?.params;

    // const foodCategories = React.useMemo(() => food.category || [], [food.category]);
    // const foodVariations = React.useMemo(() => food?.variations || [], [food?.variations]);
    const foodNameRef = React.useRef<TextInput>(null);
    const foodDescriptionRef = React.useRef<TextInput>(null);
    const foodPriceRef = React.useRef<TextInput>(null);
    const foodCategoryRef = React.useRef<TextInput>(null);
    const foodAttributeRef = React.useRef<TextInput>(null);
    const masterViewRef = React.useRef<View>(null);
    const [image, setImage] = useState({});
    const [category, setCategory] = useState({});
    console.log(data);

    const [selectedOption, setSelectedOption] = useState({});
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [name, setName] = useState('');
    const [cost, setCost] = useState('');

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleOptionsSelect = (option) => {
        if (selectedOptions.includes(option.id)) {
            setSelectedOptions(selectedOptions.filter((id) => id !== option.id));
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

    return (
        <View style={styles.container} ref={masterViewRef}>
            <HeaderComp title="Món ăn" />
            <ScrollView
                style={{ flex: 1, backgroundColor: 'white' }}
                ref={scrollViewRef}
                scrollEventThrottle={16}
                keyboardShouldPersistTaps={'handled'}
            >
                {/* Banner */}
                <View style={styles.banner}>
                    <FastImage
                        source={image?.path ? { uri: image?.path } : require('../../../assets/img/no-food.png')}
                        style={{
                            width: 200,
                            flex: 1,
                        }}
                        resizeMode={'contain'}
                    />
                    <TouchableOpacity style={styles.changeBanner} onPress={ChoosePhotoFromLibrary} activeOpacity={1}>
                        <Icons.CameraIcon />
                    </TouchableOpacity>
                </View>
                {/* food information */}
                <View style={{ paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#fff' }}>
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
                        placeholder={`Món ăn mới của Quán`}
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
                        placeholder={`Giá món ăn`}
                        onChangeText={(text) => {
                            setCost(text)
                        }}
                        rightComponent={
                            <EText
                                style={{
                                    paddingRight: 16,
                                    fontSize: 14,
                                    color: '#00000090',
                                }}
                            >
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
                        }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <EText
                                style={{
                                    fontWeight: '700',
                                    fontSize: 16,
                                    color: '#010F07',
                                }}
                            >
                                Chọn danh sách
                            </EText>
                        </View>

                        <View style={{ marginTop: 16 }}>
                            {data.products.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    onPress={() => handleOptionSelect(option)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginVertical: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            height: 20,
                                            width: 20,
                                            borderRadius: 3,
                                            borderWidth: 1,
                                            marginRight: 10,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderColor: '#4285F4'
                                        }}
                                    >
                                        {selectedOption.id === option.id && (
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
                                    <Text style={{ color: 'black', fontSize: 16 }}>{option.name}</Text>
                                </TouchableOpacity>
                            ))}

                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 30 }}>
                            <EText
                                style={{
                                    fontWeight: '700',
                                    fontSize: 16,
                                    color: '#010F07',
                                }}
                            >
                                Món thêm
                            </EText>
                        </View>

                        <View style={{ marginTop: 16 }}>

                            <View>
                                {data.addons.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        onPress={() => handleOptionsSelect(option)}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginVertical: 10,
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: 20,
                                                width: 20,
                                                borderRadius: 3,
                                                borderWidth: 1,
                                                marginRight: 10,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderColor: '#4285F4'
                                            }}
                                        >
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
                                        <Text style={{ color: 'black', fontSize: 16 }}>{option.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ width: '100%', paddingHorizontal: 26 }}>
                    <TouchableOpacity style={{
                        alignSelf: 'center', paddingVertical: 20,
                        backgroundColor: '#B5EAD8', width: '100%', justifyContent: 'center', flexDirection: 'row',
                        borderRadius: 10
                    }}
                        onPress={async () => {
                            const addOns = [];
                            const categories = [];
                            let totalPrice = 0;
                            selectedOptions.forEach(item => {
                                data.addons.map((_item) => {
                                    if (item == _item.id) {
                                        totalPrice += _item.price;
                                        addOns.push({ "id": _item.id });
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
                            formData.append('name', name);
                            formData.append('price', totalPrice);
                            formData.append('category_id', selectedOption.id);
                            formData.append('store_id', data.store_id);
                            formData.append('add_ons', addOns);
                            const result = await axiosClient.post('https://zennoshop.cf/api/user/merchant/product/create',
                                formData,
                                {
                                    headers: { 'content-type': 'multipart/form-data' },
                                },);

                            console.log(result);

                        }}>
                        <Text>Tạo món mới</Text></TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

export default ProductMerchant;