import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {MAIN_STACK_SCREEN} from '../../../stack/Screen';
import {ScreenParams} from '../../../stack/type';

const Stack = createStackNavigator<ScreenParams>();
const screenOptions = {headerShown: false};

type Props = {};

const MyStore = (props: Props) => {
  return (
    <Stack.Navigator
      initialRouteName={'MainTabM'}
      screenOptions={screenOptions}>
      {MAIN_STACK_SCREEN.map(item => (
        <Stack.Screen
          key={item.name}
          name={item.name}
          component={item.component}
          options={item?.options}
        />
      ))}
    </Stack.Navigator>
  );
};

export default MyStore;
