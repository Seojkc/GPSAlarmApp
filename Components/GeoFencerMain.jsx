import React, { useEffect,useState, useRef, useContext } from 'react';
import Geolocation from '@react-native-community/geolocation';
import RequestLocationPermission from './LocationPermission';
import { PinContext } from '../Context/PinContext';

export default function GeofenceChecker() {

  const { pins, addPin, updatePin, removePin } = useContext(PinContext);
  const insideStatus = useRef({});
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

            // New empty array per location update
            const currentlyInsidePins = [];

            pins.forEach((pin) => {
                const distance = getDistance(latitude, longitude, pin.coordinate.latitude, pin.coordinate.longitude);
                const isInside = distance <= pin.radius;

                if (isInside) {
                currentlyInsidePins.push(pin.title || pin.id);
                }
                if (insideStatus.current[pin.id] !== isInside) 
                {
                    insideStatus.current[pin.id] = isInside;
                    if (isInside && pin.property ==1) 
                        {
                        console.log(`ENTERED pin ${pin.id}`);
                        } 
                    else if (!isInside && pin.property ==0) 
                        {
                            console.log(`EXITED pin ${pin.id}`);
                        }
                }
            });

            },
            (err) => console.warn(err),
            { enableHighAccuracy: true, distanceFilter: 1 }
        );

        return () => Geolocation.clearWatch(watchId);
    }, [pins, location]);  

  return <RequestLocationPermission onLocation={setLocation}/>
}
