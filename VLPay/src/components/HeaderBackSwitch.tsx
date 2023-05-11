import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import BackIcon from '../assets/svg/left-arrow.svg';
import {HStack, Text, View} from 'native-base';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../stack/Navigation';
import SwitchButton from './SwitchButton';
import Trash from '../assets/svg/trash.svg';
import {axiosClient} from './apis/axiosClient';
import {Switch} from 'react-native-switch';
import {UText} from './UText';

type Props = {
  title: string;
  isReset?: boolean;
  style?: any;
  onPressRight?: boolean;
  hideRight?: any;
  TrashIcon?: boolean;
  onPress?: () => void;
  hideLeft?: boolean;
  statusValue?: string;
};

const HeaderBack: React.FC<Props> = ({
  title,
  isReset = false,
  style,
  onPressRight,
  hideRight,
  TrashIcon,
  onPress,
  hideLeft,
  statusValue,
}) => {
  const navigation = useNavigation<MainStackNavigation>();
  const handleBack = () => {
    if (!isReset) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };
  const [switchValue, setSwitchValue] = useState(statusValue);
  const [showSwitchValue, setShow] = useState(true);

  const fetchData = async () => {
    try {
      setShow(true);
      const result = await axiosClient.get('/merchant/store');
      setSwitchValue(result?.data?.data?.status !== 'closing' ? true : false);
      setShow(false);
    } catch (error) {}
  };
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      console.log('12335432 <><>');
      setSwitchValue('');
      fetchData();
    }
  }, [isFocused]);

  const handleSwitchValueChange = async (value: boolean) => {
    await axiosClient.post('merchant/store/update/status', {
      status: value ? 'opening' : 'closing',
    });
    setSwitchValue(value);
  };

  console.log('hideRight', hideRight);

  return (
    <View style={[styles.header, style]}>
      {!hideLeft && (
        <View>
          <TouchableOpacity onPress={handleBack}>
            <BackIcon />
          </TouchableOpacity>
        </View>
      )}
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.text}>{title}</Text>
      </View>
      <View alignItems={'center'}>
        {hideRight ? (
          <>
            {switchValue !== '' && (
              <SwitchButton
                label1={'Mở'}
                label2={'Tắt'}
                value={switchValue}
                onValueChange={handleSwitchValueChange}
              />
            )}
          </>
        ) : (
          <Switch
            value={true}
            onValueChange={() => {}}
            activeText={'Mở'}
            activeTextStyle={{color: '#000000'}}
            inActiveText={'Tắt'}
            circleSize={30}
            barHeight={30}
            circleBorderWidth={0}
            backgroundActive={'#B5EAD8'}
            backgroundInactive={'gray'}
            circleActiveColor={'white'}
            circleInActiveColor={'white'}
            switchWidthMultiplier={2.8}
          />
        )}
        {showSwitchValue && (
          <Switch
            value={true}
            onValueChange={() => {}}
            activeText={'Mở'}
            activeTextStyle={{color: '#000000'}}
            inActiveText={'Tắt'}
            circleSize={30}
            barHeight={30}
            circleBorderWidth={0}
            backgroundActive={'#B5EAD8'}
            backgroundInactive={'gray'}
            circleActiveColor={'white'}
            circleInActiveColor={'white'}
            switchWidthMultiplier={2.8}
          />
        )}
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
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
});

export default HeaderBack;
