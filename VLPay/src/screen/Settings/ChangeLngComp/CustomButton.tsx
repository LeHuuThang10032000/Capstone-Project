import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
// import { t } from 'i18next';

type Props = {
  title: string;
  onPress?: () => void;
};

const CustomButton: React.FC<Props> = ({title, onPress}) => {
  return (
    <View>
      {title && (
        <TouchableOpacity onPress={onPress} style={styles.button}>
          <Text style={{color: '#000000'}}>{title}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FEB7B1',
    height: 40,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
});

export default CustomButton;
