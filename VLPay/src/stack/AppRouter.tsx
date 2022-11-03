import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Register from '../screen/Register';
import MainStack from './MainStack';

const AppRouter = () => {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
};

export default AppRouter;
