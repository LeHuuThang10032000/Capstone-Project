import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  Center,
  Heading,
  HStack,
  Image,
  ScrollView,
  Text,
  TextArea,
  View,
  VStack,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Alert, TouchableOpacity} from 'react-native';
import HeaderBack from '../../../components/HeaderBack';
import {
  MainStackNavigation,
  MainStackParamList,
} from '../../../stack/Navigation';
import Speaker from '../../../assets/svg/speaker.svg';
import {UText} from '../../../components/UText';
import Icons from '../../../components/Icons';
import {axiosClient} from '../../../components/apis/axiosClient';
import YesNoModal from '../../../components/YesNoModal';
import Colors from '../../../components/helpers/Colors';

type Props = {};

const SendRequestShare = (props: Props) => {
  const {data} = useRoute<RouteProp<MainStackParamList, 'WithDraw'>>()?.params;
  const [masterDataSource, setMasterDataSource] = useState([]);
  const navigation = useNavigation<MainStackNavigation>();
  const [remind, setRemind] = useState(false);
  const [note, setNote] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [visibleWarning, setVisibleWarning] = useState(false);

  useEffect(() => {
    setRemind(false);
  }, []);

  return (
    <View flex={1} backgroundColor="#ffffff">
      <HeaderBack title="Chi tiết" />
      <ScrollView flex={1}>
        <Center padding={5}>
          <HStack w="100%" justifyContent="flex-start">
            <VStack>
              <Heading>Thông tin đơn hàng.</Heading>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ShareBill', {
                    data,
                  })
                }>
                <Text textDecorationLine="underline" color="#4285F4">
                  Bấm vào đây để xem chi tiết
                </Text>
              </TouchableOpacity>
            </VStack>
          </HStack>

          <Center>
            <HStack
              marginY={5}
              borderRadius={8}
              w="100%"
              backgroundColor="#B5EAD8"
              padding={3}>
              <Speaker />
              <Text w={300} paddingLeft={3}>
                VL Pay sẽ tự động gửi lời nhắc đến những ai chưa trả sau 1 ngày
                kể từ lúc yêu cầu được gửi. Trong trường hợp họ vẫn quên, VLPay
                sẽ báo bạn nha.
              </Text>
            </HStack>
          </Center>

          <HStack w="100%" justifyContent="space-between">
            <Text fontSize={16} fontWeight="bold">
              Danh sách chia tiền({data?.masterDataSource.length ?? 0})
            </Text>
            {/* <Text fontSize={16} fontWeight="bold" color="#FF0000">
              Thêm người
            </Text> */}
          </HStack>

          {data?.masterDataSource.map(item => (
            <HStack
              w="100%"
              alignItems="center"
              justifyContent="space-between"
              borderWidth={1}
              padding={3}
              borderRadius={8}
              marginY={3}>
              <HStack alignItems="center">
                <Image
                  source={{uri: item?.picture}}
                  w={42}
                  height={42}
                  alt="image"
                  borderRadius={50}
                />
                <Text paddingLeft={3}>{item.f_name}</Text>
              </HStack>
              <VStack>
                <Text>
                  {(
                    parseInt(data?.amount) /
                    (data?.masterDataSource?.length + 1)
                  ).toLocaleString()}
                  đ
                </Text>
              </VStack>
            </HStack>
          ))}
        </Center>
      </ScrollView>
      {remind && (
        <View
          style={{
            width: '100%',
            height: 300,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            zIndex: 1000,

            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: '99%',
              borderRadius: 10,
              borderColor: 'rgba(0, 0, 0, 0.35)',
              borderWidth: 1,
            }}>
            <HStack
              style={{
                width: '100%',
                justifyContent: 'center',
                borderBottomWidth: 1,
                paddingVertical: 10,
                borderBottomColor: 'rgba(0, 0, 0, 0.35)',
              }}>
              <UText style={{fontWeight: '700'}}>Nhắc bạn</UText>
              <TouchableOpacity
                onPress={() => setRemind(false)}
                style={{position: 'absolute', right: 20, top: 15}}>
                <UText>
                  <Icons.CloseIcon />
                </UText>
              </TouchableOpacity>
            </HStack>
            <UText
              style={{
                alignSelf: 'center',
                textAlignVertical: 'center',
                marginTop: 10,
              }}>
              Nội dung lời nhắc sẽ được gửi đến thông
            </UText>
            <UText style={{alignSelf: 'center', textAlignVertical: 'center'}}>
              báo VLPay của bạn bè
            </UText>
            <View style={{marginHorizontal: 16, marginTop: 20}}>
              <View
                style={{
                  backgroundColor: 'white',
                  position: 'absolute',
                  top: -18,
                  left: 10,
                  width: 70,
                  height: 20,
                  zIndex: 1000,
                }}
              />
              <UText
                style={{
                  position: 'absolute',
                  top: -12,
                  left: 10,
                  backgroundColor: 'transparent',
                  zIndex: 1000,
                }}>
                Tin nhắn
              </UText>
              <TextArea
                value={note}
                placeholder="Nhập nhắc nhở"
                onChangeText={text => {
                  setNote(text);
                }}
                autoCompleteType={undefined}
              />
              <View padding={5}>
                <TouchableOpacity
                  onPress={async () => {
                    try {
                      data.note = note;
                      const order_id = data?.order_id;
                      data.isFinal = true;
                      const detail = [];
                      data?.checkedItems?.map(item => {
                        detail.push({
                          user_id: item,
                          amount:
                            parseInt(data?.amount) /
                            (data?.masterDataSource?.length + 1),
                        });
                      });

                      const result = await axiosClient.post('/share-bill', {
                        order_id,
                        detail,
                      });
                      data.result = result;
                      navigation.navigate('FinalShareBillDetail', {
                        data: data,
                      });
                    } catch (error) {
                      setGeneralError(error?.error);
                      setVisibleWarning(true);
                    }
                  }}>
                  <Center
                    backgroundColor="#B5EAD8"
                    padding={5}
                    borderRadius={10}>
                    <Text fontSize={16} fontWeight="700">
                      Nhắc nhở
                    </Text>
                  </Center>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
      <View padding={5}>
        <TouchableOpacity onPress={() => setRemind(true)}>
          <Center backgroundColor="#B5EAD8" padding={5} borderRadius={10}>
            <Text fontSize={16} fontWeight="700">
              Nhắc nhở
            </Text>
          </Center>
        </TouchableOpacity>
      </View>
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
        message={generalError}
        title={'Lỗi'}
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

export default SendRequestShare;
