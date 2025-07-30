import React from 'react';
import { View, Text, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement, incrementByAmount } from '../State/CounterSlice.js';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Main({}) {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text>Main Screen</Text>
        <Text>Redux</Text>
        <Text>Count: {count}</Text>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Button title="Increment" onPress={() => dispatch(increment())} />
          <View style={{ width: 10 }} />
          <Button title="Decrement" onPress={() => dispatch(decrement())} />
          <View style={{ width: 10 }} />
          <Button title="Increment BY Amount" onPress={() => dispatch(incrementByAmount(5))} />
        </View>
      </View>
    </SafeAreaView>
  );
}
