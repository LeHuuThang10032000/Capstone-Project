import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import MainStack from './MainStack';
import {HStack, Image, NativeBaseProvider, VStack, View} from 'native-base';
import {Provider} from 'react-redux';
import {store} from '../redux/store';
import messaging from '@react-native-firebase/messaging';
import {UText} from '../components/UText';
import {Animated} from 'react-native';

const AppRouter = () => {
  const [body, setBody] = useState([]);
  const [isNotif, setNotif] = useState(false);
  const animatedValue = new Animated.Value(-100);

  Animated.timing(animatedValue, {
    toValue: 0,
    duration: 500,
    useNativeDriver: true,
  }).start();
  messaging().onMessage(async remoteMessage => {
    console.log('Received a new notification', remoteMessage?.notification);
    setNotif(true);
    setBody(remoteMessage?.notification);
    setTimeout(() => {
      setNotif(false);
      setBody([]);
    }, 5000);
  });

  console.log('body', body);

  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <Provider store={store}>
          <MainStack />
          {isNotif && (
            <View
              style={{
                position: 'absolute',
                top: 10,
                width: '100%',
                padding: 16,
              }}>
              <Animated.View
                style={{
                  transform: [{translateY: animatedValue}],
                  opacity: animatedValue.interpolate({
                    inputRange: [-100, 0],
                    outputRange: [0, 1],
                  }),
                }}>
                <VStack
                  style={{
                    backgroundColor: 'white',
                    width: '100%',
                    height: '100%',
                    padding: 16,
                    borderRadius: 10,
                  }}>
                  <HStack alignItems={'center'}>
                    <Image
                      source={require('../assets/img/logo.png')}
                      width={10}
                      height={10}
                    />
                    <UText
                      style={{fontSize: 14, fontWeight: '700'}}
                      numberOfLines={1}>
                      {body?.title}
                    </UText>
                  </HStack>
                  <UText style={{fontSize: 11}} numberOfLines={2}>
                    {body?.body}
                  </UText>
                </VStack>
              </Animated.View>
            </View>
          )}
        </Provider>
      </NativeBaseProvider>
    </NavigationContainer>
  );
};

export default AppRouter;
