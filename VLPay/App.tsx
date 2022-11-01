import 'react-native-gesture-handler';
import React from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import AppRouter from './src/stack/AppRouter';

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
  return(
    <PaperProvider theme={theme}>
      <AppRouter/>
    </PaperProvider>
  )
}

export default App;