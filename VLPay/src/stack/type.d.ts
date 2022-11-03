import {
    DrawerStackParamList,
    MainStackParamList,
    TabStackParamList,
  } from './Navigation';
  
  type N =
    | keyof MainStackParamList
    | keyof TabStackParamList
    | keyof DrawerStackParamList;
  
  export type Screen = {
    name: N;
    component: any;
    options?: any;
  };
  
  export type BottomTabScreen = {
    name: N;
    component: any;
    tabBarLabel?: string;
    icon?: any;
    options?: {
      isEmployer: boolean;
    };
  };
  
  export type ScreenParams = MainStackParamList &
    TabStackParamList &
    DrawerStackParamList;
  