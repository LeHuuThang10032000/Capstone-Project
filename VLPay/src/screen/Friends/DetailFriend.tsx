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

const DetailFriend = ({route}: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const {f_name, phone, id} = route.params;
  const [friend, setFriend] = useState(false);

  return (
    <View>
      <HeaderBack title="Hồ sơ bạn bè" />
      <Center style={{paddingVertical: 40}}>
        <Image
          source={{uri: 'https://picsum.photos/200/150'}}
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
                      navigation.goBack();
                    }
                    setFriend(!friend);
                  },
                },
              ],
            );
          }}
          leftIcon={
            friend ? (
              <DeleteFriend color="#514545" width={30} height={30} />
            ) : (
              <AddFriend color="#514545" width={30} height={30} />
            )
          }>
          {friend ? (
            <Text style={styles.button}>Add friend</Text>
          ) : (
            <Text style={styles.button}>Delete friend</Text>
          )}
        </Button>
      </Center>
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
