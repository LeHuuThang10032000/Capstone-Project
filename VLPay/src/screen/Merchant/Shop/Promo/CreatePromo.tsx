import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {HStack, Input, VStack} from 'native-base';
import React, {useEffect, useState} from 'react';
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
  const [dropdownOptionSelect, setDropdownOptionSelect] = useState('');
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [openDateStart, setOpenDateStart] = useState(false);
  const [openDateEnd, setOpenDateEnd] = useState(false);

  const [code, setCode] = useState(Math.random().toString(36));
  const [startDate, setStartDate] = useState(data ? data.start_date : '');
  const [startDateError, setStartDateError] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endDateError, setEndDateError] = useState('');
  const [startTime, setStartTime] = useState('01:00:00');
  const [endTime, setEndTime] = useState('23:59:59');
  const [discount, setDiscount] = useState(data ? data.discount : 0);
  const [discountError, setDiscountError] = useState('');
  const [discountType, setDiscountType] = useState(
    data ? data.discount_type : '',
  );
  const [maxDiscount, setMaxDiscount] = useState(data ? data.max_discount : 0);
  const [maxDiscountError, setMaxDiscountError] = useState('');
  const [minPurchase, setMinPurchase] = useState(data ? data.min_purchase : 0);
  const [minPurchaseError, setMinPurchaseError] = useState('');
  const [limit, setLimit] = useState(data ? data.limit : 0);
  const [limitError, setLimitError] = useState('');

  const dropdownOptions = [
    {key: '1', value: 'Không giới hạn (mặc định)'},
    {key: '2', value: 'Không giới hạn'},
    {key: '3', value: 'Có giới hạn'},
  ];

  const Element = ({icon, title, desc, onPress}) => {
    return (
      <TouchableOpacity
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
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
    );
  };

  const Case = () => {
    switch (page) {
      case PROMOS[0]:
        return (
          <>
            <UText style={{marginLeft: 10, marginVertical: 10}}>
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
            <UText style={{marginLeft: 10, marginVertical: 10}}>
              Chọn chương trình ưu đãi cho món
            </UText>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <Element
                icon={<Icons.PercentPromo />}
                title={'Giảm phần trăm giá'}
                desc={'Ưu đãi sẽ giảm tiền được tính'}
                onPress={() => setPage(PROMOS[7])}
              />
            </View>
          </>
        );
      case PROMOS[1]:
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
                  <UText>{code}</UText>
                </HStack>
                <VStack
                  width={'100%'}
                  justifyContent={'space-between'}
                  style={{padding: 16}}>
                  <UText>Nhập giá trị giảm giá trên tổng đơn hàng</UText>

                  <Input
                    defaultValue={discount.toString() + '%'}
                    borderRadius={10}
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
                    defaultValue={minPurchase.toString()}
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
                    defaultValue={maxDiscount.toString()}
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
              }}
              onPress={() => {
                console.log(
                  !maxDiscountError && !minPurchaseError && !discountError,
                );

                console.log(page);

                if (!maxDiscountError && !minPurchaseError && !discountError) {
                  setPage(PROMOS[2]);
                }
              }}>
              <UText>Tiếp theo</UText>
            </TouchableOpacity>
          </>
        );
      case PROMOS[2]:
        const currentTime = new Date();
        const time = currentTime.getTime();

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
                          ? dateStart.toDateString()
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
                      if (time > date.getTime()) {
                        setStartDateError('');
                        if (dateEnd) {
                          if (date.getTime() < dateEnd?.getTime()) {
                            setEndDateError('');
                          }
                        }
                        setDateStart(date);
                        setStartDate(date.toISOString().slice(0, 10));
                      } else {
                        setStartDateError('Không được vượt ngày hôm nay');
                      }
                      setOpenDateStart(false);
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
                          ? dateEnd.toDateString()
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
                      if (
                        time > date.getTime() &&
                        dateStart.getTime() < date.getTime()
                      ) {
                        setEndDateError('');
                        setDateEnd(date);
                        setEndDate(date.toISOString().slice(0, 10));
                      } else {
                        setEndDateError('Thời gian không hợp lệ');
                      }

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
                    <UText>Vào khung giờ mở cửa bán</UText>
                  </VStack>
                </HStack>

                <VStack
                  width={'100%'}
                  justifyContent={'space-between'}
                  style={{padding: 16}}>
                  <UText>Giới hạn mã giảm giá (không bắt buộc)</UText>
                  <SelectList
                    placeholder="Chọn mã giảm giá"
                    setSelected={val => setDropdownOptionSelect(val)}
                    data={dropdownOptions}
                    save="value"
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
                    endDate ? endDate : time.toISOString().slice(0, 10),
                  );
                  formData.append('start_time', startTime);
                  formData.append('end_time', endTime);
                  formData.append('discount', discount);
                  formData.append('discount_type', discountType);
                  formData.append('max_discount', maxDiscount);
                  formData.append('min_purchase', minPurchase);
                  formData.append('limit', 10);
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
                      console.log(result);
                    }
                  } else {
                    await axiosClient.post(
                      baseUrl + 'merchant/promocode/create',
                      formData,
                      {
                        headers: {'content-type': 'multipart/form-data'},
                      },
                    );
                  }

                  setPage(PROMOS[3]);
                }
              }}>
              <UText>Tiếp theo</UText>
            </TouchableOpacity>
          </>
        );
      case PROMOS[3]:
        const _time = new Date();
        return (
          <>
            <ScrollView style={{height: '100%', marginBottom: 100}}>
              <VStack backgroundColor={'white'} height={'100%'}>
                <View>
                  <HStack
                    justifyContent={'space-between'}
                    backgroundColor={'#F7F9FC'}
                    style={{padding: 16}}>
                    <UText>Giá trị của mã giảm giá</UText>
                    <UText style={{color: '#B5EAD8'}}>Chỉnh sửa </UText>
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
                    <UText style={{color: '#B5EAD8'}}>Chỉnh sửa </UText>
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
                        Ngày và thời gian bắt đầu{' '}
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
              <UText>Xác nhận tạo Mã giảm giá</UText>
            </TouchableOpacity>
          </>
        );
      case PROMOS[4]:
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
                <Input value={'đ'} borderRadius={10} />
              </VStack>
              <VStack
                width={'100%'}
                justifyContent={'space-between'}
                style={{padding: 16}}>
                <UText>Trị giá đơn hàng tối thiểu</UText>
                <Input value={'đ'} borderRadius={10} />
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
              <UText>Tiếp theo</UText>
            </TouchableOpacity>
          </>
        );
      case PROMOS[5]:
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
                          ? dateStart.toDateString()
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
                          ? dateEnd.toDateString()
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

                <VStack
                  width={'100%'}
                  justifyContent={'space-between'}
                  style={{padding: 16}}>
                  <UText>Giới hạn mã giảm giá (không bắt buộc)</UText>
                  <SelectList
                    placeholder="Chọn mã giảm giá"
                    setSelected={val => setDropdownOptionSelect(val)}
                    data={dropdownOptions}
                    save="value"
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
                position: 'absolute',
                bottom: 20,
              }}
              onPress={() => {
                setPage(PROMOS[6]);
              }}>
              <UText>Tiếp theo</UText>
            </TouchableOpacity>
          </>
        );
      case PROMOS[6]:
        return (
          <>
            <VStack backgroundColor={'white'} height={'100%'}>
              <View>
                <HStack
                  justifyContent={'space-between'}
                  backgroundColor={'#F7F9FC'}
                  style={{padding: 16}}>
                  <UText>Giá trị của mã giảm giá</UText>
                  <UText style={{color: '#B5EAD8'}}>Chỉnh sửa </UText>
                </HStack>
                <VStack justifyContent={'space-between'} style={{padding: 16}}>
                  <UText>Giá trị của mã giảm giá</UText>
                  <UText>20,000 trên tổng hoá đơn</UText>
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
                  <UText style={{color: '#B5EAD8'}}>Chỉnh sửa </UText>
                </HStack>
                <VStack style={{paddingHorizontal: 16}}>
                  <VStack style={{paddingVertical: 16}}>
                    <UText style={{fontSize: 14, color: '#818181'}}>
                      Ngày và thời gian bắt đầu{' '}
                    </UText>
                    <UText>27/11/2022, Th 5 lúc 13:30</UText>
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
                      Ngày và thời gian bắt đầu{' '}
                    </UText>
                    <UText>27/11/2022, Th 5 lúc 13:30</UText>
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
                      Ngày và thời gian bắt đầu{' '}
                    </UText>
                    <UText>27/11/2022, Th 5 lúc 13:30</UText>
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
              <UText>Xác nhận tạo Mã giảm giá</UText>
            </TouchableOpacity>
          </>
        );
      case PROMOS[7]:
        return (
          <>
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
              <VStack
                width={'100%'}
                justifyContent={'space-between'}
                style={{padding: 16}}>
                <UText>Nhập giá trị ưu đãi</UText>
                <Input value={'0%'} borderRadius={10} />
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
                    }}>
                    <UText>5%</UText>
                  </TouchableOpacity>
                </HStack>
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
                setPage(PROMOS[8]);
              }}>
              <UText>Tiếp theo</UText>
            </TouchableOpacity>
          </>
        );
      case PROMOS[8]:
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
                <UText>Chọn món áp dụng ưu đãi</UText>
              </View>
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
                setPage(PROMOS[9]);
              }}>
              <UText>Tiếp theo</UText>
            </TouchableOpacity>
          </>
        );
      case PROMOS[9]:
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
                        ? dateStart.toDateString()
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
                        ? dateEnd.toDateString()
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
  };

  return (
    <View style={{height: '100%', backgroundColor: 'white'}}>
      <HeaderComp
        title={
          page === PROMOS[3]
            ? 'Xem trước mã giảm giá'
            : 'Chương trình quảng cáo'
        }
        onPressBack={() => navigation.goBack()}
      />
      <Case />
    </View>
  );
};

export default CreatePromo;
