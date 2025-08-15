import React, { useRef,useEffect,useState } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated,TouchableOpacity,TextInput, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Progress from 'react-native-progress';
import CheckBox from '@react-native-community/checkbox';


export default function OverlayPanel({pin, pins, updatePin, removePin ,disableScreenEditPinScreen,setDisableScreenEditPinScreen}) 
{

  
  const minHeight = 100;
  const maxHeight = 400;

  function disableScreenEditPinScreenFunction(){
    disableScreenEditPinScreen=false;
  }

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

  const colors = ['red', 'green', 'blue', 'yellow','lightblue', 'orange', 'purple','cyan'];
  const [selectedColor, setSelectedColor] = useState(null);

  const handleSelect = (color) => {
    setSelectedColor(color);
    pin.colour = color;
    updatePin(pin);

    
  };


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
      <View style={{height:20,paddingBottom:12,paddingTop:0}}  {...panResponder.panHandlers} >
        <View style={styles.draggler}></View>
      </View>
      <ScrollView>

      
      

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
            }}
          />
          <Text style={{color:'white',paddingRight:'30'}}>{pin.radius}</Text>
        </View>
        
      </View>
      <View> 
          <Text style={{color:'rgba(202, 202, 202, 1)',fontSize:20,marginRight:'50',paddingVertical:10}}>Title </Text>

          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1, color:'white',paddingLeft:10}}
            placeholder="Enter Pin Title"
            placeholderTextColor="rgba(202, 202, 202, 1)"
            value={pin.title}
            onChangeText={(text) => {
              pin.title = text;
              updatePin(pin);
            }}
          />

      </View>
      <View style={{marginVertical:'20'}}>
        <View style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
          <Text style={{color:'rgba(202, 202, 202, 1)',fontSize:20,marginRight:'50',paddingVertical:10}}>Alarm ringtone :</Text>
          <CheckBox 
            value={pin.sound} 
            onValueChange={(value)=>{
              pin.sound= value;
              updatePin(pin);
            }}
            tintColors={{ true: '#21f352ff', false: '#aaa' }}
          />
        </View>
      </View>
      <View>
          <Text style={{color:'rgba(202, 202, 202, 1)',fontSize:20,marginRight:'50',paddingTop:0}}>Colour </Text>
          <View style={styles.colorContainer}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorSelected
                ]}
                onPress={() => handleSelect(color)}
              />
            ))}
          </View>
      </View>


      <View style={{paddingBottom:10,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-evenly'}}>
        <TouchableOpacity
          onPress={()=>{ removePin(pin.id);setDisableScreenEditPinScreen(false);}}
        >
          <Text style={{color:'rgba(255, 93, 93, 1)',fontSize:18,paddingTop:20,textAlign:'center'}}>Remove</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>{setDisableScreenEditPinScreen(false);}}
        >
          <Text style={{color:'rgba(165, 255, 105, 1)',fontSize:18,paddingTop:20,textAlign:'center'}}>Save</Text>
        </TouchableOpacity>
      </View>

      
    </ScrollView>
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

  colorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
    paddingHorizontal:5,

  },
  colorSelected: {
    borderColor: "#fff", // stroke color for selection
    borderWidth: 3,
  },


  overlay: {
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 10,
    maxHeight: 400,
    flexShrink:0,
    paddingVertical:20,
  },
  heading: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
  },
  draggler: {
    width: 100,
    height: 6,
    backgroundColor: 'rgba(98, 98, 98, 0.9)',
    alignSelf: 'center',
    borderRadius: 50,
  },
});
