import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/core';
// import {useTranslation} from 'react-i18next';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainStackNavigation} from './Navigation';
import Icons from '../assets/icons/MyIcon';
import {ScreenParams, BottomTabScreen} from './type';
import {useSelector} from 'react-redux';
import OrderScreen from '../screen/Merchant/Shop/OrderScreen';
import MenuScreen from '../screen/Merchant/Shop/MenuScreen';
import MailScreen from '../screen/Merchant/Shop/MailScreen';
import AccountScreen from '../screen/Merchant/Shop/AccountScreen';

const BOTTOM_TAB_STACK_SCREEN: BottomTabScreen[] = [
  {
    name: 'OrderScreen',
    component: OrderScreen,
    tabBarLabel: 'Đơn hàng',
    icon: Icons.Bag,
  },
  {
    name: 'MenuScreen',
    component: MenuScreen,
    tabBarLabel: 'Menu',
    icon: Icons.Menu,
  },
  // {
  //   name: 'MailScreen',
  //   component: MailScreen,
  //   tabBarLabel: 'Hộp thư',
  //   icon: Icons.Mail,
  // },
  {
    name: 'AccountScreen',
    component: AccountScreen,
    tabBarLabel: 'Tài khoản',
    icon: Icons.Account,
  },
];

const Tab = createBottomTabNavigator<ScreenParams>();
const BottomTabStackMerchant = () => {
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
            tabBarStyle: token
              ? {}
              : {
                  display: 'none',
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

export default BottomTabStackMerchant;
