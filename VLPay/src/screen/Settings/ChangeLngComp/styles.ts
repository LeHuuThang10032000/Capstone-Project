// import {moderateScale} from '../../../utils/scaleUtils';
import {StyleSheet} from 'react-native';
// import Font from '../../../constants/Font';
import {Colors} from 'react-native-paper';

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
  titleTxt: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: 'Poppins-Regular',
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  iconClose: {
    marginLeft: 6,
    alignSelf: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    alignItems: 'center',
  },
  containerButton: {
    height: 40,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    justifyContent: 'center',
    padding: 1,
    marginVertical: 5,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});

export default styles;
