import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {HStack, Input, VStack} from 'native-base';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import HeaderComp from '../../../../components/HeaderComp';
import StagePromo from '../../../../components/helpers/StagePromo';
import Icons from '../../../../components/Icons';
import {UText} from '../../../../components/UText';
import {
  MainStackNavigation,
  MainStackParamList,
} from '../../../../stack/Navigation';
import {SelectList} from 'react-native-dropdown-select-list';
import DatePicker from 'react-native-date-picker';
import {axiosClient} from '../../../../components/apis/axiosClient';
import {baseUrl} from '../../../../components/apis/baseUrl';
import YesNoModal from '../../../../components/YesNoModal';
import Colors from '../../../../components/helpers/Colors';
import moment from 'moment';

const CreatePromo = () => {
  const PROMOS = [
    'MENU',
    'TYPE_1',
    'TYPE_2',
    'TYPE_3',
    'TYPE_4',
    'TYPE_5',
    'TYPE_6',
    'TYPE_7',
    'TYPE_8',
    'TYPE_9',
  ];

  const navigation = useNavigation<MainStackNavigation>();
  const {id, data} =
    useRoute<RouteProp<MainStackParamList, 'WithDraw'>>()?.params;

  const [page, setPage] = useState(
    data
      ? data?.discount_type === 'percentage'
        ? PROMOS[1]
        : PROMOS[4]
      : PROMOS[0],
  );
  var today = new Date();
  const [dropdownOptionSelect, setDropdownOptionSelect] = useState('');
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(
    new Date(today.getTime() + 24 * 60 * 60 * 1000),
  );
  const [openDateStart, setOpenDateStart] = useState(false);
  const [openDateEnd, setOpenDateEnd] = useState(false);

  const [code, setCode] = useState(Math.random().toString(36));
  const [startDate, setStartDate] = useState(
    data ? data.start_date : new Date().toISOString().slice(0, 10),
  );
  const [startDateError, setStartDateError] = useState('');
  const [endDate, setEndDate] = useState(
    data?.end_date
      ? data.end_date
      : new Date(today.getTime() + 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10),
  );

  const [endDateError, setEndDateError] = useState('');
  const [startTime, setStartTime] = useState('01:00:00');
  const [endTime, setEndTime] = useState('23:59:59');
  const [openStartTime, setOpenStartTime] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);
  const [discount, setDiscount] = useState(data ? data.discount : 0);
  const [discountError, setDiscountError] = useState('');
  const [discountType, setDiscountType] = useState(
    data ? data.discount_type : '',
  );
  const [maxDiscount, setMaxDiscount] = useState(data ? data.max_discount : 0);
  const [maxDiscountError, setMaxDiscountError] = useState('');
  const [minPurchase, setMinPurchase] = useState(data ? data.min_purchase : 0);
  const [minPurchaseError, setMinPurchaseError] = useState('');
  const [isLimit, setlimited] = useState(false);
  const [limit, setLimit] = useState(data ? data.limit : 0);
  const [amount, setAmount] = useState(0);
  const [limitError, setLimitError] = useState('');
  const [previous, setPrevious] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [visibleWarning, setVisibleWarning] = useState(false);

  const [title, setTitle] = useState('Tạo mã giảm giá');
  let previousPage = () => {
    if (!previous) {
      navigation.goBack();
    } else {
      console.log(previous);

      setPage(previous);
    }
  };

  const dropdownOptions = [
    {key: '1', value: 'Không giới hạn (mặc định)'},
    {key: '2', value: 'Có giới hạn'},
  ];

  const Element = ({icon, title, desc, onPress}) => {
    return (
      <>
        <TouchableOpacity
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={onPress}>
          <HStack
            alignItems={'center'}
            width={'95%'}
            justifyContent={'space-between'}>
            <HStack alignItems={'center'}>
              {icon}
              <VStack style={{marginLeft: 10}}>
                <UText>{title}</UText>
                <UText style={{fontSize: 11}}>{desc}</UText>
              </VStack>
            </HStack>
            <Icons.RightArrow />
          </HStack>
        </TouchableOpacity>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#E4E9F2',
            width: '95%',
            marginVertical: 20,
          }}
        />
      </>
    );
  };

  const Case = useMemo(() => {
    switch (page) {
      case PROMOS[0]:
        setStartDate('');
        setEndDate('');
        setDiscount(0);
        setMaxDiscount(0);
        setMinPurchase(0);
        setPrevious('');
        return (
          <>
            <UText style={{marginLeft: 10, marginBottom: 10, marginTop: 30}}>
              Chọn loại mã
            </UText>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <Element
                icon={<Icons.PercentPromo />}
                title={'Giảm phần trăm giá'}
                desc={'Ưu đãi sẽ giảm tiền được tính'}
                onPress={() => setPage(PROMOS[1])}
              />
              <Element
                icon={<Icons.DollarsIcon />}
                title={'Giảm khoản tiền cụ thể'}
                desc={'Áp dụng ưu đãi sẽ trừ số tiền nhất định'}
                onPress={() => setPage(PROMOS[4])}
              />
            </View>
          </>
        );
      case PROMOS[1]:
        setPrevious(PROMOS[0]);
        setDiscountType('percentage');
        return (
          <>
            <ScrollView style={{height: ' 100%'}}>
              <VStack alignItems={'center'}>
                <View style={{marginVertical: 20}}>
                  <StagePromo.StageOne />
                </View>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#F7F9FC',
                    padding: 16,
                  }}>
                  <UText>Chi tiết giảm giá</UText>
                </View>
                <HStack
                  width={'100%'}
                  justifyContent={'space-between'}
                  style={{padding: 16}}>
                  <UText>Mã giảm giá</UText>
                  <View
                    style={{
                      borderWidth: 1,
                      padding: 5,
                      borderColor: '#4285F4',
                    }}>
                    <UText>{code}</UText>
                  </View>
                </HStack>
                <VStack
                  width={'100%'}
                  justifyContent={'space-between'}
                  style={{padding: 16}}>
                  <UText>Nhập giá trị giảm giá trên tổng đơn hàng</UText>
                  <Input
                    defaultValue={discount.toString()}
                    borderRadius={10}
                    rightElement={<UText style={{marginRight: 10}}>%</UText>}
                    keyboardType={'decimal-pad'}
                    onSubmitEditing={event => {
                      if (event.nativeEvent.text.length > 0) {
                        if (
                          parseInt(event.nativeEvent.text.replace('%', '')) <
                          100
                        ) {
                          setDiscountError('');
                          const result = parseInt(event.nativeEvent.text);
                          setDiscount(result);
                        } else {
                          setDiscountError('Không được vượt quá 100%');
                        }
                      } else {
                        setDiscount(10);
                      }
                    }}
                  />
                  {discountError && (
                    <UText style={{color: 'red'}}>{discountError}</UText>
                  )}
                </VStack>
                <VStack
                  width={'100%'}
                  justifyContent={'space-between'}
                  style={{padding: 16}}>
                  <UText>Hoặc chọn giá trị giảm giá </UText>
                  <HStack justifyContent={'space-between'}>
                    <TouchableOpacity
                      style={{
                        borderRadius: 50,
                        borderWidth: 1,
                        borderColor: '#E4E9F2',
                        width: 80,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        setDiscountError('');
                        setDiscount(5);
                      }}>
                      <UText>5%</UText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        borderRadius: 50,
                        borderWidth: 1,
                        borderColor: '#E4E9F2',
                        width: 80,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        setDiscountError('');
                        setDiscount(10);
                      }}>
                      <UText>10%</UText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        borderRadius: 50,
                        borderWidth: 1,
                        borderColor: '#E4E9F2',
                        width: 80,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        setDiscountError('');
                        setDiscount(15);
                      }}>
                      <UText>15%</UText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        borderRadius: 50,
                        borderWidth: 1,
                        borderColor: '#E4E9F2',
                        width: 80,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        setDiscountError('');
                        setDiscount(20);
                      }}>
                      <UText>20%</UText>
                    </TouchableOpacity>
                  </HStack>
                </VStack>
                <VStack
                  width={'100%'}
                  justifyContent={'space-between'}
                  style={{padding: 16}}>
                  <UText>Trị giá đơn hàng tối thiểu</UText>
                  <Input
                    rightElement={<UText style={{marginRight: 10}}>đ</UText>}
                    defaultValue={minPurchase.toLocaleString()}
                    borderRadius={10}
                    keyboardType={'decimal-pad'}
                    onSubmitEditing={event => {
                      if (event.nativeEvent.text.length > 0) {
                        if (parseInt(event.nativeEvent.text) > 0) {
                          setMinPurchaseError('');
                          const result = parseInt(event.nativeEvent.text);
                          setMinPurchase(result);
                        } else {
                          setMinPurchaseError('Không được bé hơn hoặc bằng 0');
                        }
                      } else {
                        setMinPurchase(1);
                      }
                    }}
                  />
                  {minPurchaseError && (
                    <UText style={{color: 'red'}}>{minPurchaseError}</UText>
                  )}
                </VStack>
                <VStack
                  width={'100%'}
                  justifyContent={'space-between'}
                  style={{padding: 16}}>
                  <UText>Nhập giá trị giảm tối đa</UText>
                  <Input
                    defaultValue={maxDiscount.toLocaleString()}
                    rightElement={<UText style={{marginRight: 10}}>đ</UText>}
                    borderRadius={10}
                    keyboardType={'decimal-pad'}
                    onSubmitEditing={event => {
                      if (event.nativeEvent.text.length > 0) {
                        if (parseInt(event.nativeEvent.text) > 0) {
                          setMaxDiscountError('');
                          const result = parseInt(event.nativeEvent.text);
                          setMaxDiscount(result);
                        } else {
                          setMaxDiscountError('Không được bé hơn hoặc bằng 0');
                        }
                      } else {
                        setMaxDiscount(0);
                      }
                    }}
                  />
                </VStack>
              </VStack>
            </ScrollView>
            <TouchableOpacity
              style={{
                backgroundColor: '#B5EAD8',
                width: '90%',
                marginHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                bottom: 20,
              }}
              onPress={() => {
                setPage(PROMOS[2]);
              }}>
              <UText style={{fontWeight: '700'}}>Tiếp theo</UText>
            </TouchableOpacity>
          </>
        );
      case PROMOS[2]:
        const currentTime = new Date();
        const time = currentTime.getTime();
        setPrevious(PROMOS[1]);
        return (
          <>
            <ScrollView
              style={{height: '100%', marginBottom: 100, paddingBottom: 20}}>
              <VStack alignItems={'center'}>
                <View style={{marginVertical: 20}}>
                  <StagePromo.StageTwo />
                </View>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#F7F9FC',
                    padding: 16,
                  }}>
                  <UText>Thời gian áp dụng</UText>
                </View>
                <VStack
                  width={'100%'}
                  justifyContent={'space-between'}
                  style={{padding: 16}}>
                  <UText>Bắt đầu</UText>
                  <TouchableOpacity onPress={() => setOpenDateStart(true)}>
                    <Input
                      value={
                        dateStart
                          ? moment(dateStart).format(
                              'DD/MM/YYYY, ddd [lúc] h:mm',
                            )
                          : 'Chọn ngày và thời gian'
                      }
                      borderRadius={10}
                      isReadOnly={true}
                    />
                  </TouchableOpacity>
                  {/* <DatePicker date={date} onDateChange={setDate} /> */}
                  {console.log('openDateStart 123:', openDateStart)}

                  <DatePicker
                    modal
                    open={openDateStart}
                    date={dateStart}
                    onConfirm={date => {
                      setDateStart(date);
                      setStartDate(date.toISOString().slice(0, 10));
                      setOpenDateStart(false);
                      // console.log('openDateStart', startDate);
                    }}
                    onCancel={() => {
                      setOpenDateStart(false);
                    }}
                  />
                  {startDateError && (
                    <UText style={{color: 'red'}}>{startDateError}</UText>
                  )}
                </VStack>
                <VStack
                  width={'100%'}
                  justifyContent={'space-between'}
                  style={{padding: 16}}>
                  <UText>Kết thúc</UText>
                  <TouchableOpacity onPress={() => setOpenDateEnd(true)}>
                    <Input
                      value={
                        dateEnd
                          ? moment(dateEnd).format('DD/MM/YYYY, ddd [lúc] h:mm')
                          : 'Chọn ngày và thời gian'
                      }
                      borderRadius={10}
                      isReadOnly={true}
                    />
                  </TouchableOpacity>
                  {/* <DatePicker date={date} onDateChange={setDate} /> */}
                  <DatePicker
                    modal
                    open={openDateEnd}
                    date={dateEnd}
                    onConfirm={date => {
                      setDateEnd(date);
                      setEndDate(date.toISOString().slice(0, 10));
                      setOpenDateEnd(false);
                    }}
                    onCancel={() => {
                      setOpenDateEnd(false);
                    }}
                  />
                  {endDateError && (
                    <UText style={{color: 'red'}}>{endDateError}</UText>
                  )}
                </VStack>

                <UText style={{alignSelf: 'flex-start', marginLeft: 16}}>
                  Thời gian áp dụng
                </UText>
                <VStack
                  width={'100%'}
                  justifyContent={'space-between'}
                  style={{padding: 16}}>
                  <UText>Giờ bắt đầu</UText>
                  <TouchableOpacity
                    onPress={() => {
                      setOpenStartTime(true);
                    }}>
                    <Input
                      value={startTime ? startTime : 'Chọn ngày và thời gian'}
                      borderRadius={10}
                      isReadOnly={true}
                    />
                  </TouchableOpacity>

                  <DatePicker
                    modal
                    mode="time"
                    open={openStartTime}
                    date={new Date()}
                    onConfirm={date => {
                      setStartTime(date.toTimeString().split(' ')[0]);
                      setOpenStartTime(false);
                    }}
                    onCancel={() => {
                      setOpenStartTime(false);
                    }}
                  />
                  {startDateError && (
                    <UText style={{color: 'red'}}>{startDateError}</UText>
                  )}
                </VStack>
                <VStack
                  width={'100%'}
                  justifyContent={'space-between'}
                  style={{padding: 16}}>
                  <UText>Giờ kết thúc</UText>
                  <TouchableOpacity onPress={() => setOpenEndTime(true)}>
                    <Input
                      value={endTime ? endTime : 'Chọn ngày và thời gian'}
                      borderRadius={10}
                      isReadOnly={true}
                    />
                  </TouchableOpacity>
                  {/* <DatePicker date={date} onDateChange={setDate} /> */}
                  <DatePicker
                    modal
                    mode="time"
                    open={openEndTime}
                    date={new Date()}
                    onConfirm={date => {
                      setEndTime(date.toTimeString().split(' ')[0]);
                      setOpenStartTime(false);
                    }}
                    onCancel={() => {
                      setOpenEndTime(false);
                    }}
                  />
                  {endDateError && (
                    <UText style={{color: 'red'}}>{endDateError}</UText>
                  )}
                </VStack>

                <VStack
                  width={'100%'}
                  justifyContent={'space-between'}
                  style={{padding: 16}}>
                  <UText>Giới hạn mã giảm giá (không bắt buộc)</UText>
                  <SelectList
                    placeholder="Chọn mã giảm giá"
                    setSelected={val => {
                      if (parseInt(val) !== 1) {
                        setlimited(true);
                      } else {
                        setlimited(false);
                      }
                      setDropdownOptionSelect(val);
                    }}
                    data={dropdownOptions}
                    save="key"
                  />
                  <View style={{height: 20}} />
                  {isLimit && (
                    <Input
                      defaultValue={amount.toString()}
                      borderRadius={10}
                      keyboardType={'decimal-pad'}
                      onSubmitEditing={event => {
                        if (event.nativeEvent.text.length > 0) {
                          if (parseInt(event.nativeEvent.text) > 0) {
                            setDiscountError('');
                            const result = parseInt(event.nativeEvent.text);
                            setAmount(result);
                          } else {
                            setDiscountError('Không được dưới 0');
                          }
                        } else {
                          setDiscount(10);
                        }
                      }}
                    />
                  )}
                </VStack>
              </VStack>
            </ScrollView>
            <TouchableOpacity
              style={{
                backgroundColor: '#B5EAD8',
                width: '90%',
                marginHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                position: 'absolute',
                bottom: 20,
              }}
              onPress={async () => {
                if (!startDateError && !endDateError) {
                  const time = new Date();
                  const formData = new FormData();
                  formData.append('store_id', id);
                  formData.append('code', code);
                  formData.append(
                    'start_date',
                    startDate ? startDate : time.toISOString().slice(0, 10),
                  );
                  formData.append(
                    'end_date',
                    endDate
                      ? endDate
                      : new Date(today.getTime() + 24 * 60 * 60 * 1000)
                          .toISOString()
                          .slice(0, 10),
                  );
                  formData.append('start_time', startTime);
                  formData.append('end_time', endTime);
                  formData.append('discount', discount);
                  formData.append('discount_type', discountType);
                  formData.append('max_discount', maxDiscount);
                  formData.append('min_purchase', minPurchase);

                  if (!limit) {
                    formData.append('limit', amount);
                  } else {
                    formData.append('limit', 0);
                  }
                  console.log(formData);

                  try {
                    if (data) {
                      if (data?.id) {
                        formData.append('promo_id', data.id);
                        const result = await axiosClient.post(
                          baseUrl + 'merchant/promocode/update',
                          formData,
                          {
                            headers: {'content-type': 'multipart/form-data'},
                          },
                        );
                        setPage(PROMOS[3]);
                      }
                    } else {
                      const result = await axiosClient.post(
                        baseUrl + 'merchant/promocode/create',
                        formData,
                        {
                          headers: {'content-type': 'multipart/form-data'},
                        },
                      );
                      setPage(PROMOS[3]);
                    }
                  } catch (e) {
                    setGeneralError(e?.error);
                    setVisibleWarning(true);
                  }
                }
              }}>
              <UText style={{fontWeight: '700'}}>Tiếp theo</UText>
            </TouchableOpacity>
          </>
        );
      case PROMOS[3]:
        setTitle('Mã giảm giá');
        const _time = new Date();
        setPrevious('');
        return (
          <>
            <ScrollView style={{height: '100%', marginBottom: 100}}>
              <VStack backgroundColor={'white'} height={'100%'}>
                <View>
                  <HStack
                    justifyContent={'space-between'}
                    backgroundColor={'#F7F9FC'}
                    style={{padding: 16}}>
                    <UText
                      style={{
                        fontSize: 20,
                        color: '#818181',
                        fontWeight: 'bold',
                      }}>
                      Giá trị của mã giảm giá
                    </UText>
                    <UText style={{color: '#4285F4'}}>Chỉnh sửa</UText>
                  </HStack>
                  <VStack
                    justifyContent={'space-between'}
                    style={{padding: 16}}>
                    <UText>Giá trị của mã giảm giá</UText>
                    <UText>{discount}% trên tổng hoá đơn</UText>
                  </VStack>
                  <HStack
                    justifyContent={'space-between'}
                    backgroundColor={'#F7F9FC'}
                    style={{padding: 16}}>
                    <UText
                      style={{
                        fontSize: 20,
                        color: '#818181',
                        fontWeight: 'bold',
                      }}>
                      Điều kiện giảm giá
                    </UText>
                    <UText style={{color: '#4285F4'}}>Chỉnh sửa </UText>
                  </HStack>
                  <VStack style={{paddingHorizontal: 16}}>
                    <VStack style={{paddingVertical: 16}}>
                      <UText style={{fontSize: 14, color: '#818181'}}>
                        Ngày và thời gian bắt đầu{' '}
                      </UText>
                      <UText>
                        {startDate
                          ? startDate
                          : _time.toISOString().slice(0, 10)}{' '}
                        {startTime}
                      </UText>
                      <View
                        style={{
                          height: 1,
                          backgroundColor: '#E4E9F2',
                          width: '100%',
                        }}
                      />
                    </VStack>

                    <VStack style={{paddingVertical: 16}}>
                      <UText style={{fontSize: 14, color: '#818181'}}>
                        Ngày và thời gian kết thúc{' '}
                      </UText>
                      <UText>
                        {endDate ? endDate : _time.toISOString().slice(0, 10)}{' '}
                        {endTime}
                      </UText>
                      <View
                        style={{
                          height: 1,
                          backgroundColor: '#E4E9F2',
                          width: '100%',
                        }}
                      />
                    </VStack>
                  </VStack>
                </View>
              </VStack>
            </ScrollView>

            {data?.id && (
              <TouchableOpacity
                style={{
                  backgroundColor: 'red',
                  width: '90%',
                  marginHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 10,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  position: 'absolute',
                  bottom: 85,
                }}
                onPress={async () => {
                  try {
                    const formData = new FormData();
                    formData.append('promo_id', data?.id);
                    formData.append('store_id', id);
                    const result = await axiosClient.post(
                      baseUrl + 'merchant/promocode/cancel',
                      formData,
                      {
                        headers: {'content-type': 'multipart/form-data'},
                      },
                    );
                  } catch (error) {
                    setVisibleWarning(true);
                    setGeneralError(error?.error);
                  }
                  navigation.goBack();
                }}>
                <UText style={{color: 'white', fontWeight: 'bold'}}>Xoá</UText>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{
                backgroundColor: '#B5EAD8',
                width: '90%',
                marginHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                position: 'absolute',
                bottom: 20,
              }}
              onPress={() => {
                setPage(PROMOS[0]);
              }}>
              <UText style={{fontWeight: 'bold'}}>
                {data?.id
                  ? 'chỉnh sửa mã giảm giá'
                  : 'Xác nhận tạo Mã giảm giá'}
              </UText>
            </TouchableOpacity>
          </>
        );
      case PROMOS[4]:
        setTitle('Tạo mã giảm giá ');
        setPrevious(PROMOS[0]);
        return (
          <>
            <VStack alignItems={'center'} height={'100%'}>
              <View style={{marginVertical: 20}}>
                <StagePromo.StageOne />
              </View>
              <View
                style={{
                  width: '100%',
                  backgroundColor: '#F7F9FC',
                  padding: 16,
                }}>
                <UText>Chi tiết giảm giá</UText>
              </View>
              <VStack
                width={'100%'}
                justifyContent={'space-between'}
                style={{padding: 16}}>
                <UText>Nhập giá trị giảm giá</UText>
                <Input
                  rightElement={<UText style={{marginRight: 10}}>đ</UText>}
                  defaultValue={discount.toLocaleString()}
                  borderRadius={10}
                  keyboardType={'decimal-pad'}
                  onSubmitEditing={event => {
                    if (event.nativeEvent.text.length > 0) {
                      if (parseInt(event.nativeEvent.text) > 0) {
                        setDiscountError('');
                        const result = parseInt(event.nativeEvent.text);
                        setDiscount(result);
                      } else {
                        setDiscountError('Không được dưới 0đ');
                      }
                    } else {
                      setDiscount(0);
                    }
                  }}
                />
                {discountError && (
                  <UText style={{color: 'red'}}>{discountError}</UText>
                )}
              </VStack>
              <VStack
                width={'100%'}
                justifyContent={'space-between'}
                style={{padding: 16}}>
                <UText>Trị giá đơn hàng tối thiểu</UText>
                <Input
                  rightElement={<UText style={{marginRight: 10}}>đ</UText>}
                  defaultValue={minPurchase.toLocaleString()}
                  borderRadius={10}
                  keyboardType={'decimal-pad'}
                  onSubmitEditing={event => {
                    const result = parseInt(event.nativeEvent.text);
                    setMinPurchase(result);
                  }}
                />
              </VStack>
            </VStack>
            <TouchableOpacity
              style={{
                backgroundColor: '#B5EAD8',
                width: '90%',
                marginHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                position: 'absolute',
                bottom: 20,
              }}
              onPress={() => {
                setPage(PROMOS[5]);
              }}>
              <UText style={{fontWeight: '700'}}>Tiếp theo</UText>
            </TouchableOpacity>
          </>
        );
      case PROMOS[5]:
        setPrevious(PROMOS[4]);
        return (
          <>
            <ScrollView style={{height: '100%', marginBottom: 100}}>
              <VStack alignItems={'center'}>
                <View style={{marginVertical: 20}}>
                  <StagePromo.StageTwo />
                </View>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#F7F9FC',
                    padding: 16,
                  }}>
                  <UText>Thời gian giảm giá</UText>
                </View>
                <VStack
                  width={'100%'}
                  justifyContent={'space-between'}
                  style={{padding: 16}}>
                  <UText>Bắt đầu</UText>
                  <TouchableOpacity onPress={() => setOpenDateStart(true)}>
                    <Input
                      value={
                        dateStart
                          ? moment(dateStart).format(
                              'DD/MM/YYYY, ddd [lúc] HH:mm',
                            )
                          : 'Chọn ngày và thời gian'
                      }
                      borderRadius={10}
                      isReadOnly={true}
                    />
                  </TouchableOpacity>

                  <DatePicker
                    modal
                    open={openDateStart}
                    date={dateStart}
                    onConfirm={date => {
                      setStartDateError('');
                      setDateStart(date);
                      setStartDate(date.toISOString().slice(0, 10));
                      setOpenDateStart(false);
                      // console.log('openDateStart', startDate);
                    }}
                    onCancel={() => {
                      setOpenDateStart(false);
                    }}
                  />
                  {startDateError && (
                    <UText style={{color: 'red'}}>{startDateError}</UText>
                  )}
                </VStack>
                <VStack
                  width={'100%'}
                  justifyContent={'space-between'}
                  style={{padding: 16}}>
                  <UText>Kết thúc</UText>
                  <TouchableOpacity onPress={() => setOpenDateEnd(true)}>
                    <Input
                      value={
                        dateEnd
                          ? moment(dateEnd).format(
                              'DD/MM/YYYY, ddd [lúc] HH:mm',
                            )
                          : 'Chọn ngày và thời gian'
                      }
                      borderRadius={10}
                      isReadOnly={true}
                    />
                  </TouchableOpacity>
                  {/* <DatePicker date={date} onDateChange={setDate} /> */}
                  <DatePicker
                    modal
                    open={openDateEnd}
                    date={dateEnd}
                    onConfirm={date => {
                      setEndDateError('');
                      setDateEnd(date);
                      setEndDate(date.toISOString().slice(0, 10));
                      setOpenDateEnd(false);
                    }}
                    onCancel={() => {
                      setOpenDateEnd(false);
                    }}
                  />
                  {endDateError && (
                    <UText style={{color: 'red'}}>{endDateError}</UText>
                  )}
                </VStack>
                <HStack
                  width={'100%'}
                  justifyContent={'space-between'}
                  style={{padding: 16}}
                  borderBottomColor={'#E4E9F2'}
                  borderBottomWidth={1}
                  paddingBottom={2}
                  marginBottom={0}>
                  <VStack>
                    <UText>Thời gian áp dụng</UText>
                    <UText style={{fontSize: 12, color: '#818181'}}>
                      Vào khung giờ mở cửa bán
                    </UText>
                  </VStack>
                </HStack>
                <VStack
                  width={'100%'}
                  justifyContent={'space-between'}
                  style={{padding: 16}}>
                  <UText>Giới hạn mã giảm giá (không bắt buộc)</UText>
                  <SelectList
                    placeholder="Chọn mã giảm giá"
                    setSelected={val => {
                      if (parseInt(val) !== 1) {
                        setlimited(true);
                      } else {
                        setlimited(false);
                      }
                      setDropdownOptionSelect(val);
                    }}
                    data={dropdownOptions}
                    save="key"
                  />
                  <View style={{height: 20}} />
                  {isLimit && (
                    <Input
                      defaultValue={amount.toString()}
                      borderRadius={10}
                      keyboardType={'decimal-pad'}
                      onSubmitEditing={event => {
                        if (event.nativeEvent.text.length > 0) {
                          if (parseInt(event.nativeEvent.text) > 0) {
                            setDiscountError('');
                            const result = parseInt(event.nativeEvent.text);
                            setAmount(result);
                          } else {
                            setDiscountError('Không được dưới 0');
                          }
                        } else {
                          setDiscount(10);
                        }
                      }}
                    />
                  )}
                </VStack>
              </VStack>
            </ScrollView>
            <TouchableOpacity
              style={{
                backgroundColor: '#B5EAD8',
                width: '90%',
                marginHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                position: 'absolute',
                bottom: 20,
              }}
              onPress={async () => {
                if (!startDateError && !endDateError) {
                  const time = new Date();
                  const formData = new FormData();
                  formData.append('store_id', id);
                  formData.append('code', code);
                  formData.append(
                    'start_date',
                    startDate ? startDate : time.toISOString().slice(0, 10),
                  );
                  formData.append(
                    'end_date',
                    endDate
                      ? endDate
                      : new Date(today.getTime() + 24 * 60 * 60 * 1000)
                          .toISOString()
                          .slice(0, 10),
                  );
                  formData.append('start_time', startTime);
                  formData.append('end_time', endTime);
                  formData.append('discount', discount);
                  formData.append('discount_type', 'amount');
                  formData.append('max_discount', 10000);
                  formData.append('min_purchase', minPurchase);

                  if (!limit) {
                    formData.append('limit', amount);
                  } else {
                    formData.append('limit', 0);
                  }
                  console.log(formData);

                  try {
                    if (data) {
                      if (data?.id) {
                        formData.append('promo_id', data.id);
                        await axiosClient.post(
                          baseUrl + 'merchant/promocode/update',
                          formData,
                          {
                            headers: {'content-type': 'multipart/form-data'},
                          },
                        );
                        setPage(PROMOS[6]);
                      }
                    } else {
                      await axiosClient.post(
                        baseUrl + 'merchant/promocode/create',
                        formData,
                        {
                          headers: {'content-type': 'multipart/form-data'},
                        },
                      );
                      setPage(PROMOS[6]);
                    }
                  } catch (e) {
                    setGeneralError(e?.error);
                    setVisibleWarning(true);
                  }
                }
              }}>
              <UText style={{fontWeight: '700'}}>Tiếp theo</UText>
            </TouchableOpacity>
          </>
        );
      case PROMOS[6]:
        setTitle('Xem trước mã giảm giá');
        const __time = new Date();
        setPrevious('');
        return (
          <>
            <VStack backgroundColor={'white'} height={'100%'}>
              <View>
                <HStack
                  justifyContent={'space-between'}
                  backgroundColor={'#F7F9FC'}
                  style={{padding: 16}}>
                  <UText
                    style={{
                      fontSize: 20,
                      color: '#818181',
                      fontWeight: 'bold',
                    }}>
                    Giá trị của mã giảm giá
                  </UText>
                  <UText style={{color: '#4285F4'}}>Chỉnh sửa </UText>
                </HStack>
                <VStack justifyContent={'space-between'} style={{padding: 16}}>
                  <UText>Giá trị của mã giảm giá</UText>
                  <UText>{discount.toLocaleString()}đ trên tổng hoá đơn</UText>
                </VStack>
                <HStack
                  justifyContent={'space-between'}
                  backgroundColor={'#F7F9FC'}
                  style={{padding: 16}}>
                  <UText
                    style={{
                      fontSize: 20,
                      color: '#818181',
                      fontWeight: 'bold',
                    }}>
                    Điều kiện giảm giá
                  </UText>
                  <UText style={{color: '#4285F4'}}>Chỉnh sửa </UText>
                </HStack>
                <VStack style={{paddingHorizontal: 16}}>
                  <VStack style={{paddingVertical: 16}}>
                    <UText style={{fontSize: 14, color: '#818181'}}>
                      Ngày và thời gian bắt đầu{' '}
                    </UText>
                    <UText>
                      {startDate
                        ? moment(startDate).format(
                            'DD/MM/YYYY, ddd [lúc] HH:mm',
                          )
                        : __time.toISOString().slice(0, 10)}{' '}
                      {startTime}
                    </UText>
                    <View
                      style={{
                        height: 1,
                        backgroundColor: '#E4E9F2',
                        width: '100%',
                      }}
                    />
                  </VStack>

                  <VStack style={{paddingVertical: 16}}>
                    <UText style={{fontSize: 14, color: '#818181'}}>
                      Ngày và thời gian kết thúc{' '}
                    </UText>
                    <UText>
                      {endDate
                        ? moment(endDate).format('DD/MM/YYYY, ddd [lúc] HH:mm')
                        : __time.toISOString().slice(0, 10)}{' '}
                      {endTime}
                    </UText>
                    <View
                      style={{
                        height: 1,
                        backgroundColor: '#E4E9F2',
                        width: '100%',
                      }}
                    />
                  </VStack>
                </VStack>
              </View>
            </VStack>
            {data?.id && (
              <TouchableOpacity
                style={{
                  backgroundColor: 'red',
                  width: '90%',
                  marginHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 10,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  position: 'absolute',
                  bottom: 85,
                }}
                onPress={async () => {
                  try {
                    const formData = new FormData();
                    formData.append('promo_id', data?.id);
                    formData.append('store_id', id);
                    const result = await axiosClient.post(
                      baseUrl + 'merchant/promocode/cancel',
                      formData,
                      {
                        headers: {'content-type': 'multipart/form-data'},
                      },
                    );
                  } catch (error) {
                    setVisibleWarning(true);
                    setGeneralError(error?.error);
                  }
                  navigation.goBack();
                }}>
                <UText style={{color: 'white', fontWeight: 'bold'}}>Xoá</UText>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{
                backgroundColor: '#B5EAD8',
                width: '90%',
                marginHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                position: 'absolute',
                bottom: 20,
              }}
              onPress={() => {
                setPage(PROMOS[0]);
              }}>
              <UText style={{fontWeight: 'bold'}}>
                {data?.id
                  ? 'chỉnh sửa mã giảm giá'
                  : 'Xác nhận tạo Mã giảm giá'}
              </UText>
            </TouchableOpacity>
          </>
        );
        setPrevious(PROMOS[8]);
        return (
          <>
            <VStack alignItems={'center'}>
              <View style={{marginVertical: 20}}>
                <StagePromo.StageTwo />
              </View>
              <View
                style={{
                  width: '100%',
                  backgroundColor: '#F7F9FC',
                  padding: 16,
                }}>
                <UText>Thời gian giảm giá</UText>
              </View>
              <VStack
                width={'100%'}
                justifyContent={'space-between'}
                style={{padding: 16}}>
                <UText>Bắt đầu</UText>
                <TouchableOpacity onPress={() => setOpenDateStart(true)}>
                  <Input
                    value={
                      dateStart
                        ? moment(dateStart).format(
                            'DD/MM/YYYY, ddd [lúc] HH:mm',
                          )
                        : 'Chọn ngày và thời gian'
                    }
                    borderRadius={10}
                    isReadOnly={true}
                  />
                </TouchableOpacity>
                {/* <DatePicker date={date} onDateChange={setDate} /> */}
                <DatePicker
                  modal
                  open={openDateStart}
                  date={dateStart}
                  onConfirm={date => {
                    setOpenDateStart(false);
                    setDateStart(date);
                  }}
                  onCancel={() => {
                    setOpenDateStart(false);
                  }}
                />
              </VStack>
              <VStack
                width={'100%'}
                justifyContent={'space-between'}
                style={{padding: 16}}>
                <UText>Kết thúc</UText>
                <TouchableOpacity onPress={() => setOpenDateEnd(true)}>
                  <Input
                    value={
                      dateEnd
                        ? moment(dateEnd).format('DD/MM/YYYY, ddd [lúc] HH:mm')
                        : 'Chọn ngày và thời gian'
                    }
                    borderRadius={10}
                    isReadOnly={true}
                  />
                </TouchableOpacity>
                <DatePicker
                  modal
                  open={openDateEnd}
                  date={dateEnd}
                  onConfirm={date => {
                    setOpenDateEnd(false);
                    setDateEnd(date);
                  }}
                  onCancel={() => {
                    setOpenDateEnd(false);
                  }}
                />
              </VStack>
              <HStack
                width={'100%'}
                justifyContent={'space-between'}
                style={{padding: 16}}
                borderBottomColor={'#E4E9F2'}
                borderBottomWidth={1}
                paddingBottom={2}
                marginBottom={0}>
                <VStack>
                  <UText>Thời gian áp dụng</UText>
                  <UText>Vào khung giờ mở cửa bán</UText>
                </VStack>
              </HStack>
            </VStack>
            <TouchableOpacity
              style={{
                backgroundColor: '#B5EAD8',
                width: '90%',
                marginHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                position: 'absolute',
                bottom: 20,
              }}
              onPress={() => {
                setPage(PROMOS[0]);
              }}>
              <UText>Xác nhận tạo chương trình</UText>
            </TouchableOpacity>
          </>
        );
    }
  }, [
    openEndTime,
    setOpenEndTime,
    openStartTime,
    setOpenStartTime,
    title,
    setTitle,
    page,
    dropdownOptionSelect,
    dateStart,
    setDropdownOptionSelect,
    setDateStart,
    dateEnd,
    setDateEnd,
    openDateStart,
    setOpenDateStart,
    openDateEnd,
    setOpenDateEnd,
    code,
    setCode,
    startDate,
    setStartDate,
    startDateError,
    setStartDateError,
    endDate,
    setEndDate,
    endDateError,
    setEndDateError,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    discount,
    setDiscount,
    discountError,
    setDiscountError,
    discountType,
    setDiscountType,
    maxDiscount,
    setMaxDiscount,
    maxDiscountError,
    setMaxDiscountError,
    minPurchase,
    setMinPurchase,
    minPurchaseError,
    setMinPurchaseError,
    isLimit,
    setlimited,
    limit,
    setLimit,
    amount,
    setAmount,
    limitError,
    setLimitError,
    generalError,
    setGeneralError,
    visibleWarning,
    setVisibleWarning,
    previous,
    setPrevious,
  ]);

  return (
    <View style={{height: '100%', backgroundColor: 'white'}}>
      <HeaderComp title={title} onPressBack={previousPage} />
      {Case}
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
    </View>
  );
};

export default CreatePromo;
