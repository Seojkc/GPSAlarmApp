// HomeOverlayout.js
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';

const { height, width } = Dimensions.get('window');

export default function OverlayComponent() {
  const bottomHeight = height / 2;
  const minHeight = 60;

  const animation = useRef(new Animated.Value(bottomHeight)).current;
  const [expanded, setExpanded] = useState(true);

  const toggleOverlay = () => {
    Animated.timing(animation, {
      toValue: expanded ? minHeight : bottomHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  return (
    <Animated.View style={[styles.overlay, { height: animation }]}>
      <TouchableOpacity style={styles.arrowContainer} onPress={toggleOverlay}>
        <Text style={{ fontSize: 30, color: 'white' }}>
          {expanded ? '↓' : '↑'}
        </Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.content}>
          <Text style={styles.text}>poda koppe</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    width: width,
    backgroundColor: 'rgba(21, 21, 21, 1)',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    bottom: 0,
  },
  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});
