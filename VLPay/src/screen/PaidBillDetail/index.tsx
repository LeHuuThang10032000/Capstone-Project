import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  Center,
  Divider,
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
import HeaderBack from '../../components/HeaderBack';
import {MainStackNavigation, MainStackParamList} from '../../stack/Navigation';
import {axiosClient} from '../../components/apis/axiosClient';
import {baseUrl} from '../../components/apis/baseUrl';
import {UText} from '../../components/UText';
import Icons from '../../components/Icons';
import {Controller, useForm} from 'react-hook-form';
import ModalProvider from '../../context/ModalProvider';
import Modal from 'react-native-modal';
import HeaderModal from '../../components/CustomRemind/HeaderModal';
import BodyModal from '../../components/CustomRemind/BodyModal';
import Speaker from '../../assets/svg/speaker.svg';

interface Share {
  message: string;
}

const PaidBillDetail = ({route}: any) => {
  const {order_id, userWallet} = route.params;

  const [masterDataSource, setMasterDataSource] = useState([]);
  const navigation = useNavigation<MainStackNavigation>();
  const {width} = useWindowDimensions();
  const [profile, setProfile] = useState([]);
  const [DetailBill, setDetailBill] = useState([]);
  const [remind, setRemind] = useState(false);
  const [note, setNote] = useState('');
  const paymentType = 'S';
  const [phone, setPhone] = useState('');
  const [isYour, setIsYour] = useState(0);
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const {modalVisible, toggleModal, closeModal} = ModalProvider();
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
      if (
        billDetail.data.data.map(
          (item: {
            amount: number;
            is_your: number;
            shared_user: any;
            is_owner: number;
            id: number;
            shared_name: string;
          }) => {
            if (item.is_owner === 1) {
              setPhone(item.shared_user.phone);
              setName(item.shared_name);
            }
            if (item.is_your === 1) {
              setIsYour(item?.id);
              setAmount(item.amount);
              setCurrentUser(item.shared_user.phone);
            }
          },
        )
      )
        setNote('');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data: any) => {
    console.log(data);
  };

  return (
    <View flex={1} backgroundColor="#ffffff">
      <HeaderBack title="Chia tiền" />
      <ScrollView flex={1}>
        <Center padding={5}>
          <HStack w="100%" justifyContent="flex-start" paddingBottom={5}>
            <VStack>
              <Heading>Thông tin đơn hàng.</Heading>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('DetailBillShare', {order_id: order_id})
                }>
                <Text textDecorationLine="underline" color="#4285F4">
                  Bấm vào đây để xem chi tiết
                </Text>
              </TouchableOpacity>
            </VStack>
          </HStack>

          <HStack
            marginY={5}
            borderRadius={8}
            w="100%"
            backgroundColor="#B5EAD8"
            padding={3}>
            <Speaker />
            <Text fontSize={12} w={270} paddingLeft={3}>
              VL Pay sẽ tự động gửi lời nhắc đến những ai chưa trả sau 1 ngày kể
              từ lúc yêu cầu được gửi. Trong trường hợp họ vẫn quên, VLPay sẽ
              báo bạn nha.
            </Text>
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
                  <Text paddingLeft={3}>
                    {item?.is_owner === 1
                      ? item?.shared_user?.f_name + '(Tôi)'
                      : item?.shared_user?.f_name}
                  </Text>
                </HStack>
                <VStack>
                  <Text>
                    {item?.status === 'pending' ? (
                      item?.amount.toLocaleString() + 'đ'
                    ) : item?.status === 'paid' ? (
                      <Text color={'red.500'} fontWeight={'bold'}>
                        Đã trả
                      </Text>
                    ) : null}
                  </Text>
                </VStack>
              </HStack>
            ))}
          </ScrollView>
        </Center>
      </ScrollView>
      <Center w={width}>
        {/* <TouchableOpacity onPress={() => setRemind(true)}>
          <Center
            w={150}
            backgroundColor="#ffffff"
            borderWidth={1}
            padding={5}
            borderRadius={10}>
            <Text fontSize={16} fontWeight="bold">
              Trả rồi nha
            </Text>
          </Center>
        </TouchableOpacity> */}

        <TouchableOpacity onPress={toggleModal}>
          <View
            w={350}
            marginBottom={3}
            backgroundColor="#B5EAD8"
            borderWidth={1}
            padding={5}
            justifyContent={'center'}
            alignItems={'center'}
            borderRadius={10}>
            <Text fontSize={16} fontWeight="bold">
              Nhắc nhở
            </Text>
          </View>
        </TouchableOpacity>
      </Center>

      <Modal
        isVisible={modalVisible}
        animationIn="slideInUp"
        animationOut="fadeOutDown"
        style={{margin: 0, justifyContent: 'flex-end', alignItems: 'center'}}>
        <View
          style={{
            height: 300,
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}>
          <HeaderModal title="Đăng xuất" onPress={closeModal} />
          <BodyModal
            cancel="cancel"
            confirm="confirm"
            onPressCancel={closeModal}
            onPressConfirm={() => console.log('clicked')}
            orderId={order_id}
          />
        </View>
      </Modal>
    </View>
  );
};

export default PaidBillDetail;
