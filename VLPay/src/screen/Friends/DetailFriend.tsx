import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import React, {useState} from 'react';
import HeaderBack from '../../components/HeaderBack';
import {Button, Center, HStack, Image, Input} from 'native-base';
import AddFriendIcon from '../../assets/svg/add-friend.svg';
import AddFriend from '../../assets/svg/add-friend.svg';
import DeleteFriend from '../../assets/svg/delete-friend.svg';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';
import {axiosClient} from '../../components/apis/axiosClient';
import YesNoModal from '../../components/YesNoModal';
import Icons from '../../components/Icons';
import Colors from '../../components/helpers/Colors';

const DetailFriend = ({route}: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const {f_name, phone, id, status, type, image, requester_id} =
    route.params?.item;
  console.log('route.params?.item', route.params?.item);

  const [friend, setFriend] = useState(false);
  const [visibleWarning, setVisibleWarning] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  return (
    <View>
      <HeaderBack title="Hồ sơ bạn bè" />
      <Center style={{paddingVertical: 40}}>
        <Image
          source={{uri: image}}
          alt="img"
          borderRadius={100}
          width={150}
          height={150}
        />
      </Center>
      <Center>
        <Text style={styles.titleText}>{f_name}</Text>
        <Text style={styles.text}>{phone}</Text>
      </Center>
      <Center pt={160}>
        <Button
          width={'90%'}
          background={'#B5EAD8'}
          onPress={async () => {
            if (status == 'pending') {
              if (type == 'waiting') {
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
                        if (!friend) {
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
                        }
                        setFriend(!friend);
                      },
                    },
                  ],
                );
              } else {
                Alert.alert('Cảnh báo', 'Bạn muốn kết bạn với người này?', [
                  {
                    text: 'Thoát',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'Đồng Ý',
                    onPress: async () => {
                      if (!friend) {
                        const formData = new FormData();
                        formData.append('friend_id', id);
                        await axiosClient.post(
                          'https://zennoshop.cf/api/user/friends/accept',
                          formData,
                          {
                            headers: {'content-type': 'multipart/form-data'},
                          },
                        );
                        setVisibleWarning(true);
                        setPhoneError('Kết bạn thành công');
                        setTimeout(() => {
                          setVisibleWarning(false);
                          navigation.goBack();
                        }, 2000);
                      }
                      setFriend(!friend);
                    },
                  },
                ]);
              }
            } else {
              Alert.alert(
                'Cảnh báo',
                'Bạn có muốn xóa kết bạn với người dùng này?',
                [
                  {
                    text: 'Thoát',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'Đồng Ý',
                    onPress: async () => {
                      if (!friend) {
                        const formData = new FormData();
                        formData.append('friend_id', id);
                        console.log('Da xoa');
                        console.log(formData);
                        await axiosClient.post(
                          'https://zennoshop.cf/api/user/unfriend',
                          formData,
                          {
                            headers: {'content-type': 'multipart/form-data'},
                          },
                        );
                        setVisibleWarning(true);
                        setPhoneError('Xoa bạn thành công');
                        setTimeout(() => {
                          setVisibleWarning(false);
                          navigation.goBack();
                        }, 2000);
                      }
                      setFriend(!friend);
                    },
                  },
                ],
              );
            }
          }}
          leftIcon={
            friend ? (
              <DeleteFriend color="#514545" width={30} height={30} />
            ) : (
              <AddFriend color="#514545" width={30} height={30} />
            )
          }>
          {status === 'pending' ? (
            type !== 'waiting' ? (
              <Text style={styles.button}>Chấp thuận</Text>
            ) : (
              <Text style={styles.button}>Đã gửi yêu cầu</Text>
            )
          ) : friend ? (
            <Text style={styles.button}>Thêm bạn bè</Text>
          ) : (
            <Text style={styles.button}>Xoá bạn bè</Text>
          )}
        </Button>
        {status === 'pending' && type !== 'waiting' && (
          <Button
            width={'90%'}
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
                      setPhoneError('huỷ yêu cầu kết bạn thành công');
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
        )}
      </Center>
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

export default DetailFriend;

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
    color: '#514545',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  homeButton: {
    width: '90%',
    backgroundColor: '#B5EAD8',
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
