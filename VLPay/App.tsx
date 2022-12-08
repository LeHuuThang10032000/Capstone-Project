import 'react-native-gesture-handler';
import React from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {NativeBaseProvider} from 'native-base';
import AppRouter from './src/stack/AppRouter';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';

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
  return (
    <NativeBaseProvider>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </NativeBaseProvider>
  );
};

export default App;
