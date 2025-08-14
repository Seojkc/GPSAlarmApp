import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

export default function NotificationPermission() {
  useEffect(() => {
    async function requestPermissionAndCreateChannel() {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission denied');
          return;
        }
      }

      PushNotification.createChannel(
        {
          channelId: 'gps-channel',
          channelName: 'GPS Alerts',
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`Channel created: ${created}`)
      );
    }

    requestPermissionAndCreateChannel();
  }, []);

  return null; // This component doesn't render anything
}
