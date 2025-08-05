import React, { useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated } from 'react-native';

export default function OverlayPanel({ pins, updatePin, removePin ,disableScreenEditPinScreen}) {
  const minHeight = 100;
  const maxHeight = 400;

  // Start with 300 height
  const animatedHeight = useRef(new Animated.Value(300)).current;
  const startHeight = useRef(300);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        animatedHeight.stopAnimation((value) => {
          startHeight.current = value;
        });
      },
      onPanResponderMove: (e, gestureState) => {
        let newHeight = startHeight.current - gestureState.dy;
        newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
        animatedHeight.setValue(newHeight);
      },
      onPanResponderRelease: () => {
        // Optional: snap to nearest position
        animatedHeight.flattenOffset();
      },
    })
  ).current;

  return disableScreenEditPinScreen?(
    <Animated.View style={[styles.overlay, { height: animatedHeight }]}>
      <View style={styles.draggler} {...panResponder.panHandlers} />
      <Text style={styles.heading}>Pins</Text>
    </Animated.View>
  ):null;
}

const styles = StyleSheet.create({
  overlay: {
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 10,
    maxHeight: 400,
    
  },
  heading: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
  },
  draggler: {
    width: 50,
    height: 6,
    backgroundColor: 'rgba(115, 115, 115, 0.9)',
    alignSelf: 'center',
    borderRadius: 50,
    marginBottom: 10,
  },
});
