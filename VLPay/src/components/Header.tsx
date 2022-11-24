import {
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import {MainStackNavigation} from '../stack/Navigation';
import React from 'react';
import {moderateScale} from '../../android/app/src/helper/ScaleUtils';
import ArrowLeftIcon from '../assets/svg/arrow_left.svg';
export type Props = {
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  hideBack?: boolean;
  title?: string;
  headerLeft?: any;
  headerRight?: any;
  headerCenter?: any;
  onHandleBack?: () => void;
  centerContainer?: StyleProp<ViewStyle>;
  iconBack?: any;
};

const Header: React.FC<Props> = ({
  style,
  title = '',
  hideBack,
  headerLeft,
  headerRight,
  headerCenter,
  onHandleBack,
  titleStyle,
  centerContainer,
  iconBack,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<MainStackNavigation>();

  /**
   * Handle back press
   */
  const onBackPress = () => {
    if (onHandleBack) {
      onHandleBack && onHandleBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, {marginTop: insets.top}, style]}>
      <View style={styles.leftContainer}>
        {!hideBack && (
          <TouchableOpacity onPress={onBackPress}>
            {iconBack ? iconBack : <ArrowLeftIcon style={styles.iconBack} />}
          </TouchableOpacity>
        )}
        {headerLeft && headerLeft}
      </View>
      {(title || headerCenter) && (
        <View style={[styles.centerContainer, centerContainer]}>
          {title && <Text style={[styles.titleTxt, titleStyle]}>{title}</Text>}
          {headerCenter && headerCenter}
        </View>
      )}
      <View style={styles.rightContainer}>{headerRight && headerRight}</View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 65,
    borderRadius: 0,
    alignItems: 'center',
  },
  leftContainer: {
    flex: 2,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  rightContainer: {
    flex: 2,
    alignItems: 'flex-end',
    alignSelf: 'center',
  },
  notification: {alignSelf: 'center', justifyContent: 'center'},
  titleTxt: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    textTransform: 'capitalize',
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: 'Ubuntu',
  },
  iconBack: {
    marginLeft: 16,
    marginRight: 6,
    width: 24,
    height: 24,
  },
  iconHome: {
    marginLeft: 6,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  containerBg: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 150,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  leftContainerBg: {
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    position: 'absolute',
    left: 15,
  },
  iconHomeBg: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    marginTop: 10,
    position: 'absolute',
    right: 20,
  },
  titleTxtBg: {
    fontSize: moderateScale(14),
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: 'Ubuntu',
  },
  iconBackBg: {
    marginRight: 6,
    color: '#FFFFFF',
  },
  iconEditBg: {
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 28,
    height: 28,
    alignSelf: 'flex-start',
    marginTop: 10,
    position: 'absolute',
    right: 20,
  },
});

export default React.memo(Header);
