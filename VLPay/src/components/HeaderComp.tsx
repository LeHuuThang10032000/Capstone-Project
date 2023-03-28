import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Arrow from '../assets/svg/arrow_left.svg';
import Trash from '../assets/svg/trash.svg';

type Props = {
  title: string;
  onPressBack?: any;
  TrashIcon?: boolean;
  onPress?: () => void;
};

const HeaderComp: React.FC<Props> = ({
  title,
  onPressBack,
  TrashIcon,
  onPress,
}) => {
  return (
    <View style={styles.header}>
      {onPressBack ? (
        <Arrow
          style={{marginLeft: 15, position: 'absolute', left: 0}}
          onPress={onPressBack}
        />
      ) : (
        <></>
      )}
      <View style={{width: 30, height: 30}}></View>
      <Text style={styles.text}>{title}</Text>
      {TrashIcon ? (
        <TouchableOpacity onPress={onPress}>
          <Trash width={30} height={30} />
        </TouchableOpacity>
      ) : (
        <View style={{width: 30, height: 30}}></View>
      )}
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
    zIndex: 99,
    paddingHorizontal: 10,
  },
});

export default HeaderComp;
