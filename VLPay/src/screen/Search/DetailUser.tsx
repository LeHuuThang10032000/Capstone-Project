import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import HeaderBack from '../../components/HeaderBack';
import { Button, Center, HStack, Image, Input } from 'native-base';
import AddFriendIcon from '../../assets/svg/add-friend.svg';
import AddFriend from '../../assets/svg/add-friend.svg';
import DeleteFriend from '../../assets/svg/delete-friend.svg';
import { useNavigation } from '@react-navigation/native';
import { MainStackNavigation } from '../../stack/Navigation';
import { axiosClient } from '../../components/apis/axiosClient';
import Toast from 'react-native-toast-message';

const DetailUser = ({ route }: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const { f_name, phone, id } = route.params;
  const [myId, setMyId] = useState([]);
  const [isFriend, setFriend] = useState(false);


  useEffect(() => {
    axiosClient
      .get('https://zennoshop.cf/api/user/get-profile')
      .then(res => {
        setMyId(res.data?.data);
      })
      .catch(e => console.log(e));
  }, []);

  const handAddFr = async () => {
    const formData = new FormData();
    if (!isFriend) {
      formData.append('user_id', myId.id);
      formData.append('friend_id', id);
      try {
        await axiosClient.post(
          'https://zennoshop.cf/api/user/friends',
          formData,
          {
            headers: { 'content-type': 'multipart/form-data' },
          },
        );
        setFriend(true)
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'kết bạn thành công!',
        });
      } catch (e) {
        console.log(e);
        setFriend(false)
        Toast.show({
          type: 'error',
          text1: 'Kết bạn thất bại',
          text2: 'Đã là bạn bè của nhau!',
        });
      }
    } else {
      formData.append('friend_id', id);
      try {
        await axiosClient.post(
          'https://zennoshop.cf/api/user/unfriend',
          formData,
          {
            headers: { 'content-type': 'multipart/form-data' },
          },
        );
        setFriend(false)
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Huỷ kết bạn thành công!',
        });
      } catch (e) {
        console.log(e);
        setFriend(true)
        Toast.show({
          type: 'error',
          text1: 'Kết bạn thất bại',
          text2: 'huỷ kết bạn không thành công!',
        });
      }
    }
  };

  return (
    <View>
      <HeaderBack title="Hồ sơ người dùng" />
      <Center style={{ paddingVertical: 40 }}>
        <Image
          source={{ uri: 'https://picsum.photos/200/150' }}
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
          onPress={handAddFr}
          leftIcon={!isFriend ? <AddFriend color="#514545" width={30} height={30} /> :
            <DeleteFriend color="#514545" width={30} height={30} />}>
          <Text style={styles.button}>{!isFriend ? 'Kết bạn' : 'Huỷ kết bạn'}</Text>
        </Button>
      </Center>
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
