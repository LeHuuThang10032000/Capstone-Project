import {StyleSheet} from 'react-native';
import {moderateScale} from '../../../android/app/src/helper/ScaleUtils';
import Colors from '../../components/helpers/Colors';
export default StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  titleBG: {
    fontSize: moderateScale(30),
    paddingTop: moderateScale(30 / 2),
    fontFamily: 'Ubuntu',
    marginBottom: 10,
    color: '#242A37',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 100,
  },
  desText: {
    fontSize: moderateScale(17),
    fontFamily: 'Ubuntu',
    color: '#242A37',
    marginBottom: 10,
  },
  underlineStyleBase: {
    borderWidth: 0,
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 4,
    width: 50,
    height: 70,
    color: Colors.cloudBurst,
    fontSize: moderateScale(28),
    fontFamily: 'Ubuntu',
    fontWeight: 'bold',
  },
  otpContainer: {
    width: '100%',
    height: 70,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  otpMain: {
    marginTop: 40,
    marginBottom: 16,
  },
  error: {
    fontSize: moderateScale(10),
    fontFamily: 'Ubuntu',
    color: '#EA0000',
    marginBottom: 13,
  },
  containerOPT: {flexDirection: 'row', justifyContent: 'center', marginTop: 13},
  optText: {
    fontSize: moderateScale(12),
    color: '#000000',
    fontFamily: 'Ubuntu',
    marginLeft: 2,
  },
  resend: {
    fontSize: moderateScale(12),
    fontFamily: 'Ubuntu',
    color: '#2A66B6',
  },
  btnMain: {
    marginTop: 40,
  },
  resendText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
