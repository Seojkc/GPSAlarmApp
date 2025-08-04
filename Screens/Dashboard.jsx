import React, { useEffect, useState, useRef,useContext } from 'react';
import { View, PermissionsAndroid, Platform, TouchableOpacity, Text, StyleSheet,Alert  } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import OverlayComponent from './HomeOverlayout'; // import correctly!
import AsyncStorage from '@react-native-async-storage/async-storage';
import DraggableMarkers,{ STORAGE_KEY } from './Markers'; // import the storage key
import { PinContext } from '../Context/PinContext';
import OverlayPanel from './PinOverlayPanel';

const darkMapStyle = 
  [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#263c3f"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6b9a76"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#38414e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#212a37"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9ca5b3"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#1f2835"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#f3d19c"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2f3948"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#515c6d"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    }
]

export default function Dashboard() {


  const { pins, addPin, updatePin, removePin } = useContext(PinContext);
  const [selectedPin, setSelectedPin] = useState(null);


  const handleAddPin = () => {
    if (!location) {
      Alert.alert("Location not available", "Please enable location services.");
      return;
    }
    

    const newPin = {
      id: Date.now().toString(),
      title: Date.now().toString(),
      coordinate: {
        latitude: location.latitude + (Math.random()-0.5) * 0.01,
        longitude: location.longitude + (Math.random()-0.5) * 0.01,
      },
    };
    addPin(newPin);
  };

  const handleRemovePin = (id) => {
    Alert.alert(
      'Remove Pin!!',
      'Are you sure?',
      [
        { text: 'Cancel' },
        {
          text: 'Remove',
          onPress: () => removePin(id),
          style: 'destructive',
        },
      ]
    );
  };




  const [location, setLocation] = useState(null);


  const mapRef = useRef(null);

  const [draggableMarker, setDraggableMarker] = useState(null);
  const [markers, setMarkers] = useState([]); // allow multiple markers


  useEffect(() => {
    if (location) {
      setDraggableMarker({
        latitude: location.latitude + 0.001,
        longitude: location.longitude + 0.001,
      });
    }
  }, [location]);

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
          position => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
          },
         error => {
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
}, []);

  return (
    <View style={styles.container}>
      {location ?
        (<MapView
          ref={mapRef}
          style={styles.mapView}
          showsUserLocation={true}
          zoomEnabled={true}
          customMapStyle={darkMapStyle}
          zoomControlEnabled={true}
          region={
            location
              ? {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }
              : undefined
          }
        >
          <Marker coordinate={location} title="You are here" />
          {pins.map((pin) => (
              <Marker
                key={pin.id}
                coordinate={pin.coordinate}
                title={pin.title}
                draggable
                onDragEnd={(e) => {
                  updatePin({ ...pin, coordinate: e.nativeEvent.coordinate });
                  console.log(pins, e.nativeEvent.coordinate);
                }}
                onCalloutPress={() => handleRemovePin(pin.id)}
              />
            ))}
        </MapView>

        ): (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Fetching location...</Text>
          </View>
        )}

      <OverlayComponent />

      <TouchableOpacity
        style={styles.plusButton}
        onPress={handleAddPin}
      >
        <View>
          <Text style={styles.plusText}>+</Text>
        </View>
      </TouchableOpacity>

      <OverlayPanel
        pins={pins}
        updatePin={updatePin}
        removePin={removePin}
        selectedPin={selectedPin}
        setSelectedPin={setSelectedPin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapView: { flex: 1 },
  plusButton: {
    position: 'absolute',
    top: 70,
    right: 10,
    backgroundColor: '#2196F3',
    width: 40,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    zIndex: 20,
  },
  plusText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
});
