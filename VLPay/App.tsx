import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {NativeBaseProvider} from 'native-base';
import AppRouter from './src/stack/AppRouter';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#5660E6',
    accent: '#B381F8',
    text: '#B381F8',
  },
};

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NativeBaseProvider>
      <Provider store={store}>
        <AppRouter />
      </Provider>
      <Toast position="bottom" bottomOffset={20} />
    </NativeBaseProvider>
  );
};

export default App;
