import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import Arrow from '../assets/svg/arrow_left.svg';

type Props = {
  title: string;
  onPressBack?: any;
};

const HeaderComp: React.FC<Props> = ({title, onPressBack}) => {
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
      <Text style={styles.text}>{title}</Text>
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
    justifyContent: 'center',
    flexDirection: 'row',
    zIndex: 99,
  },
});

export default HeaderComp;
