import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import * as React from 'react';

import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useCameraDevices} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import Colors from '../../components/helpers/Colors';
import Icons from '../../components/Icons';
import YesNoModal from '../../components/YesNoModal';
import {MainStackNavigation, MainStackParamList} from '../../stack/Navigation';
import {UText} from '../../components/UText';
import {axiosClient} from '../../components/apis/axiosClient';
import {Image, VStack, View} from 'native-base';
import QRCode from 'react-native-qrcode-svg';
type Props = {
  wallet: any;
};
export default function QRCodeCheck(props: Props) {
  const data = useRoute<RouteProp<MainStackParamList, 'Otp'>>()?.params;

  const [hasPermission, setHasPermission] = React.useState(false);
  const navigation = useNavigation<MainStackNavigation>();
  const devices = useCameraDevices();
  const device = devices.back;
  const [visibleWarning, setVisibleWarning] = React.useState(false);
  const [changePage, setChangePage] = React.useState(false);
  const [ScanAgain, setScanAgain] = React.useState(false);
  const [value, setValue] = React.useState('');

  const userWallet = props?.route?.params ?? 0;

  const [frameProcessor, barcodes] = useScanBarcodes(
    [BarcodeFormat.ALL_FORMATS],
    {checkInverted: true},
  );

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  React.useEffect(() => {
    // console.log(typeof barcodes);
  }, [barcodes]);

  const handleScan = React.useCallback(async () => {
    if (!data?.isParking) {
      barcodes.forEach(async barcode => {
        if (barcode?.displayValue) {
          try {
            const code = barcode?.displayValue;
            const result = await axiosClient.get('/parking-fee/scan', {code});
            setValue(result?.data?.data);
            console.log('result?.data?.data', result?.data?.data);

            setChangePage(true);
          } catch (e) {}
        }
      });
    }
  }, [barcodes, setChangePage, data]);

  React.useEffect(() => {
    if (barcodes.length > 0 && !data?.isParking) {
      handleScan();
    }
  }, [barcodes, handleScan]);

  return (
    device != null &&
    hasPermission && (
      <>
        {data?.isParking ? (
          <View
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              zIndex: 10000,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
            }}>
            <QRCode
              //QR code value
              value={data?.value.toString()}
              // value="https://randomuser.me/api/portraits/men/78.jpg"
              //size of QR Code
              size={300}
              //Color of the QR Code (Optional)
              color="black"
              //Background Color of the QR Code (Optional)
              backgroundColor="white"
              //Logo of in the center of QR Code (Optional)
              //Center Logo size  (Optional)
              logoSize={30}
              //Center Logo margin (Optional)
              logoMargin={2}
              //Center Logo radius (Optional)
              logoBorderRadius={15}
              //Center Logo background (Optional)
              logoBackgroundColor="#B5EAD8"
            />
          </View>
        ) : (
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
          />
        )}

        <YesNoModal
          icon={
            value === 'valid' ? (
              <Icons.SuccessIcon />
            ) : (
              <Image source={require('../../assets/img/success.png')} />
            )
          }
          visible={changePage}
          btnLeftStyle={{
            backgroundColor: Colors.primary,
            width: 200,
          }}
          btnRightStyle={{
            backgroundColor: '#909192',
            width: 200,
            display: 'none',
          }}
          message={
            value === 'valid' ? 'Mã qrcode hợp lệ' : 'Mã qrcode không hợp lệ'
          }
          title={'Kết quả quét'}
          onActionLeft={() => {
            setChangePage(false);
          }}
          onActionRight={() => {
            setChangePage(false);
          }}
          btnTextLeft={'Xác nhận'}
          style={{flexDirection: 'column'}}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            left: 10,
            zIndex: 1000000000,
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <UText
            style={{
              fontSize: 40,
              color: 'black',
            }}>
            {'<'}
          </UText>
        </TouchableOpacity>
      </>
    )
  );
}

const styles = StyleSheet.create({
  barcodeTextURL: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});
