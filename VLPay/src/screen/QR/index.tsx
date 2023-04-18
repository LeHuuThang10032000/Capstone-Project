// Generation of QR Code in React Native
// https://aboutreact.com/generation-of-qr-code-in-react-native/

// import React in our code
import React, {useCallback, useEffect, useState} from 'react';

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
import {Input, Button} from 'native-base';
import {
  escapeCurrency,
  formatCurrency,
} from '../../components/helpers/formatNum';
import HeaderBack from '../../components/HeaderBack';
import {axiosClient} from '../../components/apis/axiosClient';
import {useIsFocused} from '@react-navigation/native';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [qrvalue, setQrvalue] = useState('');
  const [moneyInput, setmoneyInput] = useState('');
  const [error, setError] = useState('');
  const [disabledButton, setDisabledButton] = useState(true);
  const handleChangeInput = useCallback((str: string) => {
    let money = 0;
    money = parseInt(formatCurrency(escapeCurrency(str)).replace(/,/g, ''));

    if (str.length == 0) {
      setError('Vui lòng nhập số tiền để tạo mã QR!');
      setDisabledButton(true);
    } else if (str == '0') {
      setDisabledButton(true);
    } else {
      setError('');
      setDisabledButton(false);
    }
    setmoneyInput(formatCurrency(escapeCurrency(str)));
  }, []);

  const {modalVisible, setModalVisible, closeModal} = ModalProvider();
  const toggleModal = () => {
    setModalVisible(true);
  };
  const setValueQR = () => setQrvalue(`${profile?.data?.phone},${moneyInput}`);
  const saveQR = () => {
    setValueQR();
    closeModal();
  };

  const [profile, setProfile] = useState({});

  const fetchData = useCallback(async () => {
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/get-profile',
    );
    setProfile(result.data);
  }, []);
  const isFocused = useIsFocused();

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      fetchData();
    }
  }, [fetchData, isFocused]);

  console.log(qrvalue);

  return (
    <SafeAreaView style={{flex: 1}}>
      <HeaderBack title="Mã QR của bạn" />
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
          logo={{uri: profile?.data?.image}}
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
          Vui lòng quét mã QR này để thực hiện giao dịch.
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
              placeholder="Vui lòng nhập số tiền"
              w="90%"
              // onChangeText={inputText => setInputText(inputText)}
              onChangeText={handleChangeInput}
              keyboardType="numeric"
              value={moneyInput}
              InputRightElement={<Text style={{paddingRight: 10}}>VND</Text>}
            />
            {error && (
              <Text
                allowFontScaling={false}
                style={{marginTop: 5, color: 'red'}}>
                {error}
              </Text>
            )}
            {/* <TouchableOpacity
              style={[
                styles.buttonStyle,
                disabledButton
                  ? {
                      backgroundColor: '#979797',
                    }
                  : {
                      backgroundColor: '#B5EAD8',
                    },
              ]}
              disabled={disabledButton || moneyInput.length === 0}
              onPress={saveQR}>
              <Text style={styles.buttonTextStyle}>Generate QR Code</Text>
            </TouchableOpacity> */}
            <Button
              style={[
                disabledButton
                  ? {
                      backgroundColor: '#979797',
                    }
                  : {
                      backgroundColor: '#B5EAD8',
                    },
                styles.buttonSave,
              ]}
              _text={{color: '#514545', fontFamily: 'Poppins-Bold'}}
              disabled={disabledButton}
              isDisabled={moneyInput.length === null}
              onPress={saveQR}>
              Tạo mã QR
            </Button>
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
  buttonSave: {
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 30,
    padding: 10,
    width: '90%',
  },
});
