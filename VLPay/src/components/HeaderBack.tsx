import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import BackIcon from '../assets/svg/left-arrow.svg';
import {HStack, Text, View} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../stack/Navigation';
import SwitchButton from './SwitchButton';

type Props = {
  title: string;
  isReset?: boolean;
  style?: any;
  onPressRight?: boolean;
  hideRight?: any;
  onPress?: () => void;
};

const HeaderBack: React.FC<Props> = ({
  title,
  isReset = false,
  style,
  onPressRight,
  hideRight,
  onPress,
}) => {
  const navigation = useNavigation<MainStackNavigation>();
  const handleBack = () => {
    if (!isReset) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };
  const [switchValue, setSwitchValue] = useState(false);

  const handleSwitchValueChange = (value: boolean) => {
    setSwitchValue(value);
  };
  return (
    <View style={[styles.header, style]}>
      <View>
        <TouchableOpacity onPress={handleBack}>
          <BackIcon />
        </TouchableOpacity>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.text}>{title}</Text>
      </View>
      <View alignItems={'center'}>
        {hideRight ? (
          <>
            <SwitchButton
              label1={'Mở'}
              label2={'Tắt'}
              value={switchValue}
              onValueChange={handleSwitchValueChange}
            />
          </>
        ) : null}

        {onPressRight ? (
          <TouchableOpacity onPress={onPress}>
            <Text style={[styles.text, {fontSize: 14}]}>Chỉnh sửa</Text>
          </TouchableOpacity>
        ) : null}
      </View>
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
