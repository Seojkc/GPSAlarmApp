import React, { createContext, useReducer, useEffect } from 'react';
import { pinReducer } from './PInReducer.js';
import { loadPins, savePin } from '../Storage/pinStorage.js';

export const PinContext = createContext();

export const PinProvider = ({ children }) => {
  const [pins, dispatch] = useReducer(pinReducer, []);

  // Load pins on mount
  useEffect(() => {
    (async () => {
      const loadedPins = await loadPins();
      dispatch({ type: 'LOAD_PINS', payload: loadedPins });
    })();
  }, []);

  // Save pins on change
  useEffect(() => {
    savePin(pins);
  }, [pins]);

  // Wrap dispatch for convenience
  const addPin = (pin) => dispatch({ type: 'ADD_PIN', payload: pin });
  const updatePin = (pin) => dispatch({ type: 'UPDATE_PIN', payload: pin });
  const removePin = (id) => dispatch({ type: 'REMOVE_PIN', payload: id });

  return (
    <PinContext.Provider value={{ pins, addPin, updatePin, removePin }}>
      {children}
    </PinContext.Provider>
  );
};
