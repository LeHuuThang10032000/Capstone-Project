import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import HeaderBack from '../../components/HeaderBack';
import {Button, Center, Image} from 'native-base';
import AddFriend from '../../assets/svg/add-friend.svg';

const DetailUser = ({route}: any) => {
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
        <Text style={{fontSize: 18, fontFamily: 'Poppins-SemiBold'}}>
          {title} {first} {last}
        </Text>
        <Text style={{fontSize: 16, fontFamily: 'Poppins-Regular'}}>
          {email}
        </Text>
      </Center>
      <Center pt={33}>
        <Button
          background={'#FEB7B1'}
          leftIcon={<AddFriend width={20} />}
          onPress={() => console.log('add friend')}>
          <Text style={{color: '#000000'}}>Add friend</Text>
        </Button>
      </Center>
    </View>
  );
};

export default DetailUser;

const styles = StyleSheet.create({});
