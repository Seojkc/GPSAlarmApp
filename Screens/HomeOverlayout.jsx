import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';
const { height, width } = Dimensions.get('window');

export default function OverlayComponent() {
  const bottomHeight = height / 2;
  const minHeight = 60; // height when collapsed (just enough for arrow)

  const animation = useRef(new Animated.Value(bottomHeight)).current; // initial height = half screen
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
      {/* Touchable arrow to toggle */}
      <TouchableOpacity style={styles.arrowContainer} onPress={toggleOverlay}>
        <Text style={{ fontSize: 30, color: 'white' }}>
            {expanded ? '↓' : '↑'}
        </Text>
      </TouchableOpacity>

      {/* Content visible only when expanded */}
      {expanded && (
        <View style={styles.content}>
          <Text style={styles.text}>Overlay Content Here</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 10,
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
