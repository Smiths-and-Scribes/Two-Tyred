import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { } from 'firebase/auth';
import './config/firebase';
import RootNavigation from './navigation';

const Stack = createStackNavigator();

export default function App() {
  return (
    <RootNavigation />
  );
}
