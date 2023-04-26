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

type Props = {
  wallet: any;
};

const Banner = (props: Props) => {
  const navigation = useNavigation<MainStackNavigation>();
  const [visibleWarning, setVisibleWarning] = useState(false);
  const paymentType = 'T';
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
          {/* <YesNoModal
            icon={<Icons.WarningIcon />}
            visible={visibleWarning}
            btnLeftStyle={{
              backgroundColor: Colors.primary,
              width: 200,
            }}
            btnRightStyle={{
              backgroundColor: '#909192',
              width: 200,
              display: 'none',
            }}
            message={'Số dư trong ví không đủ để thực hiện'}
            title={'Thông báo lỗi'}
            onActionLeft={() => {
              setVisibleWarning(false);
            }}
            onActionRight={() => {
              setVisibleWarning(false);
            }}
            btnTextLeft={'Xác nhận'}
            style={{flexDirection: 'column'}}
          /> */}
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
