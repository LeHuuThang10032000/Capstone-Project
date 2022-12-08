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
import ModalProvider from '../../context/ModalProvider';
import Modal from 'react-native-modal';
import HeaderModal from '../../components/CustomLogout/HeaderModal';
import BodyModal from '../Settings/ChangeLngComp/BodyModal';
import {Input} from 'native-base';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [qrvalue, setQrvalue] = useState('');
  const {modalVisible, setModalVisible, closeModal} = ModalProvider();
  const toggleModal = () => {
    setModalVisible(true);
  };
  const setValueQR = () => setQrvalue(inputText);
  const saveQR = () => {
    setValueQR();
    closeModal();
  };

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

        <TouchableOpacity style={styles.buttonStyle} onPress={toggleModal}>
          <Text style={styles.buttonTextStyle}>+ Thêm số tiền nhận</Text>
        </TouchableOpacity>

        <Modal
          isVisible={modalVisible}
          animationIn="slideInUp"
          animationOut="fadeOutDown"
          style={{
            margin: 0,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 230,
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              width: '100%',
              alignItems: 'center',
            }}>
            <HeaderModal title="Tùy chỉnh số tiền" onPress={closeModal} />
            <Input
              placeholder="Enter money"
              w="90%"
              onChangeText={inputText => setInputText(inputText)}
              keyboardType="numeric"
              value={inputText}
              maxLength={8}
            />
            <TouchableOpacity style={styles.buttonStyle} onPress={saveQR}>
              <Text style={styles.buttonTextStyle}>Generate QR Code</Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
