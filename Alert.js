// Alert.js
import React, { createContext, useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, Alert as RNAlert } from 'react-native';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [lastAlertTime, setLastAlertTime] = useState(null);

  const addAlert = useCallback((title, message) => {
    const now = new Date();
    if (lastAlertTime && (now - lastAlertTime) < 300000) return;

    RNAlert.alert(title, message, [{ text: 'OK', onPress: () => setLastAlertTime(now) }]);
    setAlerts([...alerts, { title, message, timestamp: now }]);
  }, [alerts, lastAlertTime]);

  return (
    <AlertContext.Provider value={{ addAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
    zIndex: 1000,
  },
  alertText: {
    color: 'white',
  },
});
