import React, { useState, useEffect, useRef } from "react";
import { View, Text, Modal, TouchableOpacity, Animated, StyleSheet } from "react-native";
import Sound from "react-native-sound";

Sound.setCategory("Playback");

export default function Alarm({ play, onStop, title }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

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
    if (onStop) onStop();
  };

  // 💫 Button pulse animation
  const animateButton = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.2, duration: 600, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  };

  return (
    <Modal visible={isPlaying} transparent={false} animationType="fade">
      <View style={styles.container}>
        <Text style={styles.title}>⏰ {title || "Alarm"}</Text>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity style={styles.stopButton} onPress={stopAlarm}>
            <Text style={styles.stopText}>STOP</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    color: "white",
    marginBottom: 50,
    fontWeight: "bold",
    textAlign: "center",
  },
  stopButton: {
    backgroundColor: "#E53935",
    paddingVertical: 30,
    paddingHorizontal: 60,
    borderRadius: 100,
    elevation: 10,
    shadowColor: "#E53935",
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  stopText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 2,
  },
});
