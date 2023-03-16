import {useNavigation} from '@react-navigation/native';
import {HStack, Input, VStack} from 'native-base';
import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import HeaderComp from '../../../../components/HeaderComp';
import StagePromo from '../../../../components/helpers/StagePromo';
import Icons from '../../../../components/Icons';
import {UText} from '../../../../components/UText';
import {MainStackNavigation} from '../../../../stack/Navigation';
import {SelectList} from 'react-native-dropdown-select-list';
import DatePicker from 'react-native-date-picker';

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
  const [page, setPage] = useState(PROMOS[0]);
  const [dropdownOptionSelect, setDropdownOptionSelect] = useState('');
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [openDateStart, setOpenDateStart] = useState(false);
  const [openDateEnd, setOpenDateEnd] = useState(false);
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
              <HStack
                width={'100%'}
                justifyContent={'space-between'}
                style={{padding: 16}}>
                <UText>Mã giảm giá</UText>
                <UText>N372HYU3OP</UText>
              </HStack>
              <VStack
                width={'100%'}
                justifyContent={'space-between'}
                style={{padding: 16}}>
                <UText>Nhập giá trị giảm giá trên tổng đơn hàng</UText>
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
              <VStack
                width={'100%'}
                justifyContent={'space-between'}
                style={{padding: 16}}>
                <UText>Trị giá đơn hàng tối thiểu</UText>
                <Input value={'đ'} borderRadius={10} />
              </VStack>
              <VStack
                width={'100%'}
                justifyContent={'space-between'}
                style={{padding: 16}}>
                <UText>Nhập giá trị giảm tối đa</UText>
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
                setPage(PROMOS[2]);
              }}>
              <UText>Tiếp theo</UText>
            </TouchableOpacity>
          </>
        );
      case PROMOS[2]:
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
                setPage(PROMOS[3]);
              }}>
              <UText>Tiếp theo</UText>
            </TouchableOpacity>
          </>
        );
      case PROMOS[3]:
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
                <HStack justifyContent={'space-between'} style={{padding: 16}}>
                  <UText>Giá trị của mã giảm giá</UText>
                </HStack>
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
