import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView, StyleSheet, ActivityIndicator, Alert as RNAlert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { database } from './config/firebase';
import { ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useAlert } from './Alert';

const SensorCharts = () => {
  const { addAlert } = useAlert();
  const [temperatureData, setTemperatureData] = useState([]);
  const [pressureData, setPressureData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastLowPressureAlertTime, setLastLowPressureAlertTime] = useState(0);
  const [lastHighPressureAlertTime, setLastHighPressureAlertTime] = useState(0);
  const [lastHighTemperatureAlertTime, setLastHighTemperatureAlertTime] = useState(0);

  useEffect(() => {
    const fetchData = () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;
        const readingsRef = ref(database, `UsersData/${userId}/readings`);

        onValue(
          readingsRef,
          (snapshot) => {
            const data = snapshot.val();

            if (data) {
              const tempData = [];
              const pressData = [];
              const tempLabels = [];

              const timestamps = Object.keys(data);
              if (timestamps.length > 0) {
                const sortedTimestamps = timestamps.sort((a, b) => b - a);
                const recentTimestamps = sortedTimestamps.slice(0, 10);

                recentTimestamps.forEach((timestamp) => {
                  const entry = data[timestamp];
                  if (entry) {
                    const date = new Date(parseInt(timestamp) * 1000);
                    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                    tempLabels.push(formattedTime);

                    if (entry.temperature) {
                      const tempValue = parseFloat(entry.temperature);
                      tempData.push(tempValue);
                      const currentTime = Date.now();
                      if (tempValue > 90) {
                        if (currentTime - lastHighTemperatureAlertTime > 300000) {
                          addAlert('High Temperature Alert', 'Temperature exceeds 90°C!');
                          setLastHighTemperatureAlertTime(currentTime);
                          console.log('High Temperature Alert shown');
                        }
                      }
                    }

                    if (entry.pressure) {
                      const pressValue = parseFloat(entry.pressure);
                      pressData.push(pressValue);
                      const currentTime = Date.now();
                      if (pressValue < 0) {
                        if (currentTime - lastLowPressureAlertTime > 3000000) {
                          addAlert('Low Pressure Alert', 'Pressure is below 22 psi!');
                          setLastLowPressureAlertTime(currentTime);
                          console.log('Low Pressure Alert shown');
                        }
                      }else if (pressValue > 40) {
                        if (currentTime - lastHighPressureAlertTime > 3000000) {
                          addAlert('High Pressure Alert', 'Pressure exceeds 38 psi!');
                          setLastHighPressureAlertTime(currentTime);
                          console.log('High Pressure Alert shown');
                        }
                      }
                    }
                  }
                });

                setTemperatureData(tempData);
                setPressureData(pressData);
                setLabels(tempLabels);
                setError(null);
              } else {
                setError('No data available.');
              }
            } else {
              setError('No data found for this user.');
            }
            setLoading(false);
          },
          (errorObject) => {
            setError("Failed to fetch data: " + errorObject.message);
            setLoading(false);
          }
        );
      } else {
        setError("No user is logged in.");
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, [lastLowPressureAlertTime, lastHighPressureAlertTime, lastHighTemperatureAlertTime]);

  const limitedLabels = labels.slice(-10);
  const limitedTempData = temperatureData.slice(-10);
  const limitedPressData = pressureData.slice(-10);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pressure Over Time</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1e90ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : limitedPressData.length > 0 ? (
        <ScrollView horizontal style={styles.scrollContainer}>
          <LineChart
            data={{
              labels: limitedLabels,
              datasets: [
                {
                  data: limitedPressData,
                },
              ],
            }}
            width={Dimensions.get('window').width * 1.2}
            height={250}
            yAxisLabel=""
            yAxisSuffix=" psi"
            chartConfig={{
              backgroundColor: '#1e90ff',
              backgroundGradientFrom: '#87ceeb',
              backgroundGradientTo: '#4682b4',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
                marginLeft: 2,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#4682b4',
              },
            }}
            bezier
            style={styles.chart}
          />
        </ScrollView>
      ) : (
        <Text style={{ textAlign: 'center' }}>No pressure data available</Text>
      )}

      <Text style={styles.title}>Temperature Over Time</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#ffa726" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : limitedTempData.length > 0 ? (
        <ScrollView horizontal style={styles.scrollContainer}>
          <LineChart
            data={{
              labels: limitedLabels,
              datasets: [
                {
                  data: limitedTempData,
                },
              ],
            }}
            width={Dimensions.get('window').width * 1.2}
            height={250}
            yAxisLabel=""
            yAxisSuffix="°C"
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
                marginLeft: 2,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={styles.chart}
          />
        </ScrollView>
      ) : (
        <Text style={{ textAlign: 'center' }}>No temperature data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#3d3d3d',
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    width: Dimensions.get('window').width * 1.2,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 10,
    color: '#af905e',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default SensorCharts;
