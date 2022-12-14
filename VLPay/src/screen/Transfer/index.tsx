import {StyleSheet, TextInput} from 'react-native';
import React from 'react';
import HeaderBack from '../../components/HeaderBack';
import {MainStackNavigation} from '../../stack/Navigation';
import {useNavigation} from '@react-navigation/native';
import {Center, Image, Button, Text, TextArea, View} from 'native-base';
import CurrencyInput from 'react-native-currency-input';
import MessageIcon from '../../assets/svg/message.svg';

const Index = ({route}: any) => {
  const navigation = useNavigation<MainStackNavigation>();
  const {picture, title, first, last} = route.params;
  const [value, setValue] = React.useState(null);
  return (
    <View>
      <HeaderBack title="Transfer" />
      <Center py={10} mt={90}>
        <Image
          source={{uri: `${picture}`}}
          alt="img"
          borderRadius={100}
          width={100}
          height={100}
          position="absolute"
          zIndex={99}
          top={-10}
        />
        <View style={styles.body}>
          <Text mt={20} fontSize={18}>
            {title} {first} {last}
          </Text>
          <CurrencyInput
            value={value}
            onChangeValue={setValue}
            renderTextInput={textInputProps => (
              <TextInput
                {...textInputProps}
                style={styles.input}
                placeholder="0đ"
                autoFocus
              />
            )}
            // renderText
            suffix="đ"
            minValue={0}
            maxValue={10000000}
            delimiter="."
            separator=","
            precision={0}
          />

          <TextArea
            h={20}
            mt={'10'}
            placeholder="Enter a message"
            w="75%"
            maxW="300"
            autoCompleteType={undefined}
            rightElement={
              <MessageIcon
                width={30}
                height={30}
                style={{marginBottom: 30, marginRight: 10}}
              />
            }
          />
        </View>
        <Button
          mt={5}
          p={4}
          width={'90%'}
          background={'#B5EAD8'}
          onPress={() =>
            navigation.navigate('Transfer', {picture, title, first, last})
          }>
          <Text style={styles.button}>Send money</Text>
        </Button>
      </Center>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  body: {
    height: 350,
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#B2BABB',
    alignItems: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#FEB7B1',
    padding: 0,
    fontSize: 18,
    marginTop: 22,
  },
  button: {
    color: '#514545',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
});
