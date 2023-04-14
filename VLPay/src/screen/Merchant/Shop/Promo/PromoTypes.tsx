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

  return (
    <View style={{backgroundColor: '#FFFFFF', flex: 1}}>
      <HeaderComp
        title="Chương trình giảm giá"
        onPressBack={() => navigation.goBack()}
      />
      <UText style={{marginLeft: 10, marginBottom: 10, marginTop: 30}}>
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
