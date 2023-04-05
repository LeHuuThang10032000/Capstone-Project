import React, {useEffect, useState} from 'react';
import HeaderBack from '../../../components/HeaderBack';
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
import MessageIcon from '../../../assets/svg/message.svg';
import CloseIcon from '../../../assets/svg/close.svg';
import ImagePicker from 'react-native-image-crop-picker';
import {Alert, BackHandler, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../../stack/Navigation';
import {axiosClient} from '../../../components/apis/axiosClient';
import RNRestart from 'react-native-restart';
import Lottie from 'lottie-react-native';
import YesNoModal from '../../../components/YesNoModal';
import Icons from '../../../components/Icons';
import Colors from '../../../components/helpers/Colors';

interface Image {
  path: string;
}

const DetailBill = ({route}: any) => {
  const {data} = route.params;

  const [text, onChangeText] = useState('');
  const [image, setImage] = useState<Image>();
  const [masterDataSource, setMasterDataSource] = useState([]);
  const navigation = useNavigation<MainStackNavigation>();
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleWarning, setVisibleWarning] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [isSuccess, setSuccess] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const responseJson = await axiosClient.get('/friends');
      const result = await axiosClient.get(
        'https://zennoshop.cf/api/user/get-profile',
      );
      setProfile(result?.data?.data);
      const friends = responseJson?.data?.data.filter(item => {
        if (data?.checkedItems.includes(item?.id)) {
          return item;
        }
      });

      setMasterDataSource(friends);
      setLoading(false);
    } catch (error) {
      Alert.alert(error.error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ChoosePhotoFromLibrary = async () => {
    const image = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    });
    setImage(image);
  };

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
                    {profile.f_name} (Me)
                  </Text>
                </HStack>
                <VStack>
                  <Text>
                    {(
                      parseInt(data?.amount) /
                      (masterDataSource?.length + 1)
                    ).toLocaleString()}
                    đ
                  </Text>
                </VStack>
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
                    <VStack>
                      <Text>
                        {(
                          parseInt(data?.amount) /
                          (masterDataSource?.length + 1)
                        ).toLocaleString()}
                        đ
                      </Text>
                    </VStack>
                  </HStack>
                );
              })}
            </Center>
          </ScrollView>
          <View padding={5}>
            <TouchableOpacity
              onPress={async () => {
                try {
                  if (!data.checkedItems.includes(profile?.id)) {
                    data.checkedItems.push(profile?.id);
                  }
                  data.masterDataSource = masterDataSource;
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

                  await axiosClient.post('/share-bill', {
                    order_id,
                    detail,
                  });
                  setSuccess(true);
                  navigation.navigate('Home');
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
        message={generalError}
        title={'Thông báo thành công'}
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
