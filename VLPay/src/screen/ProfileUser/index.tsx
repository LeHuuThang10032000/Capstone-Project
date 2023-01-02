import React, {useCallback, useEffect, useState} from 'react';
import HeaderBack from '../../components/HeaderBack';
import {
  Button,
  Center,
  FormControl,
  HStack,
  Image,
  Input,
  VStack,
  View,
  Text,
} from 'native-base';
import {TouchableOpacity} from 'react-native';
import styles from './styles';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';
import {axiosClient} from '../../components/apis/axiosClient';

const Index = () => {
  const avatar = 'https://randomuser.me/api/portraits/men/78.jpg';
  const isFocused = useIsFocused();
  const navigation = useNavigation<MainStackNavigation>();

  const [profile, setProfile] = useState({});

  const fetchData = useCallback(async () => {
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/get-profile',
    );
    setProfile(result);
  }, []);

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      fetchData();
    }
  }, [fetchData, isFocused]);
  return (
    <View>
      <HeaderBack title="Hồ sơ của bạn" />
      <Center style={{paddingVertical: 40}}>
        <Image
          source={{uri: avatar}}
          alt="img"
          borderRadius={100}
          width={150}
          height={150}
        />
      </Center>
      <Center>
        <VStack space={3}>
          <FormControl isDisabled>
            <FormControl.Label
              _disabled={{
                _text: {
                  color: '#312E49',
                  fontWeight: 'bold',
                  fontSize: 16,
                },
              }}>
              Họ và tên
            </FormControl.Label>
            <Input
              w="90%"
              value={profile?.data?.data?.f_name}
              style={{fontFamily: 'Poppins-Regular', fontSize: 14}}
            />
          </FormControl>

          <FormControl isDisabled>
            <FormControl.Label
              _disabled={{
                _text: {
                  color: '#312E49',
                  fontWeight: 'bold',
                  fontSize: 16,
                },
              }}>
              Số điện thoại
            </FormControl.Label>
            <Input
              w="90%"
              value={profile?.data?.data?.phone}
              style={{fontFamily: 'Poppins-Regular', fontSize: 14}}
            />
          </FormControl>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.text}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </VStack>
      </Center>
    </View>
  );
};

export default Index;
