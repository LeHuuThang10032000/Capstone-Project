import {HStack, VStack} from 'native-base';
import React, {useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import HeaderBack from '../../components/HeaderBack';
import TText from '../Transfer/TText';
import YesNoModal from '../../components/YesNoModal';
import Icons from '../../components/icons';
import Colors from '../../components/helpers/Colors';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {MainStackNavigation, MainStackParamList} from '../../stack/Navigation';

const WithDrawInfo = () => {
  const [visibleWarning, setVisibleWarning] = useState(false);
  const [infoWithdraw, setInfoWithdraw] = useState(false);
  const {isWithdraw} =
    useRoute<RouteProp<MainStackParamList, 'WithDrawInfo'>>()?.params;

  const navigation = useNavigation<MainStackNavigation>();
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <HeaderBack title={isWithdraw ? 'Rút tiền' : 'Nạp tiền'} />
      {infoWithdraw ? (
        <VStack style={{flex: 1}} alignItems={'center'} paddingX={3}>
          <TText style={{fontWeight: '700', fontSize: 18, marginTop: 20}}>
            {isWithdraw ? 'Thông tin rút tiền' : 'Thông tin nạp tiền'}
          </TText>
          <TText style={{fontSize: 18, marginTop: 5}}>
            {isWithdraw ? 'Mã rút' : 'Mã nạp'}: 8713
          </TText>
          <HStack
            justifyContent={'space-between'}
            width={'100%'}
            marginTop={5}
            marginBottom={5}>
            <TText style={{fontSize: 18}}>Họ tên:</TText>
            <TText style={{fontSize: 18, opacity: 0.31}}>Hàng Hữu Lộc</TText>
          </HStack>
          <HStack
            justifyContent={'space-between'}
            width={'100%'}
            marginBottom={5}>
            <TText style={{fontSize: 18}}>
              Số tiền yêu cầu {isWithdraw ? 'rút' : 'nạp'}:
            </TText>
            <TText style={{fontSize: 18, opacity: 0.31}}>1.000.000đ</TText>
          </HStack>
          <HStack
            justifyContent={'space-between'}
            width={'100%'}
            marginBottom={5}>
            <TText style={{fontSize: 18}}>Ngày giao dịch:</TText>
            <TText style={{fontSize: 18, opacity: 0.31}}>15/12/2022</TText>
          </HStack>
          <HStack
            justifyContent={'space-between'}
            width={'100%'}
            marginBottom={5}>
            <View>
              <TText
                style={{
                  fontSize: 18,
                  borderBottomWidth: 1,
                  borderBottomColor: 'red',
                }}>
                Tải xuống thông tin tại đây
              </TText>
            </View>
            <VStack alignItems={'center'}>
              <Icons.PDFIcon />
              <TText>Bấm để tải</TText>
            </VStack>
          </HStack>

          <View
            style={{
              width: '100%',
              position: 'absolute',
              bottom: 30,
            }}>
            <TText style={{marginBottom: 20, color: 'red', fontSize: 18}}>
              <TText style={{fontWeight: '700', fontSize: 18}}>Lưu ý:</TText>{' '}
              Sau khi tải xuống thông tin bạn cần đem thông tin này đến trung
              tâm hỗ trợ của VLPay tại trường để được nhân viên hỗ trợ xét duyệt
              {isWithdraw ? ' rút tiền' : ' nạp tiền'}
            </TText>
            <TouchableOpacity
              onPress={() => {
                console.log(123);

                navigation.reset({
                  index: 0,
                  routes: [{name: 'Home'}],
                });
                navigation.navigate('Home');
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                backgroundColor: '#B5EAD8',
                paddingVertical: 10,
                borderRadius: 8,
              }}>
              <TText style={{fontWeight: '700'}}>Xong</TText>
            </TouchableOpacity>
          </View>
        </VStack>
      ) : (
        <>
          <VStack
            justifyContent={'center'}
            alignItems={'center'}
            borderWidth={1}
            borderColor={'#ABABAB'}
            marginY={10}
            space={5}
            marginX={1}
            paddingY={3}>
            <TText style={{fontSize: 24, fontWeight: '700'}}>Ví của bạn</TText>
            <TText
              style={{fontWeight: 18, fontWeight: '700', color: '#8C8C8C'}}>
              Số tiền: 10.000.000đ
            </TText>
          </VStack>

          <TextInput
            placeholder="Nhập số tiền cần rút"
            style={{
              borderWidth: 1,
              borderRadius: 8,
              marginHorizontal: 20,
              backgroundColor: '#FAFAFA',
            }}
            keyboardType={'phone-pad'}
          />
          <TText
            style={{
              opacity: 0.26,
              alignSelf: 'center',
              marginBottom: 20,
              marginTop: 10,
            }}>
            Rút tối thiểu 50.000đ. Rút tối đa 10.000.000đ
          </TText>
          <HStack justifyContent={'center'} space={5}>
            <TouchableOpacity>
              <TText
                style={{
                  padding: 5,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#ABABAB',
                  fontSize: 18,
                }}>
                50.000đ
              </TText>
            </TouchableOpacity>
            <TouchableOpacity>
              <TText
                style={{
                  padding: 5,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#ABABAB',
                  fontSize: 18,
                }}>
                100.000đ
              </TText>
            </TouchableOpacity>
            <TouchableOpacity>
              <TText
                style={{
                  padding: 5,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#ABABAB',
                  fontSize: 18,
                }}>
                200.000đ
              </TText>
            </TouchableOpacity>
          </HStack>
          <View
            style={{
              width: '100%',
              paddingHorizontal: 20,
              position: 'absolute',
              bottom: 30,
            }}>
            <TouchableOpacity
              onPress={async () => {
                setVisibleWarning(true);
                setInterval(() => {
                  setVisibleWarning(false);
                  setInfoWithdraw(true);
                }, 2000);
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                backgroundColor: '#B5EAD8',
                paddingVertical: 10,
                borderRadius: 8,
              }}>
              <TText style={{fontWeight: '700'}}>Gửi yêu cầu</TText>
            </TouchableOpacity>
          </View>
        </>
      )}
      <YesNoModal
        icon={<Icons.SuccessIcon />}
        visible={visibleWarning}
        btnLeftStyle={{
          backgroundColor: Colors.primary,
          width: 200,
        }}
        hideRight={true}
        hideLeft={true}
        btnRightStyle={{
          backgroundColor: '#909192',
          width: 200,
          display: 'none',
        }}
        message={`Gửi yêu cầu ${
          isWithdraw ? ' rút tiền ' : ' nạp tiền '
        }thành công`}
        onActionLeft={() => {
          setVisibleWarning(false);
        }}
        onActionRight={() => {
          setVisibleWarning(false);
        }}
        btnTextLeft={'Xác nhận'}
        style={{flexDirection: 'column'}}
      />
    </View>
  );
};

export default WithDrawInfo;
