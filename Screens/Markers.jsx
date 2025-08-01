import React, { useEffect, useState } from 'react';
import { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'location_markers';

export default function DraggableMarkers({ location }) {
  const [markers, setMarkers] = useState([]);

  // Load saved markers
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) setMarkers(JSON.parse(data));
    });
  }, []);

  // Save markers when updated
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(markers));
  }, [markers]);

  // Add marker function
  const addMarker = () => {
    if (!location) return;
    const offset = 0.001 * (Math.random() - 0.5);
    const newMarker = {
      id: Date.now(),
      coordinate: {
        latitude: location.latitude + offset,
        longitude: location.longitude + offset,
      },
    };
    setMarkers((prev) => [...prev, newMarker]);
  };

  // Update marker position
  const updateMarker = (id, newCoord) => {
    setMarkers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, coordinate: newCoord } : m))
    );
  };

  return (
    <>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={marker.coordinate}
          draggable
          onDragEnd={(e) =>
            updateMarker(marker.id, e.nativeEvent.coordinate)
          }
          title="Custom Pin"
        />
      ))}
    </>
  );
}

export { STORAGE_KEY }; // So parent can also add
