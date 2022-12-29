import {StyleSheet} from 'react-native';
import {moderateScale} from '../../../android/app/src/helper/ScaleUtils';
import Colors from '../../components/helpers/Colors';

export default StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  itemStyle: {
    paddingLeft: 10,
    fontFamily: 'Poppins-Regular',
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF',
  },
  otpContainer: {
    height: 70,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  underlineStyleBase: {
    width: 40,
    height: 50,
    color: Colors.cloudBurst,
    fontSize: moderateScale(28),
    borderWidth: 0,
    alignItems: 'center',
    paddingHorizontal: -30,
  },
  searchBtn: {
    height: 40,
    width: '90%',
    margin: 12,
    padding: 10,
    borderRadius: 50,
    paddingHorizontal: 20,
    backgroundColor: '#FEFDFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wrapperButton: {
    backgroundColor: '#FEB7B1',
    height: 96,
    alignItems: 'center',
    flexDirection: 'row',
  },
  contentContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  content: {
    color: 'black',
    opacity: 0.56,
  },
  text: {
    fontFamily: 'Poppins-Regular',
  },
  textButtonInput: {
    color: '#514545',
    fontWeight: '700',
    fontSize: 18,
  },
  buttonInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#B5EAD8',
    borderRadius: 6,
    paddingVertical: 15,
    position: 'absolute',
    bottom: 50,
    width: '100%',
  },
});
