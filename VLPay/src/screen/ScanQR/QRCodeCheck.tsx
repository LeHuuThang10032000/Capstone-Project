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
  const [changePage, setChangePage] = React.useState(false);
  const [ScanAgain, setScanAgain] = React.useState(false);
  const [value, setValue] = React.useState(null);
  const [_data, setData] = React.useState([]);
  const [isActive, setIsActive] = React.useState(true);
  const [__result, setResult] = React.useState('');

  let [frameProcessor, barcodes] = useScanBarcodes(
    [BarcodeFormat.ALL_FORMATS],
    {checkInverted: true},
  );

  function debounce(func, delay) {
    let timeoutId;

    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  }

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  React.useEffect(() => {
    setInterval(async () => {
      const __result = await axiosClient.get('/parking-fee/check-valid');
      let bool = __result?.data?.data;
      console.log(bool);

      if (bool !== 'valid') {
        navigation.goBack();
      }
    }, 1000);
  }, []);
  console.log('====================================');
  console.log(data);
  console.log('====================================');

  React.useEffect(() => {
    // console.log(typeof barcodes);
  }, [barcodes]);

  const handleScan = React.useCallback(async () => {
    if (!data?.isParking) {
      if (barcodes[0]?.displayValue && !ScanAgain) {
        try {
          const code = barcodes[0].displayValue.toString();
          await axiosClient.get('parking-fee/scan?code=' + code);
          barcodes = [];
          setScanAgain(true);
          setValue(true);
          setChangePage(true);
        } catch (e) {
          barcodes = [];
          setValue(false);
          setScanAgain(true);
          setChangePage(true);
        }
        barcodes = [];
      }
    }
  }, [barcodes, setChangePage, data]);

  React.useEffect(() => {
    if (barcodes.length > 0 && !data?.isParking) {
      handleScan();
    }
  }, [barcodes]);

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
              flexDirection: 'column',
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

            <View
              style={{
                width: '100%',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <UText style={{marginTop: 20, fontSize: 20}}>
                Hãy đưa mã này cho
              </UText>
              <UText style={{fontSize: 20}}>bác bảo vệ scan nhé.</UText>
            </View>
          </View>
        ) : (
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isActive}
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
          />
        )}
        <YesNoModal
          icon={value === false ? <Icons.WarningIcon /> : <Icons.SuccessIcon />}
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
            value === true ? 'Mã qrcode hợp lệ' : 'Mã qrcode không hợp lệ'
          }
          title={'Kết quả quét'}
          onActionLeft={() => {
            setScanAgain(false);
            setChangePage(false);
          }}
          onActionRight={() => {
            setScanAgain(false);
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
