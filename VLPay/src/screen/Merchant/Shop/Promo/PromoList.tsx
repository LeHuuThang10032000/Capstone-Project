import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {HStack, VStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {axiosClient} from '../../../../components/apis/axiosClient';
import {baseUrl} from '../../../../components/apis/baseUrl';
import HeaderComp from '../../../../components/HeaderComp';
import Icons from '../../../../components/Icons';
import {UText} from '../../../../components/UText';
import {
  MainStackNavigation,
  MainStackParamList,
} from '../../../../stack/Navigation';

const PromoList = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const {data} = useRoute<RouteProp<MainStackParamList, 'WithDraw'>>()?.params;
  const [state, setState] = useState('RUNNING');
  const [items, setItems] = useState([]);

  const fetchData = async () => {
    const result = await axiosClient.get(
      baseUrl +
        'merchant/promocode?store_id=' +
        data.id +
        '&page=1&limit=10&status=' +
        'RUNNING',
    );
    setItems(result.data.data);
    console.log('result', result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{flex: 1}}>
      <HeaderComp title="Mã giảm giá" onPressBack={() => navigation.goBack()} />
      <HStack
        justifyContent={'space-between'}
        style={{paddingHorizontal: 16, backgroundColor: '#FEB7B1'}}>
        <TouchableOpacity
          onPress={async () => {
            setState('RUNNING');
            const result = await axiosClient.get(
              baseUrl +
                'merchant/promocode?store_id=' +
                data.id +
                '&page=1&limit=10&status=RUNNING',
            );
            setItems(result.data.data);
          }}
          style={[
            state === 'RUNNING'
              ? {borderBottomColor: 'black', borderBottomWidth: 1}
              : {},
            {width: 90},
          ]}>
          <UText
            style={{
              alignSelf: 'center',
              color: state === 'RUNNING' ? 'black' : '#ACB1C0',
              fontWeight: '700',
            }}>
            Đang chạy
          </UText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            setState('UPCOMING');
            const result = await axiosClient.get(
              baseUrl +
                'merchant/promocode?store_id=' +
                data.id +
                '&page=1&limit=10&status=UPCOMING',
            );
            setItems(result.data.data);
          }}
          style={[
            state === 'UPCOMING'
              ? {borderBottomColor: 'black', borderBottomWidth: 1}
              : {},
            {width: 90},
          ]}>
          <UText
            style={{
              alignSelf: 'center',
              color: state === 'UPCOMING' ? 'black' : '#ACB1C0',
              fontWeight: '700',
            }}>
            Sắp chạy
          </UText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            setState('FINISHED');
            const result = await axiosClient.get(
              baseUrl +
                'merchant/promocode?store_id=' +
                data.id +
                '&page=1&limit=10&status=FINISHED',
            );
            setItems(result.data.data);
          }}
          style={[
            state === 'FINISHED'
              ? {borderBottomColor: 'black', borderBottomWidth: 1}
              : {},
            {width: 90},
          ]}>
          <UText
            style={{
              alignSelf: 'center',
              color: state === 'FINISHED' ? 'black' : '#ACB1C0',
              fontWeight: '700',
            }}>
            Lịch sử
          </UText>
        </TouchableOpacity>
      </HStack>
      <VStack style={{marginBottom: 20}}>
        <View style={{height: 20}} />
        <ScrollView>
          {items &&
            items.map(item => {
              return (
                <TouchableOpacity
                  style={{
                    marginBottom: 10,
                    backgroundColor: 'white',
                    marginHorizontal: 5,
                    paddingVertical: 10,
                  }}
                  onPress={() => {
                    navigation.navigate('CreatePromo', {
                      id: item.store_id,
                      data: item,
                    });
                  }}>
                  <HStack alignItems={'center'}>
                    <View style={{width: 20}} />
                    <Icons.DollarsIcon />
                    <View style={{width: 20}} />
                    <VStack>
                      <View style={{width: '100%'}}>
                        <UText style={{fontSize: 16, maxWidth: '90%'}}>
                          {item.title}
                        </UText>
                      </View>
                      <UText style={{fontSize: 14, color: '#818181'}}>
                        {item.start_date} - {item.end_date}
                      </UText>
                    </VStack>
                  </HStack>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </VStack>
      <View
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 20,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CreatePromo', {
              id: data.id,
            });
          }}
          style={{
            backgroundColor: '#B5EAD8',
            width: '90%',
            paddingVertical: 10,
            borderRadius: 10,
          }}>
          <UText style={{alignSelf: 'center', color: '#ACB1C0'}}>
            Tạo mã giảm giá
          </UText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PromoList;
