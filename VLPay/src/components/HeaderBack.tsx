import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import BackIcon from '../assets/svg/left-arrow.svg';
import {HStack, Text, View} from 'native-base';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../stack/Navigation';
import SwitchButton from './SwitchButton';
import Trash from '../assets/svg/trash.svg';
import {axiosClient} from './apis/axiosClient';

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

  const fetchData = async () => {
    try {
      const result = await axiosClient.get('/merchant/store');
      setSwitchValue(result?.data?.data?.status !== 'closing' ? true : false);
    } catch (error) {}
  };
  console.log('switchValue', switchValue);
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
        ) : null}

        {onPressRight ? (
          <TouchableOpacity onPress={onPress}>
            <Text style={[styles.text, {fontSize: 14}]}>Chỉnh sửa</Text>
          </TouchableOpacity>
        ) : null}

        {TrashIcon ? (
          <TouchableOpacity onPress={onPress}>
            <Trash width={30} height={30} />
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
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
});

export default HeaderBack;
