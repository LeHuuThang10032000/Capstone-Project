import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 150,
  },
  headerItem: {
    fontWeight: '700',
    fontSize: 28,
    color: '#312E49',
  },
  itemLabel: {},
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  itemField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A2A2A6',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
    marginBottom: 12,
  },
  textInput: {
    marginRight: 100,
    fontSize: 16,
    color: '#747980',
  },
  buttonInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#B5EAD8',
    borderRadius: 6,
    paddingVertical: 20,
  },
  textButtonInput: {
    color: '#514545',
    fontWeight: '700',
    fontSize: 18,
  },
  textButtonOpacity: {
    color: '#283FB1',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  passwordIcon: {
    position: 'absolute',
    right: 10,
  },
});
