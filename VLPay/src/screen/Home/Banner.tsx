import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import TopUp from '../../assets/svg/topup.svg';
import Withdraw from '../../assets/svg/withdraw.svg';
import QRcode from '../../assets/svg/qrcode.svg';
import ScanQR from '../../assets/svg/scanqr.svg';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';
import {Image} from 'native-base';

type Props = {};

const Banner = (props: Props) => {
  const navigation = useNavigation<MainStackNavigation>();
  return (
    <View>
      <ImageBackground
        source={require('../../assets/img/banner.png')}
        resizeMode="cover"
        style={{justifyContent: 'center', height: 150}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginHorizontal: 20,
          }}>
          <View style={styles.wrapperButton}>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <View style={styles.buttonTranfer}>
                <Image
                  source={require('../../assets/img/moneytranfer.png')}
                  style={{width: 52, height: 52}}
                  alt={'just image'}
                />
              </View>
            </TouchableOpacity>
            <Text style={styles.text}>CHUYỂN TIỀN</Text>
          </View>

          <View style={styles.wrapperButton}>
            <TouchableOpacity onPress={() => console.log('with draw!')}>
              <View style={styles.buttonTranfer}>
                <Image
                  source={require('../../assets/img/scan.png')}
                  style={{width: 52, height: 52}}
                  alt={'just image'}
                />
              </View>
            </TouchableOpacity>
            <Text style={styles.text}>QUÉT MÃ</Text>
          </View>

          {/* <View style={styles.wrapperButton}>
            <TouchableOpacity onPress={() => navigation.navigate('QR')}>
              <View style={styles.button}>
                <QRcode />
              </View>
            </TouchableOpacity>
            <Text style={styles.text}>QR CODE</Text>
          </View>

          <View style={styles.wrapperButton}>
            <TouchableOpacity onPress={() => console.log('scan qr!')}>
              <View style={styles.button}>
                <ScanQR />
              </View>
            </TouchableOpacity>
            <Text style={styles.text}>SCAN QR</Text>
          </View> */}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffffff',
    width: 52,
    height: 52,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  buttonTranfer: {
    width: 52,
    height: 52,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  wrapperButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
    paddingTop: 5,
    fontFamily: 'Poppins-Regular',
  },
});

export default Banner;
