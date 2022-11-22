import React, {useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import TickIcon from '../../../assets/svg/tickIcon.svg';
import styles from './styles';
import CustomButton from './CustomButton';
// import RNRestart from 'react-native-restart';

const CustomSwitch = ({
  selectionMode,
  option1,
  option2,
  onSelectSwitch,
  onPress,
}: any) => {
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);

  const updatedSwitchData = (val: any) => {
    setSelectionMode(val);
    onSelectSwitch(val);
  };

  // const resetApp = () => {
  //     RNRestart.Restart();
  // }

  return (
    <View style={{flex: 1, paddingHorizontal: 20}}>
      <View style={styles.containerButton}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updatedSwitchData(1)}
          style={styles.button}>
          <Text
            style={{
              color: '#000000',
              fontSize: 12,
            }}>
            {option1}
          </Text>
          <Text>{getSelectionMode == 1 ? <TickIcon /> : ''}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.containerButton}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updatedSwitchData(2)}
          style={styles.button}>
          <Text
            style={{
              color: '#000000',
              fontSize: 12,
            }}>
            {option2}
          </Text>
          <Text>{getSelectionMode == 2 ? <TickIcon /> : ''}</Text>
        </TouchableOpacity>
      </View>

      <CustomButton title="confirm" onPress={onPress} />
    </View>
  );
};
export default CustomSwitch;
