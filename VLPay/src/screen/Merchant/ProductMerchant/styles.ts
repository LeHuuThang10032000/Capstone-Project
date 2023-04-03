import {StyleSheet} from 'react-native';
import {SCREEN_WIDTH} from '../../../components/helper/constants';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    paddingBottom: 20,
  },
  banner: {
    height: SCREEN_WIDTH * (2 / 3),
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeBanner: {
    position: 'absolute',
    bottom: 20,
    right: 15,
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  require: {
    fontWeight: '400',
    fontSize: 15,
    color: '#FF0000',
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  buttonTextStyle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#fff',
    textTransform: 'capitalize',
  },
  btnWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkedRadio: {
    backgroundColor: '#4285F4',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
});
