import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import HeaderComp from '../../../components/HeaderComp';
import { Box, Center, Image } from 'native-base';
import CameraIcon from '../../../assets/svg/camera.svg';
import { Images } from '../../../components/helpers/resources';
import { ActionSheetRef } from '../../../components/ActionSheet';
import ImageCropPicker from 'react-native-image-crop-picker';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import Icons from '../../../components/icons';
import EInput from '../../../components/EInput';
import { formatNumber } from '../../../components/helper';
import EText from '../../../components/EText';
import { MAX_FOOD_PRICE } from '../../../components/helper/constants';
import Helper from '../../../components/helpers/helper';
import ECheckbox from '../../../components/ECheckbox';
import AddCategory from './AddCategory';

const ProductMerchant = () => {
    const scrollViewRef = React.useRef<ScrollView>(null);
    const openGalleryRef = React.useRef<ActionSheetRef>(null);
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

    /**
     * onSelectCategoryPress
     * @param id number
     * @param value ECheckboxData
     */
    const onSelectCategoryPress = React.useCallback(
        (id: number) => (value) => {
            const isSelected = value[id];
            if (isSelected) {

            } else {

            }
        },
        [],
    );

    const fetchData = async () => {

    }

    useEffect(() => {
        fetchData();
    }, []);

    return (<View style={styles.container} ref={masterViewRef}>
        <HeaderComp title="Mon an" />
        <ScrollView
            style={{ flex: 1, backgroundColor: 'white' }}
            ref={scrollViewRef}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps={'handled'}
        >
            {/* Banner */}
            <View style={styles.banner}>
                <FastImage
                    source={require('../../../assets/img/no-food.png')}
                    style={{
                        width: 200,
                        flex: 1,
                    }}
                    resizeMode={'contain'}
                />
                <TouchableOpacity style={styles.changeBanner} onPress={onCoverImagePress} activeOpacity={1}>
                    <Icons.CameraIcon />
                </TouchableOpacity>
            </View>
            {/* food information */}
            <View style={{ paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#fff' }}>
                {/* food's name */}
                <EInput
                    ref={foodNameRef}
                    value={''}
                    label={`Tên Sản phẩm`}
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
                    placeholder={`Sản phẩm mới của cửa hàng`}
                    onChangeText={onFoodInfoTextChange('name')}
                />

                {/* food's description */}
                <EInput
                    ref={foodDescriptionRef}
                    value={''}
                    label={`Mô tả sản phẩm`}
                    maxLength={255}
                    labelStyle={{
                        fontWeight: '700',
                        fontSize: 14,
                        color: '#010F07',
                    }}
                    _input={{
                        height: 100,
                        margin: 16,
                        textAlignVertical: 'top',
                    }}
                    multiline={true}
                    numberOfLines={5}
                    _container={{
                        marginBottom: 16,
                    }}
                    _focused={{
                        borderWidth: 1,
                        borderColor: '#4285F4',
                    }}
                    require={true}
                    variant="outline"
                    placeholder={`Thêm mô tả của sản phẩm`}
                    onChangeText={onFoodInfoTextChange('description')}
                />

                {/* food's price */}
                <EInput
                    ref={foodPriceRef}
                    value={''}
                    label={`Giá sản phẩm`}
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
                        marginLeft: 16,
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
                    placeholder={`Nhập giá sản phẩm`}
                    onChangeText={onFoodInfoTextChange('price')}
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
                        paddingHorizontal: 16,
                        paddingVertical: 18,
                        marginTop: 8,
                    }}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <EText
                            style={{
                                fontWeight: '700',
                                fontSize: 16,
                                color: '#010F07',
                            }}
                        >
                            Chọn danh sách
                        </EText>
                        <EText style={styles.require}> *</EText>
                    </View>

                    <View style={{ marginTop: 16 }}>
                        {(category?.data || []).map(item => {
                            return (
                                <ECheckbox
                                    key={item.product_category_id}
                                    name={String(item.product_category_id)}
                                    onChange={onSelectCategoryPress(item.product_category_id)}
                                    _container={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        minHeight: 50,
                                    }}
                                    _uncheck={{
                                        borderRadius: 1,
                                        borderColor: item.status === 'isProcessing' ? '#979797' : '#000',
                                        borderWidth: 1,
                                    }}
                                    disabled={item.status === 'isProcessing'}
                                    _checked={{
                                        borderRadius: 2,
                                    }}
                                >
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                        <EText
                                            style={{
                                                flex: 1,
                                                fontWeight: '400',
                                                fontSize: 16,
                                                color: item.status === 'isProcessing' ? '#979797' : '#010F07',
                                                opacity: 0.84,
                                                marginLeft: 20,
                                                paddingVertical: 10,
                                            }}
                                        >
                                            {item.name}
                                        </EText>
                                        {item.status === 'isProcessing' && <ActivityIndicator />}
                                    </View>
                                </ECheckbox>
                            );
                        })}
                        {/* Add new category */}
                        <AddCategory />
                    </View>
                </View>
            </View>
        </ScrollView>
    </View>)
}

export default ProductMerchant;