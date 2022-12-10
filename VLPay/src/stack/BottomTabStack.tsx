import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/core';
// import {useTranslation} from 'react-i18next';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainStackNavigation} from './Navigation';
import Icons from '../assets/icons/icons';
import {ScreenParams, BottomTabScreen} from './type';
import Home from '../screen/Home';
import TranSactionHistory from '../screen/TransactionHistory';
import QR from '../screen/QR';
import Notification from '../screen/Notification';
import MyWallet from '../screen/MyWallet';
import {useSelector} from 'react-redux';

const BOTTOM_TAB_STACK_SCREEN: BottomTabScreen[] = [
  {
    name: 'Home',
    component: Home,
    tabBarLabel: 'Home',
    icon: Icons.HomeIcon,
  },
  {
    name: 'TranSactionHistory',
    component: TranSactionHistory,
    tabBarLabel: 'History',
    icon: Icons.History,
  },
  {
    name: 'QR',
    component: QR,
    tabBarLabel: 'QR',
    icon: Icons.QRcode,
  },
  {
    name: 'Notification',
    component: Notification,
    tabBarLabel: 'Notification',
    icon: Icons.Bell,
  },
  {
    name: 'MyWallet',
    component: MyWallet,
    tabBarLabel: 'My wallet',
    icon: Icons.User,
  },
];

const Tab = createBottomTabNavigator<ScreenParams>();
const BottomTabStack = () => {
  const token = useSelector(state => state.authReducer.authToken);
  const navigation = useNavigation<MainStackNavigation>();
  const [bottomData, setBottomData] = useState<BottomTabScreen[]>(
    BOTTOM_TAB_STACK_SCREEN,
  );

  const handleBottomData = () => {
    const items: BottomTabScreen[] = [];
    BOTTOM_TAB_STACK_SCREEN.forEach(screen => {
      items.push(screen);
      return;
    });

    setBottomData(items);
  };
  return (
    <Tab.Navigator>
      {bottomData.map(item => (
        <Tab.Screen
          key={item.name}
          name={item.name}
          component={item.component}
          listeners={({route}) => ({
            tabPress: e => {
              if (!token) {
                e.preventDefault();
                navigation.navigate('Login');
              }
            },
          })}
          options={{
            headerShown: false,
            tabBarLabelStyle: {
              fontWeight: 'bold',
              fontFamily: 'Poppins-Regular',
            },

            tabBarInactiveTintColor: 'black',
            // tabBarActiveTintColor: color_base,
            tabBarLabel: item.tabBarLabel ? item.tabBarLabel : 'home',
            tabBarIcon: ({color, size}: any) => {
              return <item.icon color={color}></item.icon>;
            },
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default BottomTabStack;
