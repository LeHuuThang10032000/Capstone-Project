// import {t} from 'i18next';
import React, {ReactNode} from 'react';
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  View,
} from 'react-native';
import {Colors} from 'react-native-paper';
import {UText} from '../../components/UText';
// import CustomText from '../../component/CustomText';
// import {moderateScale} from '../../utils/scaleUtils';

export type Props = {
  style?: ViewStyle | ViewStyle[];
  buttonText: string;
  textStyle?: TextStyle | TextStyle[];
  onPress?: () => void;
  disable?: boolean;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  rightText?: string;
};

const Button: React.FC<Props> = ({
  style = styles.button,
  buttonText = '??',
  textStyle = styles.highlight,
  onPress,
  disable = false,
  icon,
  rightIcon,
  rightText = '',
}) => {
  return (
    <TouchableOpacity disabled={disable} style={style} onPress={onPress}>
      {icon ? icon : null}
      <UText style={textStyle}>{buttonText}</UText>
      <UText style={styles.rightText}>{rightText}</UText>
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </TouchableOpacity>
  );
};

export const styles = StyleSheet.create({
  button: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#000000',
    height: 57,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  highlight: {
    textAlign: 'left',
    color: Colors.black,
    // fontSize: moderateScale(12),
    marginLeft: 25,
  },
  rightIcon: {
    flex: 1,
    position: 'absolute',
    right: 0,
    paddingRight: 20,
  },
  rightText: {
    flex: 1,
    position: 'absolute',
    right: 0,
    paddingRight: 40,
    fontSize: 12,
    color: '#979797',
  },
});

export default Button;
