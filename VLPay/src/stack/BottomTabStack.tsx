import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
// import {useTranslation} from 'react-i18next';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import {color_base, Role} from '../utils/constant';
// import {moderateScale} from '../utils/scaleUtils';
// import {AuthUserContext} from '../context/AuthUserProvider';
import { MainStackNavigation } from './Navigation';
import Icons from '../assets/icons/icons';
import { ScreenParams, BottomTabScreen } from './type';
import Home from '../screen/Home';
import TranSactionHistory from '../screen/TransactionHistory';
import QR from '../screen/QR';
import Notification from '../screen/Notification';
import MyWallet from '../screen/MyWallet';


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
  }
];

const Tab = createBottomTabNavigator<ScreenParams>();
const BottomTabStack = () => {
  // const {t} = useTranslation();
  // const auth = useContext(AuthUserContext);
  const navigation = useNavigation<MainStackNavigation>();
  const [bottomData, setBottomData] = useState<BottomTabScreen[]>(
    BOTTOM_TAB_STACK_SCREEN,
  );

  const handleBottomData = () => {
    const items: BottomTabScreen[] = [];
    BOTTOM_TAB_STACK_SCREEN.forEach(screen => {
      // if (auth.data?.roles?.[0].title) {
      //   if (
      //     auth.data?.roles?.[0].title === Role.Employer &&
      //     (screen.options?.isEmployer || !screen?.options)
      //   ) {
      //     items.push(screen);
      //     return;
      //   }

      //   if (
      //     auth.data?.roles?.[0].title === Role.JobSeeker &&
      //     (!screen.options?.isEmployer || !screen?.options)
      //   ) {
      //     items.push(screen);
      //     return;
      //   }
      // } else {
      //   !screen?.options && items.push(screen);
      // }
      items.push(screen);
      return;
    });

    setBottomData(items);
  };

  // useEffect(() => {
  //   handleBottomData();
  // }, []);

  // useEffect(() => {
  //   handleBottomData();
  // }, [auth?.data?.roles]);

  return (
    <Tab.Navigator>
      {bottomData.map(item => (
        <Tab.Screen
          key={item.name}
          name={item.name}
          component={item.component}
          // listeners={({route}) => ({
          //   tabPress: e => {
          //     if (route.name === 'Manicurists' && !auth.isAuth) {
          //       e.preventDefault();
          //       navigation.navigate('Login', {type: 'login'});
          //     }
          //   },
          // })}
          options={{
            headerShown: false,
            tabBarLabelStyle: { fontWeight: 'bold' },
            tabBarInactiveTintColor: 'black',
            // tabBarActiveTintColor: color_base,
            tabBarLabel: (item.tabBarLabel ? item.tabBarLabel : 'home'),
            tabBarIcon: ({ color, size }: any) => {
              return <item.icon color={color}></item.icon>;
            },
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default BottomTabStack;
