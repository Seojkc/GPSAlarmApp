import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

export default function OverlayPanel({ pins, updatePin, removePin }) {
  const renderItem = ({ item }) => {
    return (
      <View style={styles.pinItem}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.coord}>
          Lat: {item.coordinate.latitude.toFixed(4)} | Lon: {item.coordinate.longitude.toFixed(4)}
        </Text>
        {/* You can add buttons or inputs here to update title or coordinate */}
        <TouchableOpacity onPress={() => removePin(item.id)} style={styles.deleteBtn}>
          <Text style={{ color: 'white' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.overlay}>
      <Text style={styles.heading}>Pins</Text>
      <FlatList data={pins} keyExtractor={(item) => item.id} renderItem={renderItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    maxHeight: 200,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    zIndex:20,
  },
  heading: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
  },
  pinItem: {
    backgroundColor: '#333',
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
  },
  title: { color: 'white', fontSize: 16, marginBottom: 4 },
  coord: { color: '#ccc', fontSize: 12, marginBottom: 6 },
  deleteBtn: {
    backgroundColor: 'red',
    padding: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
});
