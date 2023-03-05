import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  titles: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal: 30,
  },
  buttons: {
    width: '100%',
    height: 50,
    backgroundColor: '#4285F4',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnWrapper: {
    width: '100%',
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 20,
  },
  btnTitle: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  category: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  productName: {
    flex: 1,
    marginRight: 16,
  },
  productPrice: {
    fontWeight: 'bold',
  },
});
