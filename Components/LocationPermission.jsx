import React, { useEffect } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export default function LocationPermission({ onLocation }) {
  const requestLocation = () => {
    
    
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocation && onLocation({ latitude, longitude });

        // Step 2: Try high-accuracy location in the background
        Geolocation.getCurrentPosition(
          (highAccPosition) => {
            const { latitude, longitude } = highAccPosition.coords;
            onLocation && onLocation({ latitude, longitude }); // update with precise location
          },
          (error) => {
            console.warn('High accuracy failed, staying with coarse location:', error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
      },
      (error) => {
        console.warn('Coarse location failed:', error);
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 }
    );

  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ]);

          const fineGranted =
            granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;
          const coarseGranted =
            granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;

          if (!fineGranted && !coarseGranted) {
            Alert.alert('Permission Denied', 'Please enable location permission in settings.');
            return;
          }

          // Permission granted → now fetch
          requestLocation();
        } else {
          requestLocation();
        }
      } catch (err) {
        console.error('Location permission error:', err);
      }
    };

    requestLocationPermission();
  }, []);

  return null;
}
