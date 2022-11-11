import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import BackIcon from '../assets/svg/left-arrow.svg';
import {HStack, Text, View} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../stack/Navigation';

type Props = {
  title: string;
};

const HeaderBack: React.FC<Props> = ({title}) => {
  const navigation = useNavigation<MainStackNavigation>();
  const handleBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.header}>
      <View>
        <TouchableOpacity onPress={handleBack}>
          <BackIcon />
        </TouchableOpacity>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.text}>{title}</Text>
      </View>
      <View style={{backgroundColor: '#FEB7B1', width: 30, height: 30}}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#000000',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
  },
  header: {
    backgroundColor: '#FEB7B1',
    height: 96,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
});

export default HeaderBack;
