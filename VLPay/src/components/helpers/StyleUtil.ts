import {Platform, StyleSheet} from 'react-native';
import {moderateScale} from '../../../android/app/src/helper/ScaleUtils';
import Colors, {EColors} from './Colors';

const StyleUtils = StyleSheet.create({
  mainView: {
    paddingBottom: 44,
  },
  whiteBG: {backgroundColor: 'white'},
  primaryBG: {backgroundColor: EColors.primary},
  titleText: {
    fontSize: moderateScale(29),
    fontFamily: 'Ubuntu',
    fontWeight: '700',
  },
  subTitleText: {
    fontSize: moderateScale(17),
    fontFamily: 'Ubuntu',
  },
  requireText: {
    fontSize: moderateScale(12),
    fontFamily: 'Ubuntu',
    color: 'red',
    marginTop: -16,
    marginLeft: 16,
    marginBottom: 16,
  },
  alignCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  paddingHorizontal: {
    paddingHorizontal: 16,
  },
  paddingVertical: {
    paddingVertical: 16,
  },
  marginHorizontal: {
    marginHorizontal: 16,
  },
  elevationLow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  square20: {
    height: 20,
    width: 20,
  },
  square48: {
    height: 48,
    width: 48,
  },
  flex1: {
    flex: 1,
  },
  highlightText: {
    color: Colors.cornflowerBlue,
  },
  highlightBackground: {
    backgroundColor: Colors.cornflowerBlue,
  },
  centerText: {
    textAlign: 'center',
  },
  primaryText: {
    color: Colors.white,
  },
  regularText: {
    fontSize: moderateScale(14),
    fontWeight: '400',
  },
  boldText: {
    fontWeight: 'bold',
  },
  impressiveText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  iconBack: {
    marginLeft: 16,
    marginRight: 6,
    width: 24,
    height: 24,
  },
  iconSize: {
    width: 48,
    height: 48,
    marginHorizontal: 16,
  },
});

export default StyleUtils;
