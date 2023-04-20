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
import {Center, HStack} from 'native-base';
import WarningIcon from '../../assets/svg/error.svg';
import Icons from '../../components/Icons';

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
    <HStack
      alignItems={'center'}
      justifyContent="space-between"
      borderBottomWidth={1}>
      <Text></Text>
      {/* <WarningIcon style={{marginTop: 20}} /> */}
      <Text style={styles.title}>Nhắc bạn</Text>
      {!hideModal && (
        <TouchableOpacity onPress={onPress}>
          <CancelIcon width={30} height={30} style={styles.iconSVG} />
        </TouchableOpacity>
      )}
    </HStack>
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
  title: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default HeaderModal;
