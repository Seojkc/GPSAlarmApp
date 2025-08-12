// LocationPermissionRequester.js
import React, { useEffect } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export default function LocationPermission({ onLocation }) {
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        let hasPermission = true;

        if (Platform.OS === 'android') {
          try {
            const fineGranted = await PermissionsAndroid.check(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            const coarseGranted = await PermissionsAndroid.check(
              PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
            );

            if (!fineGranted || !coarseGranted) {
              const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
              ]);

              if (
                granted['android.permission.ACCESS_FINE_LOCATION'] !== PermissionsAndroid.RESULTS.GRANTED ||
                granted['android.permission.ACCESS_COARSE_LOCATION'] !== PermissionsAndroid.RESULTS.GRANTED
              ) {
                Alert.alert(
                  'Permission Denied',
                  'Please enable location permission from settings.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => PermissionsAndroid.openSettings() }
                  ]
                );
                return;
              }
            }
          } catch (err) {
            console.warn(err);
            return;
          }
        }

        if (hasPermission) {
          Geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              onLocation && onLocation({ latitude, longitude });
            },
            (error) => {
              console.error('Location error:', error);
              switch (error.code) {
                case 1:
                  Alert.alert('Permission Denied', 'Please allow location access.');
                  break;
                case 2:
                  Alert.alert('Location Unavailable', 'Could not determine location.');
                  break;
                case 3:
                  Alert.alert('Timeout', 'Location request timed out.');
                  break;
                default:
                  Alert.alert('Error', error.message);
              }
            },
            {
              enableHighAccuracy: false,
              timeout: 15000,
              distanceFilter: 10,
              forceRequestLocation: true,
              showLocationDialog: true
            }
          );
        }
      } catch (err) {
        console.error('Permission error:', err);
      }
    };

    requestLocationPermission();
  }, [onLocation]);

  return null; // No UI
}
