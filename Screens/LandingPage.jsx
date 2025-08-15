import React, { useEffect,useState } from 'react';
import { View, Text, ActivityIndicator, PermissionsAndroid, Platform, Alert,StyleSheet,Dimensions } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import PushNotification from 'react-native-push-notification';
import Video from 'react-native-video';
import landingVideo from '../assets/video/Landing_Page.mp4';

const { width, height } = Dimensions.get('window');


export default function LandingScreen({ navigation }) {

    const [loaded, setLoaded] = useState(false);

  function timer(coords)
    { 
        setTimeout(() => {
            navigation.replace('Dashboard', { coords });
        }, 3000);
    }

  useEffect(() => {
    async function setupApp() {
      try {
        // 1️⃣ Location Permission
        const locationGranted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        const fineGranted =
          locationGranted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;
        const coarseGranted =
          locationGranted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;

        if (!fineGranted && !coarseGranted) {
          Alert.alert('Permission Denied', 'Please enable location permission in settings.');
          return;
        }

        const getLocation = () =>
          new Promise((resolve) => {
            Geolocation.getCurrentPosition(
              (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
              (err) => {
                console.warn('Location error', err);
                resolve(null);
              },
              { 
                enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 
              }
            );
          });

        const coords = await getLocation();

        if (Platform.OS === 'android' && Platform.Version >= 33) {
          const notifGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          if (notifGranted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Notification permission denied');
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

        //navigation.replace('Dashboard', { coords });

        timer(coords);
        
      } catch (err) {
        console.error('Setup error:', err);
      }
    }

    setupApp();
  }, []);

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/video/Landing_Page.mp4')} 
        style={[styles.fullScreenVideo, { opacity: loaded ? 1 : 0 }]}
        resizeMode="fit" 
        repeat={false} 
        muted={true} 
        onLoad={()=>{setLoaded(true)}}
      />
    </View>
  );
}


const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: 'white' },

  fullScreenVideo: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});