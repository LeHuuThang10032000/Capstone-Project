// Generation of QR Code in React Native
// https://aboutreact.com/generation-of-qr-code-in-react-native/

// import React in our code
import React, {useState} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';

import QRCode from 'react-native-qrcode-svg';
import HeaderComp from '../../components/HeaderComp';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [qrvalue, setQrvalue] = useState('quet cai cc');

  console.log(qrvalue);

  return (
    <SafeAreaView style={{flex: 1}}>
      <HeaderComp title="QR code" />
      <View style={styles.container}>
        {/* <Text style={styles.titleStyle}>
          Generation of QR Code in React Native
        </Text> */}
        <QRCode
          //QR code value
          value={qrvalue ? qrvalue : 'NA'}
          // value="https://randomuser.me/api/portraits/men/78.jpg"
          //size of QR Code
          size={300}
          //Color of the QR Code (Optional)
          color="black"
          //Background Color of the QR Code (Optional)
          backgroundColor="white"
          //Logo of in the center of QR Code (Optional)
          logo={{uri: 'https://randomuser.me/api/portraits/men/78.jpg'}}
          //Center Logo size  (Optional)
          logoSize={30}
          //Center Logo margin (Optional)
          logoMargin={2}
          //Center Logo radius (Optional)
          logoBorderRadius={15}
          //Center Logo background (Optional)
          logoBackgroundColor="#B5EAD8"
        />
        <Text style={styles.textStyle}>
          Please scan the QR code to pay the transaction
        </Text>
        {/* <TextInput
          style={styles.textInputStyle}
          onChangeText={inputText => setInputText(inputText)}
          placeholder="Enter Any Value"
          value={inputText}
        /> */}
        {/* <TouchableOpacity style={styles.buttonStyle}>
          <Text style={styles.buttonTextStyle}>Generate QR Code</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 10,
  },
  titleStyle: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  textStyle: {
    textAlign: 'center',
    margin: 10,
    paddingTop: 20,
    fontFamily: 'Poppins-SemiBold',
    // color: '#000000',
  },
  textInputStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#B5EAD8',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#B5EAD8',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 30,
    padding: 10,
    width: '90%',
  },
  buttonTextStyle: {
    color: '#514545',
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
});
