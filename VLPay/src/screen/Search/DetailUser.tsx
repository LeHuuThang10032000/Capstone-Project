import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import HeaderBack from '../../components/HeaderBack';
import {Button, Center, HStack, Image, Input} from 'native-base';
import AddFriendIcon from '../../assets/svg/add-friend.svg';
import TransferIcon from '../../assets/svg/transfer.svg';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';

const DetailUser = ({route}: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const {email, picture, title, first, last, phone} = route.params;
  console.log(phone);

  return (
    <View>
      <HeaderBack title="Detail User" />
      <Center style={{paddingVertical: 40}}>
        <Image
          source={{uri: `${picture}`}}
          alt="img"
          borderRadius={100}
          width={150}
          height={150}
        />
      </Center>
      <Center>
        <Text style={styles.titleText}>
          {title} {first} {last}
        </Text>
        <Text style={styles.text}>{phone}</Text>
        <Text style={styles.text}>{email}</Text>
        <Input value={phone} />
      </Center>
      <Center pt={160}>
        <Button
          width={'90%'}
          background={'#B5EAD8'}
          leftIcon={<TransferIcon width={30} />}
          // onPress={() =>
          //   navigation.navigate('Transfer', {
          //     picture,
          //     title,
          //     first,
          //     last,
          //     phone,
          //   })
          // }
        >
          <Text style={styles.button}>Transfer</Text>
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
