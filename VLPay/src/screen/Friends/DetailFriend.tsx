import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import HeaderBack from '../../components/HeaderBack';
import {Button, Center, HStack, Image, Input} from 'native-base';
import AddFriendIcon from '../../assets/svg/add-friend.svg';
import AddFriend from '../../assets/svg/add-friend.svg';
import DeleteFriend from '../../assets/svg/delete-friend.svg';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';

const DetailFriend = ({route}: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const {f_name, phone} = route.params;
  const [friend, setFriend] = useState(true);
  console.log(phone);

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
          onPress={() => {
            setFriend(!friend);
          }}
          leftIcon={
            friend ? (
              <AddFriend color="#514545" width={30} height={30} />
            ) : (
              <DeleteFriend color="#514545" width={30} height={30} />
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
