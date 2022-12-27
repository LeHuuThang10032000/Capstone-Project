import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {MAIN_STACK_SCREEN} from './Screen';
import {ScreenParams} from './type';
import Login from '../screen/Login';
import Register from '../screen/Register';
import ForgotPassword from '../screen/ForgotPassword';
import {useDispatch, useSelector} from 'react-redux';
import {Init} from '../redux/actions/authAction';

const Stack = createStackNavigator<ScreenParams>();
const screenOptions = {headerShown: false};

const MainStack = () => {
  const token = useSelector((state: any) => state.authReducer.authToken);
  const dispatch = useDispatch();
  const init = async () => {
    dispatch(await Init());
  };

  useEffect(() => {
    init();
  });

  return (
    <Stack.Navigator initialRouteName={'MainTab'} screenOptions={screenOptions}>
      {token ? (
        MAIN_STACK_SCREEN.map(item => (
          <Stack.Screen
            key={item.name}
            name={item.name}
            component={item.component}
            options={item?.options}
          />
        ))
      ) : (
        <>
          <Stack.Screen name={'Login'} component={Login} />
          <Stack.Screen name={'Register'} component={Register} />
          <Stack.Screen name={'ForgotPwd'} component={ForgotPassword} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainStack;
