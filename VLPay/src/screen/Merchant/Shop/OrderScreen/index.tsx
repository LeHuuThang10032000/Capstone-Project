import {View, Text, TextInput, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderBack from '../../../../components/HeaderBack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {};

const OrderScreen = (props: Props) => {
  const [name, setName] = useState('');
  const [savedName, setSavedName] = useState('');
  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    saveState();
  }, [name]);

  const saveState = async () => {
    try {
      await AsyncStorage.setItem('name', name);
    } catch (error) {
      console.log(error);
    }
  };

  const loadState = async () => {
    try {
      const savedName = await AsyncStorage.getItem('name');
      if (savedName !== null) {
        setSavedName(savedName);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeName = (name: string) => {
    setName(name);
  };

  const handleSaveName = () => {
    setSavedName(name);
  };
  return (
    <View>
      <HeaderBack title="Quán trà sữa" hideRight={true} />
      <Text>Enter your name:</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: 'black',
          borderWidth: 1,
          width: 200,
          marginVertical: 10,
        }}
        value={name}
        onChangeText={handleChangeName}
      />
      <Button title="Save" onPress={handleSaveName} />
      <Text style={{marginTop: 10}}>
        Your saved name is: {savedName ? savedName : 'not set'}
      </Text>
    </View>
  );
};

export default OrderScreen;
