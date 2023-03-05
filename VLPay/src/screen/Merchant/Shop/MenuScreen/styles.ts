import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  titles: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
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
    marginTop: 20,
  },
  btnTitle: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // container: {
  //   flex: 1,
  //   padding: 16,
  // },
  // category: {
  //   fontWeight: 'bold',
  //   marginBottom: 8,
  // },
  // productContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginTop: 8,
  // },
  // productName: {
  //   flex: 1,
  //   marginRight: 16,
  // },
  // productPrice: {
  //   fontWeight: 'bold',
  // },
  container: {
    padding: 16,
  },
  category: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  productName: {
    fontSize: 18,
    color: 'black',
    fontWeight: '700',
  },
  price: {
    fontSize: 18,
    color: '#4285F4',
    fontWeight: '700',
  },
  threeDots: {
    fontSize: 24,
    marginLeft: 8,
    color: 'grey',
    position: 'relative',
    top: -4,
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 4,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: 100,
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
