// index.jsx
import React from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './State/store.js';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PinProvider } from './Context/PinContext.js';


const ReduxApp = () => (
  
      <PinProvider>
        <Provider store={store}>
          <SafeAreaProvider>
            <App />
          </SafeAreaProvider>
        </Provider>
      </PinProvider>
  
);


AppRegistry.registerComponent(appName, () => ReduxApp);
