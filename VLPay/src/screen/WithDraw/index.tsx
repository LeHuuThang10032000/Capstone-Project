import {View, VStack} from 'native-base';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import HeaderBack from '../../components/HeaderBack';
import TText from '../Transfer/TText';

const WithDraw = () => {
  return (
    <View style={{flex: 1}}>
      <HeaderBack title="Rút tiền" />
      <VStack>
        <View>
          <TouchableOpacity>
            <TText>Rút tiền từ ví </TText>
          </TouchableOpacity>
        </View>
      </VStack>
    </View>
  );
};

export default WithDraw;
