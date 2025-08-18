import React, { useEffect,useState, useRef, useContext } from 'react';
import Geolocation from '@react-native-community/geolocation';
import PushNotification from "react-native-push-notification";
import RequestLocationPermission from './LocationPermission';
import { PinContext } from '../Context/PinContext';
import  Alarm from './Alarm';






export default function GeofenceChecker() {

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

  const [alarmOn, setAlarmOn] = useState(false);
  const { pins, addPin, updatePin, removePin } = useContext(PinContext);
  const insideStatus = useRef({});
  const initialized = useRef(false); 

  const [location, setLocation] = useState(null);

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
              const currentlyInsidePins = [];

              pins.forEach((pin) => {
                  const distance = getDistance(latitude, longitude, pin.coordinate.latitude, pin.coordinate.longitude);
                  const isInside = distance <= pin.radius;

                  currentlyInsidePins.push(isInside);

                  // Only trigger notification AFTER initialization
                  if (initialized.current) {
                      if (insideStatus.current[pin.id] !== isInside) {
                          insideStatus.current[pin.id] = isInside;

                          if (isInside && pin.property === 1) 
                            {
                              console.log("Entered");
                              triggerNotification(
                                  `Entered`,
                                  `You've arrived at ${pin.title || "the location"}`
                              );
                              setAlarmOn(true);
                            } 
                          else if (!isInside && pin.property === 0) 
                            {
                              console.log("Exited");
                              triggerNotification(
                                  `Exited`,
                                  `You've Exited from ${pin.title || "the location"}`
                              );
                              setAlarmOn(true);
                            }
                          else{
                            console.log("No action for this pin property");
                          }
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
          { enableHighAccuracy: true, distanceFilter: 0, interval: 1000, fastestInterval: 500 }
      );

      return () => Geolocation.clearWatch(watchId);
  }, [pins, location]); 

  return (
    <>
      <RequestLocationPermission onLocation={setLocation}/>

      <Alarm play={alarmOn} onStop={() => setAlarmOn(false)} />
    </>
  )
}
