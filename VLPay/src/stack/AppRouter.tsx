import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Register from '../screen/Register';

const AppRouter = () => {
  return (
    <NavigationContainer>
      <Register />
    </NavigationContainer>
  );
};

export default AppRouter;
