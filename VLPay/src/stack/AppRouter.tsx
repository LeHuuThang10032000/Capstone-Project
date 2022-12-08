import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import MainStack from './MainStack';
import {NativeBaseProvider} from 'native-base';

const AppRouter = () => {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <MainStack />
      </NativeBaseProvider>
    </NavigationContainer>
  );
};

export default AppRouter;
