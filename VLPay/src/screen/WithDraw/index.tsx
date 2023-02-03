import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Image, View, VStack} from 'native-base';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import HeaderBack from '../../components/HeaderBack';
import {MainStackNavigation, MainStackParamList} from '../../stack/Navigation';
import TText from '../Transfer/TText';

const WithDraw = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const {isWithdraw} =
    useRoute<RouteProp<MainStackParamList, 'WithDraw'>>()?.params;
  return (
    <View style={{flex: 1}}>
      <HeaderBack title={isWithdraw ? 'Rút tiền' : 'Nạp tiền'} />
      <VStack>
        <View paddingX={10} paddingY={5}>
          <TouchableOpacity
            onPress={() => {
              if (isWithdraw) {
                navigation.navigate('WithDrawInfo', {
                  isWithdraw: isWithdraw,
                });
              } else {
                navigation.navigate('WithDrawInfo', {
                  isWithdraw: isWithdraw,
                });
              }
            }}
            style={{
              flexDirection: 'row',
              paddingHorizontal: 10,
              paddingVertical: 15,
              justifyContent: 'space-between',
              backgroundColor: '#82CAEE',
              borderRadius: 8,
              alignItems: 'center',
            }}>
            <TText style={{fontSize: 18, fontWeight: '700'}}>
              {isWithdraw
                ? 'Rút tiền từ ví của bạn'
                : 'Nạp tiền vào ví của bạn'}
            </TText>
            <Image
              source={require('../../assets/img/next_icon.png')}
              width={5}
              height={5}
              alt="withdraw"
            />
          </TouchableOpacity>
        </View>
        <View paddingX={10}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              paddingHorizontal: 10,
              paddingVertical: 15,
              justifyContent: 'space-between',
              backgroundColor: '#82CAEE',
              borderRadius: 8,
              alignItems: 'center',
            }}>
            <TText style={{fontSize: 18, fontWeight: '700'}}>
              {isWithdraw ? 'Lịch sử rút tiền' : 'Lịch sử nạp tiền'}
            </TText>
            <Image
              source={require('../../assets/img/next_icon.png')}
              width={5}
              height={5}
              alt="withdraw"
            />
          </TouchableOpacity>
        </View>
      </VStack>
    </View>
  );
};

export default WithDraw;
