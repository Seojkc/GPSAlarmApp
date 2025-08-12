import React, { useEffect, useState, useRef,useContext } from 'react';
import { View, PermissionsAndroid, Platform, TouchableOpacity, Text, StyleSheet,Alert  } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import OverlayComponent from './HomeOverlayout'; // import correctly!
import AsyncStorage from '@react-native-async-storage/async-storage';
import DraggableMarkers,{ STORAGE_KEY } from './Markers'; // import the storage key
import { PinContext } from '../Context/PinContext';
import OverlayPanel from './PinOverlayPanel';
import { current } from '@reduxjs/toolkit';
import GeofenceChecker from '../Components/GeoFencerMain';
import LocationPermission from '../Components/LocationPermission';

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
  const [currentPin, setCurrentPin] = useState(null);

  const [disableScreenEditPinScreen, setDisableScreenEditPinScreen] = useState(false); // State to control the overlay visibility


  const handleAddPin = async () => {
    if (!location) {
      Alert.alert("Location not available", "Please enable location services.");
      return;
    }
    
    if (!mapRef.current) return;

    const newPin = {
      id: Date.now().toString(),
      title: Date.now().toString(),
      radius:200,
      property:1,
      colour: 'green',
      coordinate: {
        latitude: location.latitude + (Math.random()-0.5) * 0.01,
        longitude: location.longitude + (Math.random()-0.5) * 0.01,
      },
    };

    try{
      const camera = await mapRef.current.getCamera();
      const center = camera.center;

      newPin.coordinate = {
        latitude: center.latitude + (Math.random()-0.5) * 0.01,
        longitude: center.longitude + (Math.random()-0.5) * 0.01
      };
      
    }catch(error){
      newPin.coordinate= {
          latitude: location.latitude + (Math.random()-0.5) * 0.01,
          longitude: location.longitude + (Math.random()-0.5) * 0.01,
        };
    }

    addPin(newPin);
    setDisableScreenEditPinScreen(true);
    setCurrentPin(newPin);
  };

  const handleRemovePin = (id) => {
    setDisableScreenEditPinScreen(true);
    setCurrentPin(pins.find(pin => pin.id === id));
  };




  const [location, setLocation] = useState(null);
  const [markerClicked, setMarkerClicked] = useState(false);

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
          zoomControlEnabled={false}
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
            <React.Fragment key={pin.id}>
              <Marker
                key={`${pin.id}-${pin.colour}`} 
                coordinate={pin.coordinate}
                title='Change Details'
                pinColor={pin.colour}
                draggable
                onDrag={(e) => {
                  updatePin({ ...pin, coordinate: e.nativeEvent.coordinate });
                }}
                onDragEnd={(e) => {
                  updatePin({ ...pin, coordinate: e.nativeEvent.coordinate });
                  console.log(pins, e.nativeEvent.coordinate);
                }}
                onPress={() => {
                  setMarkerClicked(true);
                  disableScreenEditPinScreen && setCurrentPin(pin);
                }}
                onCalloutPress={() => handleRemovePin(pin.id)}
              />

              <Circle
                center={pin.coordinate}
                radius={pin.radius}
                color={pin.colour}
                strokeColor={pin.colour}
                fillColor={`${pin.colour}20`}
                />
            </React.Fragment>
            ))}
        </MapView>

        ): (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Fetching location...</Text>
          </View>
        )}

      <OverlayComponent />

      <TouchableOpacity style={styles.plusButton} onPress={handleAddPin}>
        <View style={styles.innerPlus}>
          <Text style={styles.plusText}>+</Text>
        </View>
      </TouchableOpacity>

      <GeofenceChecker/>
      <LocationPermission onLocation={setLocation}/>
      <OverlayPanel
        pin={currentPin}
        updatePin={updatePin}
        removePin={removePin}
        selectedPin={selectedPin}
        setSelectedPin={setSelectedPin}
        disableScreenEditPinScreen={disableScreenEditPinScreen}
        setDisableScreenEditPinScreen={setDisableScreenEditPinScreen}
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
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00e5ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
    zIndex: 20,
  },

  innerPlus: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  plusText: {
    fontSize: 40,
    color: '#ffffff',
    fontWeight: '600',
    position: 'absolute',
    top: '35%',
    left: '53%',
    transform: [
      { translateX: -12 },
      { translateY: -20 }
    ],
    textShadowColor: '#00e5ff',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
});
