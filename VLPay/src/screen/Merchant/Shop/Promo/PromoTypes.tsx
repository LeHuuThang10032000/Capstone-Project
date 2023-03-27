import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {HStack, VStack} from 'native-base';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import HeaderComp from '../../../../components/HeaderComp';
import Icons from '../../../../components/Icons';
import {UText} from '../../../../components/UText';
import {
  MainStackNavigation,
  MainStackParamList,
} from '../../../../stack/Navigation';

const PromoTypes = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const {data} = useRoute<RouteProp<MainStackParamList, 'WithDraw'>>()?.params;
  console.log(data);

  const Element = ({icon, title, desc, onPress}) => {
    return (
      <TouchableOpacity
        style={{width: '100%', alignItems: 'center', justifyContent: 'center'}}
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

  return (
    <View>
      <HeaderComp
        title="Chương trình quảng cáo"
        onPressBack={() => navigation.goBack()}
      />
      <UText style={{marginLeft: 10, marginVertical: 10}}>
        Tổng quan chương trình
      </UText>
      <View style={{flexDirection: 'column', alignItems: 'center'}}>
        <Element
          icon={<Icons.PromoStar />}
          onPress={() => {
            navigation.navigate('CreatePromo', {
              id: data.id,
            });
          }}
          title={'Chương trình giảm giá'}
          desc={'Tạo và quản lý các mã giảm giá của quán'}
        />
        <View style={{height: 30}} />
        <Element
          onPress={() => {
            navigation.navigate('PromoList', {
              data: data,
            });
          }}
          icon={<Icons.PromoList />}
          title={'Xem danh sách'}
          desc={'Quản lí các mã giảm giá đã tạo'}
        />
      </View>
    </View>
  );
};

export default PromoTypes;
