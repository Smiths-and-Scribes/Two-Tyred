import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import Register from './Register';
import Welcome from './Welcome';
import SensorData from './SensorData';
import TKPH from './TKPH';
import SensorCharts from './SensorCharts';
import AboutProject from './AboutProject';
import { AlertProvider } from './Alert';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <AlertProvider>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#000000',
            },
            headerStyle: {
              backgroundColor: '#af905e',
            },
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="SensorData" component={SensorData} />
          <Stack.Screen name="TKPH" component={TKPH} />
          <Stack.Screen name="SensorCharts" component={SensorCharts} />
          <Stack.Screen name="AboutProject" component={AboutProject} />
        </Stack.Navigator>
      </AlertProvider>
    </NavigationContainer>
  );
}

export default App;
