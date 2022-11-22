import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
// import styles from './styles';
// import Icons from '../../../component/icons/icons';

import CancelIcon from '../../assets/svg/cancel.svg';
import {UText} from '../UText';

type Props = {
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  hideModal?: boolean;
  title?: string;
  onPress?: () => void;
};

const HeaderModal: React.FC<Props> = ({
  style,
  title,
  hideModal,
  onPress,
  titleStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftContainer}>
        {title && <UText>{title}</UText>}
      </View>

      {!hideModal && (
        <TouchableOpacity onPress={onPress}>
          <CancelIcon width={30} height={30} style={styles.iconSVG} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 65,
    borderRadius: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  leftContainer: {
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
  },
  iconSVG: {
    marginTop: 10,
  },
});

export default HeaderModal;
