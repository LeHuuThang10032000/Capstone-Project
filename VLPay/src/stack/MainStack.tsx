import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {MAIN_STACK_SCREEN} from './Screen';
import {ScreenParams} from './type';

const Stack = createStackNavigator<ScreenParams>();
const screenOptions = {headerShown: false};
const MainStack = () => {
  return (
    <Stack.Navigator initialRouteName={'MainTab'} screenOptions={screenOptions}>
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

export default MainStack;
