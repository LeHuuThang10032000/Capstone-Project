import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import HeaderBack from '../../components/HeaderBack';
import {Button, Center, HStack, Image} from 'native-base';
import AddFriendIcon from '../../assets/svg/add-friend.svg';
import TransferIcon from '../../assets/svg/transfer.svg';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';

const DetailUser = ({route}: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const {email, picture, title, first, last} = route.params;
  return (
    <View>
      <HeaderBack title="Personal page" />
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
        <Text style={styles.text}>{email}</Text>
      </Center>
      <Center pt={33}>
        <HStack space={7}>
          <Button
            width={143}
            background={'#FEB7B1'}
            leftIcon={<AddFriendIcon width={20} />}
            onPress={() => console.log('add friend')}>
            <Text style={styles.button}>Add friend</Text>
          </Button>
          <Button
            width={143}
            background={'#B5EAD8'}
            leftIcon={<TransferIcon width={30} />}
            onPress={() => console.log('transfer')}>
            <Text style={styles.button}>Transfer</Text>
          </Button>
        </HStack>
      </Center>
      <Center pt={160}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.textHomeButton}>Home Screen</Text>
        </TouchableOpacity>
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
    color: '#000000',
    fontFamily: 'Poppins-Regular',
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
