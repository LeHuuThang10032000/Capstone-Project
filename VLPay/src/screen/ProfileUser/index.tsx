import React from 'react';
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

const Index = () => {
  const avatar = 'https://randomuser.me/api/portraits/men/78.jpg';
  return (
    <View>
      <HeaderBack title="Your profile" />
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
              Email
            </FormControl.Label>
            <Input
              w="90%"
              value="nguyen.197pm09480@vanlanguni.vn"
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
              Full name
            </FormControl.Label>
            <Input
              w="90%"
              value="Lâm Thái Bảo Nguyên"
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
              Phone number
            </FormControl.Label>
            <Input
              w="90%"
              value="0123456789"
              style={{fontFamily: 'Poppins-Regular', fontSize: 14}}
            />
          </FormControl>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Edit</Text>
          </TouchableOpacity>
        </VStack>
      </Center>
    </View>
  );
};

export default Index;
