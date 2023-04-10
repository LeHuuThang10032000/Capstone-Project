import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import HeaderBack from '../../components/HeaderBack';
import {Button, Center, HStack, Image, Input} from 'native-base';
import AddFriendIcon from '../../assets/svg/add-friend.svg';
import AddFriend from '../../assets/svg/add-friend.svg';
import DeleteFriend from '../../assets/svg/delete-friend.svg';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';
import {axiosClient} from '../../components/apis/axiosClient';
import Toast from 'react-native-toast-message';
import YesNoModal from '../../components/YesNoModal';
import Icons from '../../components/Icons';
import Colors from '../../components/helpers/Colors';

const DetailUser = ({route}: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const {f_name, phone, id, type, status} = route.params;
  const [myId, setMyId] = useState([]);
  const [isFriend, setFriend] = useState(status === 'active' ? true : false);
  const [visibleWarning, setVisibleWarning] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  console.log(route.params);

  useEffect(() => {
    axiosClient
      .get('https://zennoshop.cf/api/user/get-profile')
      .then(res => {
        setMyId(res.data?.data);
      })
      .catch(e => console.log(e));
  }, []);
  return (
    <View>
      <HeaderBack title="Hồ sơ người dùng" />
      <Center style={{paddingTop: 40}}>
        <Image
          source={{uri: 'https://picsum.photos/200/150'}}
          alt="img"
          borderRadius={100}
          width={150}
          height={150}
        />
      </Center>
      <Center marginTop={3}>
        <Text style={styles.titleText}>{f_name}</Text>
      </Center>
      {status === 'active' && (
        <Center>
          <Button
            width={'40%'}
            background={'#FEB7B1'}
            onPress={async () => {
              const formData = new FormData();

              formData.append('friend_id', id);
              try {
                await axiosClient.post(
                  'https://zennoshop.cf/api/user/unfriend',
                  formData,
                  {
                    headers: {'content-type': 'multipart/form-data'},
                  },
                );
                setFriend(false);
                setVisibleWarning(true);
                setPhoneError('Huỷ kết bạn thành công');
                navigation.goBack();
              } catch (e) {
                console.log(e);
                setFriend(true);
                setVisibleWarning(true);
                setPhoneError('Huỷ kết bạn thất bại');
              }
            }}
            leftIcon={
              !isFriend ? (
                <AddFriend color="#514545" />
              ) : (
                <DeleteFriend color="#514545" />
              )
            }>
            <Text style={styles.button}>Xoa kết bạn</Text>
          </Button>
        </Center>
      )}
      {!status && !type && (
        <Center>
          <Button
            width={'40%'}
            background={'#FEB7B1'}
            onPress={async () => {
              const formData = new FormData();

              formData.append('friend_id', id);
              try {
                await axiosClient.post(
                  'https://zennoshop.cf/api/user/friends',
                  formData,
                  {
                    headers: {'content-type': 'multipart/form-data'},
                  },
                );
                setFriend(false);
                setVisibleWarning(true);
                setPhoneError('Kết bạn thành công');
                navigation.goBack();
              } catch (e) {
                console.log('loi do ma', e);
                setFriend(true);
                setVisibleWarning(true);
                setPhoneError('Kết bạn thất bại');
                navigation.goBack();
              }
            }}
            leftIcon={
              !isFriend ? (
                <AddFriend color="#514545" />
              ) : (
                <DeleteFriend color="#514545" />
              )
            }>
            <Text style={styles.button}>Kết bạn</Text>
          </Button>
        </Center>
      )}

      {type === 'waiting' && status === 'pending' && (
        <Center>
          <Button
            width={'40%'}
            background={'#FEB7B1'}
            onPress={async () => {
              Alert.alert(
                'Cảnh báo',
                'Bạn muốn huỷ yêu cầu kết bạn với người này?',
                [
                  {
                    text: 'Thoát',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'Đồng Ý',
                    onPress: async () => {
                      const formData = new FormData();
                      formData.append('friend_id', id);
                      await axiosClient.post(
                        'https://zennoshop.cf/api/user/unfriend',
                        formData,
                        {
                          headers: {'content-type': 'multipart/form-data'},
                        },
                      );
                      setVisibleWarning(true);
                      setPhoneError('Huỷ yêu cầu kết bạn thành công');
                      setTimeout(() => {
                        setVisibleWarning(false);
                        navigation.goBack();
                      }, 2000);
                    },
                  },
                ],
              );
            }}
            leftIcon={<AddFriend color="#514545" />}>
            <Text style={styles.button}>Đã gửi yêu cầu</Text>
          </Button>
        </Center>
      )}

      {type === 'has_not_accept' && status === 'pending' && (
        <Center>
          <Button
            width={'40%'}
            marginTop={5}
            background={'#B5EAD8'}
            onPress={async () => {
              Alert.alert('Cảnh báo', 'Bạn muốn kết bạn với người này?', [
                {
                  text: 'Thoát',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Đồng Ý',
                  onPress: async () => {
                    const formData = new FormData();
                    formData.append('friend_id', id);
                    await axiosClient.post(
                      'https://zennoshop.cf/api/user/unfriend',
                      formData,
                      {
                        headers: {
                          'content-type': 'multipart/form-data',
                        },
                      },
                    );
                    setVisibleWarning(true);
                    setPhoneError('Kết bạn thành công');
                    setTimeout(() => {
                      setVisibleWarning(false);
                      navigation.goBack();
                    }, 2000);
                  },
                },
              ]);
            }}
            leftIcon={<AddFriend color="black" width={30} height={30} />}>
            <Text style={[styles.button, {color: 'black'}]}>Chấp thuận</Text>
          </Button>

          <Button
            width={'40%'}
            marginTop={5}
            background={'#FF0000'}
            onPress={async () => {
              Alert.alert(
                'Cảnh báo',
                'Bạn muốn huỷ yêu cầu kết bạn với người này?',
                [
                  {
                    text: 'Thoát',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'Đồng Ý',
                    onPress: async () => {
                      const formData = new FormData();
                      formData.append('friend_id', id);
                      await axiosClient.post(
                        'https://zennoshop.cf/api/user/unfriend',
                        formData,
                        {
                          headers: {
                            'content-type': 'multipart/form-data',
                          },
                        },
                      );
                      setVisibleWarning(true);
                      setPhoneError('Huỷ yêu cầu kết bạn thành công');
                      setTimeout(() => {
                        setVisibleWarning(false);
                        navigation.goBack();
                      }, 2000);
                    },
                  },
                ],
              );
            }}
            leftIcon={<DeleteFriend color="white" width={30} height={30} />}>
            <Text style={[styles.button, {color: 'white'}]}>Từ chối</Text>
          </Button>
        </Center>
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
        message={phoneError}
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

export default DetailUser;

const styles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  button: {
    color: '#000000',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  homeButton: {
    width: '90%',
    backgroundColor: '#FEB7B1',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  textHomeButton: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#514545',
  },
});
