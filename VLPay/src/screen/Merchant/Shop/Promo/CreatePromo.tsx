import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {HStack, Input, VStack} from 'native-base';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  BackHandler,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
        ? PROMOS[3]
        : PROMOS[6]
      : PROMOS[0],
  );
  var today = new Date();
  const [dropdownOptionSelect, setDropdownOptionSelect] = useState('');
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date(today.getTime()));
  const [openDateStart, setOpenDateStart] = useState(false);
  const [openDateEnd, setOpenDateEnd] = useState(false);

  const [code, setCode] = useState(Math.random().toString(36).substring(2, 9));
  const [startDate, setStartDate] = useState(
    data ? data.start_date : new Date().toTimeString().split(' ')[0],
  );
  const [startDateError, setStartDateError] = useState('');
  const [endDate, setEndDate] = useState(data?.end_date ? data.end_date : '');
  const [isLoading, setIsLoading] = useState(false);

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
  const [visibleSuccess, setSuccess] = useState(false);
  const [visibleSuccessMsg, setSuccessMsg] = useState('');
  const [dateStartError, setDateStartError] = useState('');
  const [dateEndError, setDateEndError] = useState('');

  const [title, setTitle] = useState('Tạo phiếu giảm giá');
  let previousPage = () => {
    if (!data) {
      if (!previous) {
        navigation.goBack();
      } else {
        setPage(previous);
      }
    } else {
      navigation.goBack();
    }
  };
  let count = 0;
  const errorDiscount =
    'Giá trị trong khoảng 0% đến 100% và không được bỏ trống';
  const errorMaxDiscount = 'Phải lớn hơn 100đ và không được bỏ trống';
  const errorMinDiscount = 'Không được bé hơn 0đ hoặc bỏ trống';

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Handle the back button press event here
        // ...
        if (!data) {
          if (!previous) {
            navigation.goBack();
          } else {
            setPage(previous);
          }
        } else {
          navigation.goBack();
        }

        // Return true to indicate that we've handled the event
        return true;
      },
    );

    // Remove the listener when the component unmounts
    return () => {
      backHandler.remove();
    };
  }, [previous, page]);

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
        setLimitError('');
        setEndDateError('');
        setGeneralError('');
        setDiscountError('');
        setStartDateError('');
        setMaxDiscountError('');
        setMinPurchaseError('');
        return (
          <>
            <UText style={{marginLeft: 10, marginBottom: 10, marginTop: 30}}>
              Chọn loại phiếu
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
            <ScrollView style={{height: ' 100%', marginBottom: 30}}>
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
                  <UText>Phiếu giảm giá</UText>
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
                    onBlur={() => {
                      if (
                        discount.toString() !== 'NaN' &&
                        discount.toString() !== ''
                      ) {
                        if (discount < 100 && discount > 0) {
                          setDiscountError('');
                        } else {
                          setDiscountError(errorDiscount);
                        }
                      } else {
                        setDiscount(0);
                        setDiscountError(errorDiscount);
                      }
                    }}
                    onChangeText={text => {
                      console.log(text);

                      if (text.length > 0) {
                        setDiscount(
                          parseInt(
                            text
                              .trim()
                              .replace('.', '')
                              .replace(',', '')
                              .replace('-', ''),
                          ),
                        );
                      } else {
                        setDiscount(0);
                        setDiscountError(errorDiscount);
                      }
                    }}
                    onSubmitEditing={async ({
                      nativeEvent: {text, eventCount, target},
                    }) => {
                      if (text.length > 0) {
                        if (
                          parseInt(
                            text
                              .trim()
                              .replace('.', '')
                              .replace(',', '')
                              .replace('-', ''),
                          ) < 100 &&
                          parseInt(
                            text
                              .trim()
                              .replace('.', '')
                              .replace(',', '')
                              .replace('-', ''),
                          ) > 0
                        ) {
                          setDiscountError('');
                          const result = parseInt(
                            text
                              .trim()
                              .replace('.', '')
                              .replace(',', '')
                              .replace('-', ''),
                          );
                          setDiscount(result);
                        } else {
                          const result = parseInt(
                            text
                              .trim()
                              .replace('.', '')
                              .replace(',', '')
                              .replace('-', ''),
                          );
                          setDiscount(result);
                          setDiscountError(errorDiscount);
                          setDiscount(result);
                        }
                      } else {
                        setDiscount(
                          text
                            .trim()
                            .replace('.', '')
                            .replace(',', '')
                            .replace('-', ''),
                        );
                        setDiscountError(errorDiscount);
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
                    defaultValue={minPurchase.toString()}
                    borderRadius={10}
                    keyboardType={'decimal-pad'}
                    onBlur={() => {
                      if (
                        minPurchase.toString() !== 'NaN' &&
                        minPurchase.toString() !== ''
                      ) {
                        if (minPurchase >= 0) {
                          setMinPurchaseError('');
                        } else {
                          setMinPurchaseError(errorMinDiscount);
                        }
                      } else {
                        setMinPurchase(0);
                      }
                    }}
                    onSubmitEditing={async ({
                      nativeEvent: {text, eventCount, target},
                    }) => {
                      const result = parseInt(
                        text
                          .trim()
                          .replace('.', '')
                          .replace(',', '')
                          .replace('-', ''),
                      );
                      if (text.length > 0) {
                        if (result >= 0) {
                          setMinPurchaseError('');
                          const _result = result.toString();
                          setMinPurchase(_result);
                        } else {
                          const _result = result.toString();
                          setMinPurchase(_result);
                          setMinPurchaseError(errorMinDiscount);
                        }
                      } else {
                        setMinPurchaseError(errorMinDiscount);
                      }
                    }}
                    onChangeText={text => {
                      setMinPurchase(
                        text
                          .trim()
                          .replace('.', '')
                          .replace(',', '')
                          .replace('-', ''),
                      );
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
                    rightElement={<UText style={{marginRight: 10}}>đ</UText>}
                    borderRadius={10}
                    keyboardType={'decimal-pad'}
                    onBlur={() => {
                      if (
                        maxDiscount.toString() !== 'NaN' &&
                        maxDiscount.toString() !== ''
                      ) {
                        if (maxDiscount > 100) {
                          setMaxDiscountError('');
                        } else {
                          setMaxDiscountError(errorMaxDiscount);
                        }
                      } else {
                        setMaxDiscount(0);
                        setMaxDiscountError(errorMaxDiscount);
                      }
                    }}
                    onSubmitEditing={async ({
                      nativeEvent: {text, eventCount, target},
                    }) => {
                      const number = parseInt(
                        text
                          .trim()
                          .replace('.', '')
                          .replace(',', '')
                          .replace('-', ''),
                      );
                      if (text.length > 0) {
                        if (number > 100) {
                          setMaxDiscountError('');
                          const result = number.toString();
                          setMaxDiscount(result);
                        } else {
                          const result = number.toString();
                          setMaxDiscount(result);
                          setMaxDiscountError(errorMaxDiscount);
                        }
                      } else {
                        setMaxDiscount(number.toString());
                      }
                    }}
                    onChangeText={text => {
                      const result = text
                        .trim()
                        .replace('.', '')
                        .replace(',', '')
                        .replace('-', '');

                      setMaxDiscount(result);
                    }}
                  />
                  {maxDiscountError && (
                    <UText style={{color: 'red'}}>{maxDiscountError}</UText>
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
                bottom: 20,
              }}
              onPress={() => {
                if (
                  !discountError &&
                  !minPurchaseError &&
                  !maxDiscountError &&
                  discount > 0 &&
                  minPurchase >= 0 &&
                  maxDiscount > 100
                ) {
                  setPage(PROMOS[2]);
                } else {
                  setGeneralError('Vui lòng kiểm tra lại!');
                  setDiscountError(discount > 0 ? '' : errorDiscount);
                  setMinPurchaseError(minPurchase >= 0 ? '' : errorMinDiscount);
                  setMaxDiscountError(
                    maxDiscount > 100 ? '' : errorMaxDiscount,
                  );
                  setVisibleWarning(true);
                }
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
                          ? moment(dateStart).format('DD/MM/YYYY')
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
                      if (date > dateEnd) {
                        setDateEnd(date);
                        setEndDate(date.toISOString().slice(0, 10));
                      }
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
                          ? moment(dateEnd).format('DD/MM/YYYY')
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
                      setEndDateError('');
                      setDateEnd(date);
                      setEndDate(date.toISOString().slice(0, 10));
                      setOpenDateEnd(false);
                      console.log(date, dateStart, date >= dateStart);
                    }}
                    onCancel={() => {
                      setOpenDateEnd(false);
                    }}
                    minimumDate={dateStart}
                  />
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
                  <UText>Giới hạn phiếu giảm giá (không bắt buộc)</UText>
                  <SelectList
                    placeholder="Chọn phiếu giảm giá"
                    setSelected={val => {
                      if (parseInt(val) !== 1) {
                        setLimitError('');
                        setlimited(true);
                      } else {
                        setLimitError('');
                        setlimited(false);
                      }
                      setDropdownOptionSelect(val);
                    }}
                    data={dropdownOptions}
                    save="key"
                  />
                  <View style={{height: 20}} />
                  {isLimit && (
                    <>
                      <Input
                        defaultValue={amount.toString()}
                        borderRadius={10}
                        keyboardType={'decimal-pad'}
                        onBlur={() => {
                          if (
                            amount.toString() !== 'NaN' &&
                            amount.toString() !== ''
                          ) {
                            if (amount > 0) {
                              setLimitError('');
                            } else {
                              setLimitError(
                                'Giới hạn phiếu giảm giá không được bé hơn 1 ',
                              );
                            }
                          } else {
                            setAmount(0);
                          }
                        }}
                        onChangeText={text => {
                          setAmount(
                            text
                              .trim()
                              .replace('.', '')
                              .replace(',', '')
                              .replace('-', ''),
                          );
                        }}
                        onSubmitEditing={async ({
                          nativeEvent: {text, eventCount, target},
                        }) => {
                          const result = parseInt(
                            text
                              .trim()
                              .replace('.', '')
                              .replace(',', '')
                              .replace('-', ''),
                          );
                          if (text.length > 0) {
                            if (result >= 0) {
                              setLimitError('');
                              const _result = result.toString();
                              setMinPurchase(_result);
                            } else {
                              const _result = result.toString();
                              setAmount(_result);
                              setLimitError(
                                'Giới hạn phiếu giảm giá không được bé hơn 1 ',
                              );
                            }
                          } else {
                            setLimitError(
                              'Giới hạn phiếu giảm giá không được bé hơn 1',
                            );
                          }

                          if (text.length > 0) {
                            if (parseInt(text) > 0) {
                              setLimitError('');
                              setAmount(parseInt(text));
                            } else {
                              setLimitError(
                                'Giới hạn phiếu giảm giá không được bé hơn 1 ',
                              );
                              setAmount(parseInt(text));
                            }
                          } else {
                            setLimitError(
                              'Giới hạn phiếu giảm giá không được bé hơn 1',
                            );
                            setAmount(0);
                          }
                        }}
                      />
                      {limitError && (
                        <UText style={{color: 'red'}}>{limitError}</UText>
                      )}
                    </>
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
                console.log(dateEnd >= dateStart);
                if (isLimit) {
                  if (!limitError && limit > 0) {
                    setPage(PROMOS[3]);
                  } else {
                    setGeneralError('Vui lòng kiểm tra lại!');
                    setLimitError(
                      'Giới hạn phiếu giảm giá không được bé hơn 1',
                    );

                    setVisibleWarning(true);
                  }
                } else {
                  if (!limitError) {
                    setPage(PROMOS[3]);
                  } else {
                    setGeneralError('Vui lòng kiểm tra lại!');
                    setLimitError(
                      'Giới hạn phiếu giảm giá không được bé hơn 1',
                    );

                    setVisibleWarning(true);
                  }
                }
              }}>
              <UText style={{fontWeight: '700'}}>Tiếp theo</UText>
            </TouchableOpacity>
          </>
        );
      case PROMOS[3]:
        setTitle('Phiếu giảm giá');
        const _time = new Date();
        setPrevious(PROMOS[2]);

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
                      Giá trị của phiếu giảm giá
                    </UText>
                    <TouchableOpacity
                      onPress={() => {
                        setPage(PROMOS[1]);
                      }}>
                      {data?.type !== 'running' && (
                        <UText style={{color: '#4285F4'}}>Chỉnh sửa</UText>
                      )}
                    </TouchableOpacity>
                  </HStack>
                  <VStack
                    justifyContent={'space-between'}
                    style={{padding: 16}}>
                    <UText>Giá trị của phiếu giảm giá</UText>
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
                    <TouchableOpacity
                      onPress={() => {
                        setPage(PROMOS[2]);
                      }}>
                      {data?.type !== 'running' && (
                        <UText style={{color: '#4285F4'}}>Chỉnh sửa</UText>
                      )}
                    </TouchableOpacity>
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

            {data?.id && !isLoading && (
              <TouchableOpacity
                style={[
                  {
                    backgroundColor: 'red',
                    width: '90%',
                    marginHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 10,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    position: 'absolute',
                    bottom: data?.type === 'running' ? 20 : 85,
                  },
                  isLoading ? {top: 1000000000} : {},
                ]}
                disabled={isLoading}
                onPress={() => {
                  setIsLoading(true);
                  setTimeout(async () => {
                    try {
                      const formData = new FormData();
                      formData.append('promo_id', data?.id);
                      formData.append('store_id', id);
                      if (data?.type === 'running') {
                        await axiosClient.post(
                          baseUrl + 'merchant/promocode/cancel',
                          formData,
                          {
                            headers: {'content-type': 'multipart/form-data'},
                          },
                        );
                      } else {
                        await axiosClient.delete(
                          baseUrl + 'merchant/promocode/' + data?.id,
                        );
                      }
                      setSuccessMsg('Phiếu giảm giá được hủy thành công.');
                      setSuccess(true);
                      setTimeout(() => {
                        setSuccess(false);
                      }, 2000);
                      navigation.navigate('PromoList', {
                        data,
                      });
                      setIsLoading(false);
                    } catch (error) {
                      setVisibleWarning(true);
                      setIsLoading(false);
                      setGeneralError(error?.error);
                    }
                  }, 1000);
                }}>
                <UText style={{color: 'white', fontWeight: 'bold'}}>
                  {data?.type === 'running' ? 'Kết thúc giảm giá' : 'Xoá'}
                </UText>
              </TouchableOpacity>
            )}

            {data?.type !== 'running' && (
              <TouchableOpacity
                disabled={isLoading}
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
                    setIsLoading(true);
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
                    formData.append('discount', parseInt(discount));
                    formData.append('discount_type', discountType);
                    formData.append('max_discount', parseInt(maxDiscount));
                    formData.append('min_purchase', parseInt(minPurchase));

                    if (!limit) {
                      formData.append('limit', amount);
                    } else {
                      formData.append('limit', 0);
                    }

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
                          setSuccessMsg(
                            'Phiếu giảm giá được cập nhập thành công.',
                          );
                          setSuccess(true);
                          setTimeout(() => {
                            setSuccess(false);
                            setPage(PROMOS[3]);
                          }, 2000);
                        }
                      } else {
                        setSuccessMsg('Phiếu giảm giá được tạo thành công.');
                        setSuccess(true);
                        setDateStart(new Date());
                        setDateEnd(new Date(today.getTime()));
                        setPage(PROMOS[0]);
                        setTimeout(() => {
                          setSuccess(false);
                          setIsLoading(false);
                        }, 2000);
                        const result = await axiosClient.post(
                          baseUrl + 'merchant/promocode/create',
                          formData,
                          {
                            headers: {'content-type': 'multipart/form-data'},
                          },
                        );
                      }
                    } catch (e) {
                      setGeneralError(e?.error);
                      setVisibleWarning(true);
                    }
                    setIsLoading(false);
                  }
                }}>
                {data?.id && data?.type === 'upcoming' && (
                  <UText style={{fontWeight: 'bold'}}>
                    Chỉnh sửa phiếu giảm giá
                  </UText>
                )}
                {!data?.id && (
                  <UText style={{fontWeight: 'bold'}}>
                    Xác nhận tạo phiếu giảm giá
                  </UText>
                )}
              </TouchableOpacity>
            )}
          </>
        );
      case PROMOS[4]:
        setTitle('Tạo phiếu giảm giá ');
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
                  defaultValue={discount.toString()}
                  borderRadius={10}
                  rightElement={<UText style={{marginRight: 10}}>đ</UText>}
                  keyboardType={'decimal-pad'}
                  onBlur={() => {
                    if (
                      discount.toString() !== 'NaN' &&
                      discount.toString() !== ''
                    ) {
                      if (discount > 100) {
                        setDiscountError('');
                      } else {
                        setDiscountError(errorMaxDiscount);
                      }
                    } else {
                      setDiscount(0);
                      setDiscountError(errorMaxDiscount);
                    }
                  }}
                  onChangeText={text => {
                    if (text.length > 0) {
                      setDiscount(
                        parseInt(
                          text
                            .trim()
                            .replace('.', '')
                            .replace(',', '')
                            .replace('-', ''),
                        ),
                      );
                    } else {
                      setDiscount(0);
                    }
                  }}
                  onSubmitEditing={async ({
                    nativeEvent: {text, eventCount, target},
                  }) => {
                    if (text.length > 0) {
                      if (
                        parseInt(
                          text
                            .trim()
                            .replace('.', '')
                            .replace(',', '')
                            .replace('-', ''),
                        ) > 100
                      ) {
                        setDiscountError('');
                        const result = parseInt(
                          text
                            .trim()
                            .replace('.', '')
                            .replace(',', '')
                            .replace('-', ''),
                        );
                        setDiscount(result);
                      } else {
                        const result = parseInt(
                          text
                            .trim()
                            .replace('.', '')
                            .replace(',', '')
                            .replace('-', ''),
                        );
                        setDiscount(result);
                        setDiscountError(errorMaxDiscount);
                        setDiscount(result);
                      }
                    } else {
                      setDiscount(
                        text
                          .trim()
                          .replace('.', '')
                          .replace(',', '')
                          .replace('-', ''),
                      );
                      setDiscountError(errorMaxDiscount);
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
                  defaultValue={minPurchase.toString()}
                  borderRadius={10}
                  keyboardType={'decimal-pad'}
                  onBlur={() => {
                    if (
                      minPurchase.toString() !== 'NaN' &&
                      minPurchase.toString() !== ''
                    ) {
                      if (minPurchase >= 0) {
                        setMinPurchaseError('');
                      } else {
                        setMinPurchaseError(errorMinDiscount);
                      }
                    } else {
                      setMinPurchase(0);
                    }
                  }}
                  onSubmitEditing={async ({
                    nativeEvent: {text, eventCount, target},
                  }) => {
                    const result = parseInt(
                      text
                        .trim()
                        .replace('.', '')
                        .replace(',', '')
                        .replace('-', ''),
                    );
                    if (text.length > 0) {
                      if (result >= 0) {
                        setMinPurchaseError('');
                        const _result = result;
                        setMinPurchase(_result);
                      } else {
                        const _result = result;
                        setMinPurchase(_result);
                        setMinPurchaseError(errorMinDiscount);
                      }
                    } else {
                      setMinPurchase(0);
                      setMinPurchaseError('');
                    }
                  }}
                  onChangeText={text => {
                    if (text.length > 0) {
                      setMinPurchase(
                        parseInt(
                          text
                            .trim()
                            .replace('.', '')
                            .replace(',', '')
                            .replace('-', ''),
                        ),
                      );
                    } else {
                      setMinPurchase(0);
                    }
                  }}
                />
                {minPurchaseError && (
                  <UText style={{color: 'red'}}>{minPurchaseError}</UText>
                )}
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
                if (
                  !minPurchaseError &&
                  !discountError &&
                  minPurchase >= 0 &&
                  discount > 100
                ) {
                  setPage(PROMOS[5]);
                } else {
                  setGeneralError('Vui lòng kiểm tra lại!');
                  setMinPurchaseError(minPurchase >= 0 ? '' : errorMinDiscount);
                  setDiscountError(discount > 100 ? '' : errorMaxDiscount);
                  setVisibleWarning(true);
                }
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
                          ? moment(dateStart).format('DD/MM/YYYY')
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
                      if (date > dateEnd) {
                        setDateEnd(date);
                        setEndDate(date.toISOString().slice(0, 10));
                      }
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
                          ? moment(dateEnd).format('DD/MM/YYYY')
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
                      setEndDateError('');
                      setDateEnd(date);
                      setEndDate(date.toISOString().slice(0, 10));
                      setOpenDateEnd(false);
                      console.log(date, dateStart, date >= dateStart);
                    }}
                    onCancel={() => {
                      setOpenDateEnd(false);
                    }}
                    minimumDate={dateStart}
                  />
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
                  <UText>Giới hạn phiếu giảm giá (không bắt buộc)</UText>
                  <SelectList
                    placeholder="Chọn phiếu giảm giá"
                    setSelected={val => {
                      if (parseInt(val) !== 1) {
                        setlimited(true);
                      } else {
                        setLimitError('');
                        setlimited(false);
                      }
                      setDropdownOptionSelect(val);
                    }}
                    data={dropdownOptions}
                    save="key"
                  />
                  <View style={{height: 20}} />
                  {isLimit && (
                    <>
                      <Input
                        defaultValue={amount.toString()}
                        borderRadius={10}
                        keyboardType={'decimal-pad'}
                        onBlur={() => {
                          if (
                            amount.toString() !== 'NaN' &&
                            amount.toString() !== ''
                          ) {
                            if (amount > 0) {
                              setLimitError('');
                            } else {
                              setLimitError(
                                'Giới hạn phiếu giảm giá không được bé hơn 1 ',
                              );
                            }
                          } else {
                            setAmount(0);
                            setLimitError(
                              'Giới hạn phiếu giảm giá không được bé hơn 1 ',
                            );
                          }
                        }}
                        onChangeText={text => {
                          setAmount(
                            text
                              .trim()
                              .replace('.', '')
                              .replace(',', '')
                              .replace('-', ''),
                          );
                        }}
                        onSubmitEditing={async ({
                          nativeEvent: {text, eventCount, target},
                        }) => {
                          const result = parseInt(
                            text
                              .trim()
                              .replace('.', '')
                              .replace(',', '')
                              .replace('-', ''),
                          );
                          if (text.length > 0) {
                            if (result >= 0) {
                              setLimitError('');
                              const _result = result.toString();
                              setMinPurchase(_result);
                            } else {
                              const _result = result.toString();
                              setAmount(_result);
                              setLimitError(
                                'Giới hạn phiếu giảm giá không được bé hơn 1 ',
                              );
                            }
                          } else {
                            setLimitError(
                              'Giới hạn phiếu giảm giá không được bé hơn 1',
                            );
                          }

                          if (text.length > 0) {
                            if (parseInt(text) > 0) {
                              setLimitError('');
                              setAmount(parseInt(text));
                            } else {
                              setLimitError(
                                'Giới hạn phiếu giảm giá không được bé hơn 1 ',
                              );
                              setAmount(parseInt(text));
                            }
                          } else {
                            setLimitError(
                              'Giới hạn phiếu giảm giá không được bé hơn 1',
                            );
                            setAmount(0);
                          }
                        }}
                      />
                      {limitError && (
                        <UText style={{color: 'red'}}>{limitError}</UText>
                      )}
                    </>
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
                if (!limitError) {
                  setPage(PROMOS[6]);
                } else {
                  setLimitError('Giới hạn phiếu giảm giá không được bé hơn 1');
                }
              }}>
              <UText style={{fontWeight: '700'}}>Tiếp theo</UText>
            </TouchableOpacity>
          </>
        );
      case PROMOS[6]:
        setTitle('Xem trước phiếu giảm giá');
        const __time = new Date();
        console.log(data?.type);

        setPrevious(PROMOS[5]);
        console.log(isLoading);

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
                    Giá trị của phiếu giảm giá
                  </UText>
                  <TouchableOpacity
                    onPress={() => {
                      setPage(PROMOS[4]);
                    }}>
                    {data?.type !== 'running' && (
                      <UText style={{color: '#4285F4'}}>Chỉnh sửa</UText>
                    )}
                  </TouchableOpacity>
                </HStack>
                <VStack justifyContent={'space-between'} style={{padding: 16}}>
                  <UText>Giá trị của phiếu giảm giá</UText>
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
                  <TouchableOpacity
                    onPress={() => {
                      setPage(PROMOS[5]);
                    }}>
                    {data?.type !== 'running' && (
                      <UText style={{color: '#4285F4'}}>Chỉnh sửa</UText>
                    )}
                  </TouchableOpacity>
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
                disabled={isLoading}
                style={{
                  backgroundColor: 'red',
                  width: '90%',
                  marginHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 10,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  position: 'absolute',
                  bottom: data?.type === 'running' ? 20 : 85,
                }}
                onPress={async () => {
                  setIsLoading(true);

                  try {
                    const formData = new FormData();
                    formData.append('promo_id', data?.id);
                    formData.append('store_id', id);

                    if (data?.type === 'running') {
                      await axiosClient.post(
                        baseUrl + 'merchant/promocode/cancel',
                        formData,
                        {
                          headers: {'content-type': 'multipart/form-data'},
                        },
                      );
                    } else {
                      await axiosClient.delete(
                        baseUrl + 'merchant/promocode/' + data?.id,
                      );
                    }
                    setSuccessMsg('Phiếu giảm giá được hủy thành công.');
                    setSuccess(true);
                    setTimeout(() => {
                      setSuccess(false);
                    }, 2000);
                  } catch (error) {
                    setVisibleWarning(true);
                    setGeneralError(error?.error);
                  }
                  navigation.navigate('PromoList', {
                    data,
                  });
                  setIsLoading(false);
                }}>
                <UText style={{color: 'white', fontWeight: 'bold'}}>
                  {data?.type === 'running' ? 'Kết thúc giảm giá' : 'Xoá'}
                </UText>
              </TouchableOpacity>
            )}
            {data?.type !== 'running' && (
              <TouchableOpacity
                disabled={isLoading}
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
                    formData.append('discount', parseInt(discount));
                    formData.append('discount_type', 'amount');
                    formData.append('max_discount', 10000);
                    formData.append('min_purchase', parseInt(minPurchase));

                    if (!limit) {
                      formData.append('limit', amount);
                    } else {
                      formData.append('limit', 0);
                    }

                    try {
                      if (data) {
                        setIsLoading(true);
                        if (data?.id) {
                          formData.append('promo_id', data.id);
                          await axiosClient.post(
                            baseUrl + 'merchant/promocode/update',
                            formData,
                            {
                              headers: {'content-type': 'multipart/form-data'},
                            },
                          );
                          setSuccessMsg(
                            'Phiếu giảm giá được cập nhập thành công.',
                          );
                          setSuccess(true);
                          setTimeout(() => {
                            setSuccess(false);
                          }, 2000);
                        }
                      } else {
                        setDateStart(new Date());
                        setDateEnd(new Date(today.getTime()));
                        setPage(PROMOS[0]);
                        setSuccessMsg('Phiếu giảm giá được tạo thành công.');
                        setSuccess(true);
                        setTimeout(() => {
                          setSuccess(false);
                          setIsLoading(false);
                        }, 2000);
                        await axiosClient.post(
                          baseUrl + 'merchant/promocode/create',
                          formData,
                          {
                            headers: {'content-type': 'multipart/form-data'},
                          },
                        );
                      }
                    } catch (e) {
                      setGeneralError(e?.error);
                      setVisibleWarning(true);
                      setIsLoading(false);
                    }
                  }
                }}>
                {data?.id && data?.type === 'upcoming' && (
                  <UText style={{fontWeight: 'bold'}}>
                    Chỉnh sửa phiếu giảm giá
                  </UText>
                )}
                {!data?.id && (
                  <UText style={{fontWeight: 'bold'}}>
                    Xác nhận tạo phiếu giảm giá
                  </UText>
                )}
              </TouchableOpacity>
            )}
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
    setIsLoading,
    isLoading,
    setDateStartError,
    dateStartError,
  ]);

  return (
    <View style={{height: '100%', backgroundColor: 'white'}}>
      <HeaderComp title={title} onPressBack={previousPage} />
      {Case}
      <YesNoModal
        icon={<Icons.SuccessIcon />}
        visible={visibleSuccess}
        btnLeftStyle={{
          backgroundColor: Colors.primary,
          width: 200,
        }}
        btnRightStyle={{
          backgroundColor: '#909192',
          width: 200,
          display: 'none',
        }}
        message={visibleSuccessMsg}
        title={'Thông báo'}
        onActionLeft={() => {
          setSuccess(false);
        }}
        onActionRight={() => {
          setSuccess(false);
        }}
        btnTextLeft={'Xác nhận'}
        style={{flexDirection: 'column'}}
      />
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
