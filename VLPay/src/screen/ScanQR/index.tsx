import {useNavigation} from '@react-navigation/native';
import * as React from 'react';

import {StyleSheet, Text} from 'react-native';
import {useCameraDevices} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import Colors from '../../components/helpers/Colors';
import Icons from '../../components/Icons';
import YesNoModal from '../../components/YesNoModal';
import {MainStackNavigation} from '../../stack/Navigation';
type Props = {
  wallet: any;
};
export default function Index(props: Props) {
  const [hasPermission, setHasPermission] = React.useState(false);
  const navigation = useNavigation<MainStackNavigation>();
  const devices = useCameraDevices();
  const device = devices.back;
  const [visibleWarning, setVisibleWarning] = React.useState(false);

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
        <YesNoModal
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
          message={'Qrcode không hợp lệ'}
          title={'Thông báo lỗi'}
          onActionLeft={() => {
            setVisibleWarning(false);
          }}
          onActionRight={() => {
            setVisibleWarning(false);
          }}
          btnTextLeft={'Xác nhận'}
          style={{flexDirection: 'column'}}
        />
        {barcodes.map((barcode, idx) => {
          if (barcode?.displayValue) {
            try {
              let data = barcode?.displayValue;
              const phone = data.split(',')[0];
              const money = data.split(',')[1];
              const data_navigation = {
                phone,
                money,
                user_wallet: userWallet,
              };
              if (phone && money && userWallet) {
                navigation.navigate('Payment', {
                  data: data_navigation,
                });
              }
            } catch (e) {}
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
