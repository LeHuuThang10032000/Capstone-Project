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
    let array_running = [];
    result.data.data.map(item => {
      item.type = 'running';
      array_running.push(item);
    });
    setItems(array_running);
    setState('RUNNING');
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
        style={{backgroundColor: '#FEB7B1'}}>
        <TouchableOpacity
          onPress={async () => {
            setState('RUNNING');
            const result = await axiosClient.get(
              baseUrl +
                'merchant/promocode?store_id=' +
                data.id +
                '&page=1&limit=10&status=RUNNING',
            );
            let array_running = [];
            result.data.data.map(item => {
              item.type = 'running';
              array_running.push(item);
            });

            setItems(array_running);
          }}
          style={[
            state === 'RUNNING'
              ? {borderBottomColor: 'black', borderBottomWidth: 4}
              : {},
            {width: 130},
          ]}>
          <UText
            style={{
              alignSelf: 'center',
              color: state === 'RUNNING' ? 'black' : '#ACB1C0',
              fontWeight: '700',
              padding: 5,
              paddingVertical: 10,
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
            let array_comming = [];
            result.data.data.map(item => {
              item.type = 'upcoming';
              array_comming.push(item);
            });

            setItems(array_comming);
          }}
          style={[
            state === 'UPCOMING'
              ? {borderBottomColor: 'black', borderBottomWidth: 4}
              : {},
            {width: 130},
          ]}>
          <UText
            style={{
              alignSelf: 'center',
              color: state === 'UPCOMING' ? 'black' : '#ACB1C0',
              fontWeight: '700',
              padding: 5,
              paddingVertical: 10,
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
              ? {borderBottomColor: 'black', borderBottomWidth: 4}
              : {},
            {width: 130},
          ]}>
          <UText
            style={{
              alignSelf: 'center',
              color: state === 'FINISHED' ? 'black' : '#ACB1C0',
              fontWeight: '700',
              padding: 5,
              paddingVertical: 10,
            }}>
            Lịch sử
          </UText>
        </TouchableOpacity>
      </HStack>
      <ScrollView style={{flex: 1}}>
        {items &&
          items.map(item => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (item?.type === 'running') {
                    navigation.navigate('CreatePromo', {
                      id: item.store_id,
                      data: item,
                      type: 'running',
                    });
                  } else if (item?.type === 'upcoming') {
                    navigation.navigate('CreatePromo', {
                      id: item.store_id,
                      data: item,
                      type: 'upcoming',
                    });
                  }
                }}>
                <HStack
                  alignItems={'center'}
                  style={{
                    backgroundColor: '#ffffff',
                    marginHorizontal: 10,
                    marginVertical: 10,
                    paddingVertical: 10,
                    borderRadius: 10,
                  }}>
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
        <View style={{height: 100}} />
      </ScrollView>
      <View
        style={{
          backgroundColor: '#ffffff',
          width: '100%',
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          padding: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CreatePromo', {
              id: data.id,
            });
          }}
          style={{
            backgroundColor: '#B5EAD8',
            width: '100%',
            paddingVertical: 10,
            borderRadius: 10,
          }}>
          <UText
            style={{alignSelf: 'center', color: 'black', fontWeight: 'bold'}}>
            Tạo phiếu giảm giá
          </UText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PromoList;
