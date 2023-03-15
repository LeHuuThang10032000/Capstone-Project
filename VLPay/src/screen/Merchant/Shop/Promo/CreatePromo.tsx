import {useNavigation} from '@react-navigation/native';
import {HStack, Input, VStack} from 'native-base';
import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import HeaderComp from '../../../../components/HeaderComp';
import StagePromo from '../../../../components/helpers/StagePromo';
import Icons from '../../../../components/Icons';
import {UText} from '../../../../components/UText';
import {MainStackNavigation} from '../../../../stack/Navigation';

const CreatePromo = () => {
  const PROMOS = ['MENU', 'TYPE_1', 'TYPE_2', 'TYPE_3'];
  const navigation = useNavigation<MainStackNavigation>();
  const [page, setPage] = useState(PROMOS[0]);

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
              />
            </View>
          </>
        );
      case PROMOS[1]:
        return (
          <VStack alignItems={'center'}>
            <StagePromo.StageOne />
            <View
              style={{width: '100%', backgroundColor: '#F7F9FC', padding: 16}}>
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
                setPage(PROMOS[2]);
              }}>
              <UText>Tiếp theo</UText>
            </TouchableOpacity>
          </VStack>
        );
      case PROMOS[2]:
        return (
          <VStack alignItems={'center'}>
            <StagePromo.StageTwo />
            <View
              style={{width: '100%', backgroundColor: '#F7F9FC', padding: 16}}>
              <UText>Thời gian áp dụng</UText>
            </View>
            <VStack
              width={'100%'}
              justifyContent={'space-between'}
              style={{padding: 16}}>
              <UText>Bắt đầu</UText>
              <Input value={'Chọn ngày và thời gian'} borderRadius={10} />
            </VStack>
            <VStack
              width={'100%'}
              justifyContent={'space-between'}
              style={{padding: 16}}>
              <UText>Kết thúc</UText>
              <Input value={'Chọn ngày và thời gian'} borderRadius={10} />
            </VStack>
            <HStack
              width={'100%'}
              justifyContent={'space-between'}
              style={{padding: 16}}
              borderBottomColor={'#E4E9F2'}
              borderBottomWidth={1}
              paddingBottom={2}
              marginBottom={10}>
              <VStack>
                <UText>Thời gian áp dụng</UText>
                <UText>Vào khung giờ mở cửa bán</UText>
              </VStack>
            </HStack>

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
                setPage(PROMOS[2]);
              }}>
              <UText>Tiếp theo</UText>
            </TouchableOpacity>
          </VStack>
        );
      case PROMOS[3]:
        return <></>;
    }
  };

  return (
    <View>
      <HeaderComp
        title="Chương trình quảng cáo"
        onPressBack={() => navigation.goBack()}
      />
      <Case />
    </View>
  );
};

export default CreatePromo;
