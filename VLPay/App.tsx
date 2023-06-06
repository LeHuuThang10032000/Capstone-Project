import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {NativeBaseProvider} from 'native-base';
import AppRouter from './src/stack/AppRouter';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import {AppProvider} from './src/context/GlobalContext';
import {ClickOutsideProvider} from 'react-native-click-outside';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4285F4',
    accent: '#B381F8',
    text: '#B381F8',
  },
};

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const [loading, setLoading] = useState(true);

  return (
    <ClickOutsideProvider>
      <AppProvider>
        <NativeBaseProvider>
          <Provider store={store}>
            <PaperProvider>
              <AppRouter />
            </PaperProvider>
          </Provider>
          <Toast position="top" bottomOffset={20} />
        </NativeBaseProvider>
      </AppProvider>
    </ClickOutsideProvider>
  );
};

export default App;
