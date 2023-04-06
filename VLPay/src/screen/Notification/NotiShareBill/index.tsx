import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  Center,
  FormControl,
  Heading,
  HStack,
  Image,
  ScrollView,
  Text,
  TextArea,
  View,
  VStack,
} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, TouchableOpacity, useWindowDimensions} from 'react-native';
import HeaderBack from '../../../components/HeaderBack';
import {
  MainStackNavigation,
  MainStackParamList,
} from '../../../stack/Navigation';
import {axiosClient} from '../../../components/apis/axiosClient';
import {baseUrl} from '../../../components/apis/baseUrl';
import {UText} from '../../../components/UText';
import Icons from '../../../components/Icons';
import {Controller, useForm} from 'react-hook-form';

interface Share {
  message: string;
}

const NotiShareBill = ({route}: any) => {
  const {order_id} = route.params;
  const [masterDataSource, setMasterDataSource] = useState([]);
  const navigation = useNavigation<MainStackNavigation>();
  const {width} = useWindowDimensions();
  const [profile, setProfile] = useState([]);
  const [DetailBill, setDetailBill] = useState([]);
  const [remind, setRemind] = useState(false);
  const [note, setNote] = useState('');
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<Share>({
    defaultValues: {
      message: '',
    },
  });

  const fetchData = async () => {
    try {
      const billDetail = await axiosClient.get(
        'share-bill/detail?order_id=' + order_id,
      );
      setDetailBill(billDetail?.data?.data);
      setMasterDataSource(billDetail?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  console.log('masterDataSource', masterDataSource);

  return (
    <View flex={1} backgroundColor="#ffffff">
      <HeaderBack title="Chia tiền" />
      <ScrollView flex={1}>
        <Center padding={5}>
          <HStack w="100%" justifyContent="flex-start" paddingBottom={5}>
            <VStack>
              <Heading>Thông tin đơn hàng.</Heading>
              <Text textDecorationLine="underline" color="#4285F4">
                Bấm vào đây để xem chi tiết
              </Text>
            </VStack>
          </HStack>

          <HStack w="100%" justifyContent="space-between">
            <Text fontSize={16} fontWeight="bold">
              Danh sách chia tiền({masterDataSource.length})
            </Text>
            <Text></Text>
          </HStack>
          <ScrollView style={{width: '100%'}}>
            {masterDataSource.map(item => (
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
                    source={{uri: item?.shared_user?.image}}
                    w={42}
                    height={42}
                    alt="image"
                    borderRadius={50}
                  />
                  <Text paddingLeft={3}>{item?.shared_user?.f_name}</Text>
                </HStack>
                <VStack>
                  <Text>{item?.amount.toLocaleString()}đ</Text>
                </VStack>
              </HStack>
            ))}
          </ScrollView>
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
              <UText style={{fontWeight: '700'}}>Xác nhận trả tiền</UText>
              <TouchableOpacity
                onPress={() => setRemind(false)}
                style={{position: 'absolute', right: 20, top: 15}}>
                <UText>
                  <Icons.CloseIcon />
                </UText>
              </TouchableOpacity>
            </HStack>
            <View style={{marginHorizontal: 16, marginTop: 20}}>
              <Controller
                control={control}
                rules={{
                  required: 'Không được để trống',
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <FormControl isInvalid={errors.message !== undefined}>
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
                      value={value}
                      placeholder="Nhập nhắc nhở"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCompleteType={undefined}
                      maxLength={50}
                    />
                    <FormControl.ErrorMessage>
                      {errors.message?.message}
                    </FormControl.ErrorMessage>
                  </FormControl>
                )}
                name="message"
              />

              <View padding={5}>
                <TouchableOpacity onPress={async () => {}}>
                  <Center
                    backgroundColor="#B5EAD8"
                    padding={5}
                    borderRadius={10}>
                    <Text fontSize={16} fontWeight="700">
                      Gửi
                    </Text>
                  </Center>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
      <HStack
        padding={5}
        w={width}
        backgroundColor="yellow"
        justifyContent="space-between">
        <TouchableOpacity onPress={() => setRemind(true)}>
          <Center
            w={160}
            backgroundColor="#ffffff"
            borderWidth={1}
            padding={5}
            borderRadius={10}>
            <Text fontSize={16} fontWeight="bold">
              Trả rồi nha
            </Text>
          </Center>
        </TouchableOpacity>

        <TouchableOpacity>
          <Center
            w={160}
            backgroundColor="#B5EAD8"
            borderWidth={1}
            padding={5}
            borderRadius={10}>
            <Text fontSize={16} fontWeight="bold">
              Chuyển tiền
            </Text>
          </Center>
        </TouchableOpacity>
      </HStack>
    </View>
  );
};

export default NotiShareBill;
