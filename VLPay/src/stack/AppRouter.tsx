import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Login from '../screen/Login';

const AppRouter = () => {
  console.log('====================================');
  console.log(123);
  console.log('====================================');
  return (
    <NavigationContainer>
      <Login />
    </NavigationContainer>
  );
};

export default AppRouter;
