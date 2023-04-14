/**
 * @format
 */
import 'react-native-reanimated';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
PushNotification.configure({
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    // process the notification
    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NewData);
  },
  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  const notification = new firebase.notifications.Notification()
    .setNotificationId(remoteMessage.messageId)
    .setTitle(remoteMessage.notification.title)
    .setBody(remoteMessage.notification.body)
    .setData(remoteMessage.data);

  console.log('notification', notification);

  firebase.notifications().displayNotification(notification);
});

async function registerAppWithFCM() {
  await messaging().registerDeviceForRemoteMessages();
}

messaging().onMessage(async remoteMessage => {
  console.log('Received a new notification', remoteMessage);
});

async function getDeviceToken() {
  const deviceToken = await messaging().getToken();
  console.log('Device Token:', deviceToken);
}

getDeviceToken();

registerAppWithFCM();

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
AppRegistry.registerComponent(appName, () => App);
