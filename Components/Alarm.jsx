import React, { useState, useEffect, useRef } from "react";
import { View, Text, Modal, TouchableOpacity, Animated, StyleSheet, Easing } from "react-native";
import Sound from "react-native-sound";

Sound.setCategory("Playback");

export default function Alarm({ play, onStop, title }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // Wave animation values
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;
  const waveAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (play && !isPlaying) {
      startAlarm();
    } else if (!play && isPlaying) {
      stopAlarm();
    }

    return () => {
      stopAlarm();
    };
  }, [play]);

  // Start wave animations
  const startWaveAnimations = () => {
    // Reset animations
    waveAnim1.setValue(0);
    waveAnim2.setValue(0);
    waveAnim3.setValue(0);
    
    // Create wave animations with staggered timing
    Animated.loop(
      Animated.timing(waveAnim1, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
    
    Animated.loop(
      Animated.timing(waveAnim2, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
        delay: 1000
      })
    ).start();
    
    Animated.loop(
      Animated.timing(waveAnim3, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
        delay: 2000
      })
    ).start();
  };

  // Helper function to create a single wave animation
  const createWaveAnimation = (animValue, delay) => {
    return Animated.sequence([
      Animated.delay(delay),
      Animated.timing(animValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      })
    ]);
  };

  // 🔊 Start alarm sound
  const startAlarm = () => {
    const alarm = new Sound("alarm.mp3", Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log("Failed to load sound", error);
        return;
      }
      alarm.setNumberOfLoops(-1);
      alarm.play((success) => {
        if (!success) {
          console.log("Failed to play sound");
        }
      });
      soundRef.current = alarm;
      setIsPlaying(true);
      animateButton();
      startWaveAnimations();
    });
  };

  // ⏹ Stop alarm sound
  const stopAlarm = () => {
    if (soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current.release();
      });
    }
    setIsPlaying(false);
    // Stop all animations
    waveAnim1.stopAnimation();
    waveAnim2.stopAnimation();
    waveAnim3.stopAnimation();
    if (onStop) onStop();
  };

  // 💫 Button pulse animation
  const animateButton = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  };

  // Interpolate values for wave animations
  const wave1Scale = waveAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 4]
  });
  
  const wave1Opacity = waveAnim1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 0.3, 0]
  });
  
  const wave2Scale = waveAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 4]
  });
  
  const wave2Opacity = waveAnim2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 0.3, 0]
  });
  
  const wave3Scale = waveAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 4]
  });
  
  const wave3Opacity = waveAnim3.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 0.3, 0]
  });

  return (
    <Modal visible={isPlaying} transparent={true} animationType="fade">
      <View style={styles.container}>
        <Text style={styles.title}>{title || "Alarm"}</Text>

        <View style={styles.waveContainer}>
          {/* Wave 1 */}
          <Animated.View 
            style={[
              styles.wave,
              {
                transform: [{ scale: wave1Scale }],
                opacity: wave1Opacity
              }
            ]} 
          />
          
          {/* Wave 2 */}
          <Animated.View 
            style={[
              styles.wave,
              {
                transform: [{ scale: wave2Scale }],
                opacity: wave2Opacity
              }
            ]} 
          />
          
          {/* Wave 3 */}
          <Animated.View 
            style={[
              styles.wave,
              {
                transform: [{ scale: wave3Scale }],
                opacity: wave3Opacity
              }
            ]} 
          />
          
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity style={styles.stopButton} onPress={stopAlarm}>
              <Text style={styles.stopText}>STOP</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1111117d",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.90,
  },
  title: {
    fontSize: 30,
    color: "white",
    marginBottom: 50,
    textAlign: "center",
  },
  waveContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  wave: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#ffffff50",
  },
  stopButton: {
    backgroundColor: "#000000a4",
    display: "flex",
    borderRadius: 1000,
    shadowColor: "#ffffffff",
    shadowOpacity: 0.6,
    width:200,
    height:200,
    borderColor: "#ffffff81",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stopText: {
    fontSize: 27,
    color: "white",
    letterSpacing: 4,
    textAlign: "center",
  },
});