import React, {useEffect, useState} from 'react';
import HeaderBack from '../../../components/HeaderBack';
import {
  Center,
  Heading,
  HStack,
  Image,
  Input,
  ScrollView,
  Text,
  TextArea,
  View,
  VStack,
} from 'native-base';
import MessageIcon from '../../../assets/svg/message.svg';
import CloseIcon from '../../../assets/svg/close.svg';
import ImagePicker from 'react-native-image-crop-picker';
import {Alert, BackHandler, Modal, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../../stack/Navigation';
import {axiosClient} from '../../../components/apis/axiosClient';
import RNRestart from 'react-native-restart';
import Lottie from 'lottie-react-native';
import YesNoModal from '../../../components/YesNoModal';
import Icons from '../../../components/Icons';
import Colors from '../../../components/helpers/Colors';
import {UText} from '../../../components/UText';

interface Image {
  path: string;
}

const DetailBill = ({route}: any) => {
  const {data} = route.params;

  const [text, onChangeText] = useState('');
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [userMoney, setUserMoney] = useState(0);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const navigation = useNavigation<MainStackNavigation>();
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleWarning, setVisibleWarning] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [isSuccess, setSuccess] = useState(false);
  const [friends, setFriends] = useState(data?.checkedItems);
  const [modalVisible, setModalVisible] = useState(false);
  const [myMoney, setMyMoney] = useState(0);
  const [userId, setUserId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const responseJson = await axiosClient.get(
        '/friends?request_coming=active',
      );

      const result = await axiosClient.get(
        'https://zennoshop.cf/api/user/get-profile',
      );
      setProfile(result?.data?.data);
      const _friends = responseJson?.data?.data.filter(item => {
        if (item.id !== result?.data?.data?.id) return item;
      });

      const __friends = _friends.filter(item =>
        data.checkedItems.includes(item.id),
      );

      const ___friends = __friends.map(item => {
        item.amount = parseInt(
          parseInt(data?.amount) / (__friends?.length + 1),
        );

        item.isSetAmount = false;
        return item;
      });
      setMyMoney(parseInt(parseInt(data?.amount) / (__friends?.length + 1)));
      setMasterDataSource(___friends);
      setLoading(false);
    } catch (error) {
      Alert.alert(error.error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(masterDataSource);

  return (
    <View flex={1} backgroundColor="#ffffff">
      <HeaderBack title="Chia tiền" />

      {loading ? (
        <Center>
          <Lottie
            source={require('../../../assets/lottie-file/not-found.json')}
            autoPlay={true}
            style={{width: 100, height: 100}}
          />
        </Center>
      ) : (
        <>
          <ScrollView flex={1}>
            <Center padding={5}>
              <HStack w="100%" justifyContent="flex-start" paddingBottom={20}>
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
              <HStack w="100%" justifyContent="space-between">
                <Text fontSize={16} fontWeight="bold">
                  Danh sách chia tiền({masterDataSource?.length + 1 ?? 0})
                </Text>
                {!data?.isFinal && (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text fontSize={16} fontWeight="bold" color="#FF0000">
                      Thêm người
                    </Text>
                  </TouchableOpacity>
                )}
              </HStack>
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
                    source={{uri: profile?.image}}
                    w={42}
                    height={42}
                    alt="image"
                    borderRadius={50}
                  />
                  <Text paddingLeft={3} fontWeight={'700'}>
                    {profile.f_name} (Tôi)
                  </Text>
                </HStack>
                <HStack alignItems="center">
                  <Text paddingLeft={3} fontWeight={'700'}>
                    {myMoney.toLocaleString()} đ
                  </Text>
                </HStack>
              </HStack>
              {masterDataSource.map(item => {
                return (
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
                        source={{uri: item?.image}}
                        w={42}
                        height={42}
                        alt="image"
                        borderRadius={50}
                      />
                      <Text paddingLeft={3}>{item.f_name}</Text>
                    </HStack>
                    <HStack alignItems={'center'}>
                      <TouchableOpacity
                        onPress={() => {
                          setImage(item?.image);
                          setName(item?.f_name);
                          setUserMoney(item?.amount);
                          setUserId(item?.id);
                          setModalVisible(true);
                        }}>
                        <UText>{item?.amount.toLocaleString()} đ</UText>
                      </TouchableOpacity>
                    </HStack>
                  </HStack>
                );
              })}
            </Center>
          </ScrollView>
          <View padding={5}>
            <TouchableOpacity
              onPress={async () => {
                try {
                  data.masterDataSource = masterDataSource;
                  const masterdata = masterDataSource;
                  const order_id = data?.order_id;
                  data.isFinal = true;
                  const detail = [];
                  masterdata.push({
                    user_id: profile.id,
                    amount: myMoney,
                  });
                  masterdata.map(item => {
                    if (item?.id) {
                      detail.push({user_id: item.id, amount: item.amount});
                    } else {
                      detail.push({user_id: item.user_id, amount: item.amount});
                    }
                  });
                  await axiosClient.post('/share-bill', {
                    order_id,
                    detail,
                  });
                  setSuccess(true);
                  setTimeout(() => {
                    navigation.navigate('Home');
                  }, 2000);
                } catch (error) {
                  setVisibleWarning(true);
                  setGeneralError(error?.error);
                }
              }}>
              <Center backgroundColor="#B5EAD8" padding={5} borderRadius={10}>
                <Text fontSize={16} fontWeight="bold">
                  Chia tiền
                </Text>
              </Center>
            </TouchableOpacity>
          </View>
        </>
      )}
      {modalVisible && (
        <View
          style={{
            top: 0,
            position: 'absolute',
            width: '100%',
            height: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'black',
              opacity: 0.5,
              position: 'absolute',
            }}></View>
          <View
            style={{
              backgroundColor: 'white',
              minWidth: 300,
              minHeight: 100,
              justifyContent: 'center',
              flexDirection: 'row',
              borderRadius: 10,
              padding: 16,
            }}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{position: 'absolute', top: 10, left: 10}}>
              <UText>x</UText>
            </TouchableOpacity>
            <HStack alignItems={'center'}>
              <Image
                source={{uri: image}}
                w={50}
                height={50}
                alt="image"
                borderRadius={50}
                style={{marginRight: 10}}
                borderColor={'#D9D9D9'}
                borderWidth={1}
              />
              <VStack>
                <UText>{name}</UText>
                <Input
                  placeholder={userMoney.toLocaleString()}
                  style={{color: 'black'}}
                  keyboardType="number-pad"
                  onSubmitEditing={({nativeEvent: {text}}) => {
                    if (!isNaN(parseInt(text))) {
                      setUserMoney(parseInt(text));
                      let totalCash = 0;
                      console.log(parseInt(text));
                      const updatedDataSource = masterDataSource.map(item => {
                        if (item.id === userId) {
                          totalCash += parseInt(text);
                          return {...item, amount: parseInt(text)};
                        }
                        totalCash += parseInt(item.amount);
                        return item;
                      });
                      if (parseInt(data?.amount) - totalCash > 0) {
                        setMyMoney(parseInt(data?.amount) - totalCash);
                        setMasterDataSource(updatedDataSource);
                      } else if (parseInt(data?.amount) - totalCash < 0) {
                        setGeneralError(
                          'Không được vượt tổng số tiền trong hoá đơn',
                        );
                        setVisibleWarning(true);
                      }
                    } else {
                      setGeneralError('Số tiền không hợp lệ');
                      setVisibleWarning(true);
                    }
                    setModalVisible(false);
                  }}
                />
              </VStack>
            </HStack>
          </View>
        </View>
      )}
      <YesNoModal
        icon={<Icons.SuccessIcon />}
        visible={isSuccess}
        btnLeftStyle={{
          backgroundColor: Colors.primary,
          width: 200,
          display: 'none',
        }}
        btnRightStyle={{
          backgroundColor: '#909192',
          width: 200,
          display: 'none',
        }}
        message={'Chia tiền thành công'}
        title={'Thông báo'}
        onActionLeft={() => {
          setSuccess(false);
        }}
        onActionRight={() => {
          setSuccess(false);
        }}
        btnTextLeft={'Xác nhận'}
        style={{flexDirection: 'column'}}
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
        message={generalError}
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
    </View>
  );
};

export default DetailBill;
