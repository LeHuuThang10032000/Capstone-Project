import {StyleSheet, Text, TextInput} from 'react-native';
import React from 'react';
import HeaderBack from '../../components/HeaderBack';
import {MainStackNavigation} from '../../stack/Navigation';
import {useNavigation} from '@react-navigation/native';
import {
  Center,
  Image,
  Button,
  TextArea,
  View,
  VStack,
  HStack,
} from 'native-base';
import CurrencyInput from 'react-native-currency-input';
import MessageIcon from '../../assets/svg/message.svg';

const Index = ({route}: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  return (
    <View>
      <HeaderBack title="Transfer" />
      <Center>
        <HStack
          width={'95%'}
          alignItems="center"
          backgroundColor="rgba(217, 217, 217, 0.42)">
          <Image
            source={require('../../assets/img/warning.png')}
            alt="Warning icon"
            style={{width: 24, height: 24}}
          />
          <Text>
            Kiểm tra thật kĩ thông tin người nhận trước khi chuyển tiền nha
          </Text>
        </HStack>
      </Center>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
