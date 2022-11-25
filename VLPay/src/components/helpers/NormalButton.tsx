import {StyleProp, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import React from 'react';
import {Button} from '@rneui/base';
import Colors from '../helpers/Colors';

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  title: string;
  disabled?: boolean;
  outline?: boolean;
  onPress?: () => void;
  textTop?: any;
};

const NormalButton: React.FC<Props> = ({
  containerStyle,
  buttonStyle,
  titleStyle,
  title,
  disabled = false,
  onPress,
}) => {
  return (
    <Button
      title={title}
      disabled={disabled}
      buttonStyle={[styles.buttonStyle, buttonStyle]}
      titleStyle={[styles.btnTitle, titleStyle]}
      containerStyle={[styles.btnContainer, containerStyle]}
      onPress={onPress}
    />
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: Colors.cornflowerBlue,
    borderRadius: 15,
    paddingHorizontal: 24,
    paddingVertical: 18,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  btnContainer: {
    backgroundColor: Colors.clear,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  btnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});

export default React.memo(NormalButton);
