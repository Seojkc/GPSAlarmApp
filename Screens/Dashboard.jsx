
import React from 'react';
import { View, Text } from 'react-native';
import MapView from 'react-native-maps';
import { StyleSheet } from 'react-native';

export default function Dashboard() {
  return (
    <View style={{ flex: 1 }}>
      <MapView style={styles.mapView} >
      </MapView>
    </View>
  );
}


const styles = StyleSheet.create({
  mapView:{
    flex:1
  }
})