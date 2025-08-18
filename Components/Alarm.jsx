import React, { useState, useEffect, useRef, use } from "react";
import { View, Text, Button } from "react-native";
import Sound from "react-native-sound";

Sound.setCategory("Playback");

export default function Alarm({play, onStop})
{

    const [isplaying, setIsPlaying] = useState(false);
    const soundRef = useRef(null);

    useEffect(() => {
        if(play && !isplaying)
        {
            startAlarm();
        }else if(!play && isplaying)
        {
            stopAlarm();
        }
        return () => {
            stopAlarm(); 
        };
    }, [play]);

    const startAlarm =  () =>
    {
        const alarm =  new Sound("alarm.mp3", Sound.MAIN_BUNDLE, (error) => {
            if(error){
                console.log("Failed to load sound",error);
                return;
            }
            alarm.setNumberOfLoops(-1);
            alarm.play((success)=>{
                if(!success){
                    console.log("Failed to play sound");
                }
            });
            soundRef.current = alarm;
            setIsPlaying(true);
        });    
    };

    const stopAlarm = () => {
        if (soundRef.current) {
        soundRef.current.stop(() => {
            soundRef.current.release();
        });
        }
        setIsPlaying(false);
        if (onStop) onStop();
    };

    return (
        <View>
        {isplaying && (
            <>
                <Text>⏰ Alarm is ringing!</Text>
                <Button title="Stop Alarm" onPress={stopAlarm} />
            </>
        )}
        </View>
    );






}