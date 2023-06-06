import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  titles: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  btnTab: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E9F2',
    padding: 16,
    marginVertical: 5,
  },
  buttons: {
    width: '100%',
    height: 50,
    backgroundColor: '#B5EAD8',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnWrapper: {
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 20,
    position: 'absolute',
    bottom: 0,
  },
  btnTitle: {
    alignSelf: 'center',
    color: 'black',
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
  contentContainer: {
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
    fontSize: 16,
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
    width: 150,
    right: 15,
    bottom: -20,
    padding: 16,
    zIndex: 1000000000,
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
