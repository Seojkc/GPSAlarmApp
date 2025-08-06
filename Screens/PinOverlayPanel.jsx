import React, { useRef,useEffect,useState } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated,TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Progress from 'react-native-progress';


export default function OverlayPanel({pin, pins, updatePin, removePin ,disableScreenEditPinScreen}) 
{

  
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


  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setValue((prev) => {
  //       if (prev >= 500) {
  //         clearInterval(interval);
  //         return 500;
  //       }
  //       return prev + 10; // increment
  //     });
  //   }, 200); // update every 200ms

  //   return () => clearInterval(interval);
  // }, []);

  //const progress = (pin.radius -100)/(500-100);
  //const [value, setValue] = useState(100);

  // useEffect(()=>{
  //   pin.radius = value;
  //   updatePin(pin);
  // },[value])

  function getCircleCoordinates(center, radius, pointsCount = 36) {
    const coords = [];
    const earthRadius = 6371000; // meters

    for (let i = 0; i < pointsCount; i++) {
      const angle = (i * 360) / pointsCount;
      const radian = (Math.PI / 180) * angle;

      const latOffset = (radius / earthRadius) * (180 / Math.PI) * Math.cos(radian);
      const lngOffset = (radius / earthRadius) * (180 / Math.PI) * Math.sin(radian) / Math.cos(center.latitude * Math.PI / 180);

      coords.push({
        latitude: center.latitude + latOffset,
        longitude: center.longitude + lngOffset
      });
    }
    return coords;
  }

  return disableScreenEditPinScreen?(
    <Animated.View style={[styles.overlay, { height: animatedHeight }]}>
      <View style={styles.draggler} {...panResponder.panHandlers} />
      <Text>{pin.id}</Text>

      <View style={{display:'flex',flexDirection:'row',paddingVertical:20,justifyContent:'space-between'}}>
        <Text style={{color:'rgba(202, 202, 202, 1)',fontSize:20,marginRight:'50'}}>Transition </Text>
        <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
          <TouchableOpacity style={[
            styles.transitionButton,
            pin.property == 1 && styles.transitionBUttonclicked
            ]} onPress={()=>{pin.property = 1; updatePin(pin);}}>
            <Text>Enter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[
            styles.transitionButton,
            pin.property == 0 && styles.transitionBUttonclicked
            ]} onPress={()=>{pin.property = 0; updatePin(pin);}}>
            <Text>Exit</Text>
          </TouchableOpacity>
        </View>
        
      </View>
      <View>
        <Text style={{color:'rgba(202, 202, 202, 1)',fontSize:20,marginRight:'50',paddingVertical:10}}>Radius </Text>
        

        <View style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
          <Slider
            style={{ width: 300, height: 40 }}
            minimumValue={100}
            maximumValue={500}
            step={10}
            value={pin.radius}
            minimumTrackTintColor="#4caf50"
            maximumTrackTintColor="#ccc"
            thumbTintColor="#4caf50"
            onValueChange={(val) => {
              pin.radius = val;
              updatePin(pin);
              console.log(pin)
            }}
          />
          <Text style={{color:'white',paddingRight:'30'}}>{pin.radius}</Text>
        </View>
        
      </View>
      <View> 

      </View>

      

    </Animated.View>
  ):null;
}

const styles = StyleSheet.create({


  transitionButton:{
    backgroundColor: 'rgba(161, 161, 161, 1)',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    color: 'black',
    fontSize: 16,
  },
  transitionBUttonclicked:{
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },




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
    width: 100,
    height: 6,
    backgroundColor: 'rgba(115, 115, 115, 0.9)',
    alignSelf: 'center',
    borderRadius: 50,
    marginBottom: 10,
  },
});
