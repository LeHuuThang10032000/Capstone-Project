import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';
import {Image} from 'native-base';
import YesNoModal from '../../components/YesNoModal';
import Icons from '../../components/Icons';
import Colors from '../../components/helpers/Colors';
import {axiosClient} from '../../components/apis/axiosClient';
import QRCode from 'react-native-qrcode-svg';

type Props = {
  wallet: any;
};

const Banner = (props: Props) => {
  const navigation = useNavigation<MainStackNavigation>();
  const [visibleWarning, setVisibleWarning] = useState(false);
  const paymentType = 'T';
  const [qrcode, setQrcode] = useState(false);
  const [value, setValue] = useState('0');
  console.log(props);

  return (
    <>
      <View>
        <ImageBackground
          source={require('../../assets/img/banner.png')}
          resizeMode="cover"
          style={{justifyContent: 'center', height: 150}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <View style={styles.wrapperButton}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Transfer', {
                    userWallet: props.wallet,
                    payment_type: paymentType,
                  })
                }>
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
              <TouchableOpacity
                onPress={() => {
                  if (props.wallet > 3000) {
                    navigation.navigate('ScanQR', props.wallet);
                  } else {
                    setVisibleWarning(true);
                  }
                }}>
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

            {!props?.isSecurity && (
              <View style={styles.wrapperButton}>
                <TouchableOpacity
                  onPress={async () => {
                    const result = await axiosClient.post('/parking-fee/pay');
                    setValue(result?.data?.data);
                    navigation.navigate('QRCodeCheck', {
                      value: result?.data?.data,
                      isParking: true,
                    });
                  }}>
                  <View style={styles.buttonTranfer}>
                    <Image
                      source={require('../../assets/img/scan.png')}
                      style={{width: 52, height: 52}}
                      alt={'just image'}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.text}>GỬI XE 3K</Text>
              </View>
            )}

            {props?.isSecurity !== 0 && (
              <View style={styles.wrapperButton}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('QRCodeCheck', props.wallet);
                  }}>
                  <View style={styles.buttonTranfer}>
                    <Image
                      source={require('../../assets/img/scan.png')}
                      style={{width: 52, height: 52}}
                      alt={'just image'}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.text}>KIỂM TRA MÃ</Text>
              </View>
            )}

            <View style={styles.wrapperButton}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('WithDraw', {
                    isWithdraw: true,
                  })
                }>
                <View style={styles.buttonTranfer}>
                  <Image
                    source={require('../../assets/img/withdraw.png')}
                    style={{width: 52, height: 52}}
                    alt={'just image'}
                  />
                </View>
              </TouchableOpacity>
              <Text style={styles.text}>RÚT TIỀN</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </>
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
