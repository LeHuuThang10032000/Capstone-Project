import {useNavigation} from '@react-navigation/native';
import * as React from 'react';

import {StyleSheet, Text} from 'react-native';
import {useCameraDevices} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import {MainStackNavigation} from '../../stack/Navigation';
type Props = {
  wallet: any;
};
export default function Index(props: Props) {
  const [hasPermission, setHasPermission] = React.useState(false);
  const navigation = useNavigation<MainStackNavigation>();
  const devices = useCameraDevices();
  const device = devices.back;

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

  return (
    device != null &&
    hasPermission && (
      <>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
        />
        {barcodes.map((barcode, idx) => {
          if (barcode?.displayValue) {
            let data = barcode?.displayValue.split('//')[1];
            data = data.replace('{', '').replace('}', '').split(',');
            const id_user = data[0].split(':');
            const to_pay = data[1].split(':');
            const data_navigation = {
              id_user: id_user[1],
              to_pay: to_pay[1],
              user_wallet: userWallet,
            };
            navigation.navigate('Payment', {
              data: data_navigation,
            });
          }
        })}
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
