import React, { useEffect, useState, useRef, useContext } from 'react';
import Geolocation from '@react-native-community/geolocation';
import PushNotification from "react-native-push-notification";
import RequestLocationPermission from './LocationPermission';
import { PinContext } from '../Context/PinContext';
import Alarm from './Alarm';

export default function GeofenceChecker() {

  const [alarmOn, setAlarmOn] = useState(false);
  const { pins, addPin, updatePin, removePin } = useContext(PinContext);
  const insideStatus = useRef({});
  const initialized = useRef(false);
  const pendingTimers = useRef({});
  const [curretntAlarmTitle, setCurretntAlarmTitle] = useState("");

  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Create notification channel (Android specific)
    PushNotification.createChannel(
      {
        channelId: "geofence",
        channelName: "Geofence Alerts",
        channelDescription: "Notifications for geofence entry/exit",
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Channel 'geofence' ${created ? "created" : "exists"}`)
    );
  }, []);

  const triggerNotification = (title, message) => {
    PushNotification.localNotification({
      channelId: "geofence",
      title: title,
      message: message,
      playSound: true,
      soundName: "default",
      vibrate: true,
    });
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  useEffect(() => {
    if (!location) return;

    const watchId = Geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log(`Current position: ${latitude}, ${longitude}`);

        pins.forEach((pin) => {
          const distance = getDistance(latitude, longitude, pin.coordinate.latitude, pin.coordinate.longitude);
          const isInside = distance <= pin.radius;

          // Only trigger notification AFTER initialization
          if (initialized.current) {
            if (insideStatus.current[pin.id] !== isInside) {

              if (pendingTimers.current[pin.id]) {
                clearTimeout(pendingTimers.current[pin.id]);
              }

              pendingTimers.current[pin.id] = setTimeout(() => {
                insideStatus.current[pin.id] = isInside;

                if (isInside && pin.property === 1) {
                  console.log("Entered");
                  triggerNotification(
                    `Entered`,
                    `You've arrived at ${pin.title || "the location"}`
                  );
                  if (pin.sound) {
                    setCurretntAlarmTitle((pin.title || "the location" )+  " Entered");
                    setAlarmOn(true);
                  }
                } else if (!isInside && pin.property === 0) {
                  console.log("Exited");
                  triggerNotification(
                    `Exited`,
                    `You've Exited from ${pin.title || "the location"}`
                  );
                  if (pin.sound) {
                    setCurretntAlarmTitle((pin.title || "the location") +  " Exited");
                    setAlarmOn(true);
                  }
                } else {
                  console.log("No action for this pin property");
                }
              }, 1500);
            }
          } else {
            // Initialize the status without triggering
            insideStatus.current[pin.id] = isInside;
          }
        });

        // After the first run, mark as initialized
        if (!initialized.current) initialized.current = true;

      },
      (err) => console.warn(err),
      { enableHighAccuracy: false, distanceFilter: 10, interval: 1000, fastestInterval: 500 }
    );

    return () => Geolocation.clearWatch(watchId);
  }, [pins, location]);

  return (
    <>
      <RequestLocationPermission onLocation={setLocation} />
      <Alarm play={alarmOn} title={curretntAlarmTitle} onStop={() => setAlarmOn(false)} />
    </>
  )
}
