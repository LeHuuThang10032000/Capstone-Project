import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import MainStack from './MainStack';
import {NativeBaseProvider} from 'native-base';
import {Provider} from 'react-redux';
import {store} from '../redux/store';

const AppRouter = () => {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <Provider store={store}>
          <MainStack />
        </Provider>
      </NativeBaseProvider>
    </NavigationContainer>
  );
};

export default AppRouter;
