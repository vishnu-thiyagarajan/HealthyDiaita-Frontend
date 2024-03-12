import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { useState, useContext, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { AuthContext } from '../Context/AuthContext';
import { get, set } from '../Shared/LocalStorage';
import { mealTimings } from '../Shared/Utils/Constants';
import HomeAdmin from './HomeAdmin';
import HomeClient from './HomeClient';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Home() {
  const {userData} = useContext(AuthContext);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  async function schedulePushNotification() {
    const isNotificationSet = await get('notification');
    if (isNotificationSet) return;

    mealTimings.map(async (meal) => {
      const {hour, label} = meal
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Reminder from HealthyDiaita",
          body: `Update your ${label} food intake here!`,
          sound: 'default',
        },
        trigger: { 
            hour: hour,
            minute: 0,
            repeats: true,
        },
      });
    })
    await set('notification', true)
  }

  useEffect(() => {
    if(userData?.role !== 'Client') return;
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      Notifications.dismissAllNotificationsAsync();
    });
    schedulePushNotification();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  switch(userData?.role){
    case 'Admin':
        return <HomeAdmin />
    case 'Client': 
        return <HomeClient />
    default:
        return <></>
  }
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: "5cacfed9-d6e8-4e97-9add-6b96f7dde8fa"
    })).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}