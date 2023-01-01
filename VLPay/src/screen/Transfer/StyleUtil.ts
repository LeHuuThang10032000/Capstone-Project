import {Platform, StyleSheet} from 'react-native';
import Colors, {EColors} from './Colors';
import {moderateScale} from './ScaleUtils';

const StyleUtils = StyleSheet.create({
  mainView: {
    paddingBottom: 44,
  },
  whiteBG: {backgroundColor: 'white'},
  primaryBG: {backgroundColor: EColors.primary},
  titleText: {
    fontSize: moderateScale(34),
    fontFamily: 'MyriadPro',
    fontWeight: '700',
  },
  subTitleText: {
    fontSize: moderateScale(15),
    fontFamily: 'MyriadPro',
  },
  requireText: {
    fontSize: moderateScale(12),
    fontFamily: 'MyriadPro',
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
    opacity: 0.95,
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
    color: Colors.primary,
  },
  highlightBackground: {
    backgroundColor: Colors.primary,
  },
  centerText: {
    textAlign: 'center',
  },
  primaryText: {
    color: Colors.white,
  },
  darkText: {
    color: Colors.dark,
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
    paddingTop: 5,
    color: '#312E49',
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
  btnMain: {
    marginVertical: 20,
  },
  clearMargin: {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
});

export default StyleUtils;
