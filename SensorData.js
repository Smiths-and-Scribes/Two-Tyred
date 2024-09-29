import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { database } from './config/firebase';
import { ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';

export default function SensorDataScreen() {
    const [temperature, setTemperature] = useState(null);
    const [pressure, setPressure] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const userId = user.uid;
            console.log("Logged-in user ID:", userId);
            const readingsRef = ref(database, `UsersData/${userId}/readings`);
            const fetchReadings = () => {
                onValue(readingsRef, (snapshot) => {
                    const data = snapshot.val();
                    console.log("Fetched data from Firebase:", data);

                    if (data) {
                        const timestamps = Object.keys(data);
                        if (timestamps.length > 0) {
                            const sortedTimestamps = timestamps.sort((a, b) => b - a);
                            const mostRecentTimestamp = sortedTimestamps[0];
                            const mostRecentEntry = data[mostRecentTimestamp];
                            setTemperature(mostRecentEntry.temperature);
                            setPressure(mostRecentEntry.pressure);
                        } else {
                            setError("No readings data available.");
                        }
                    } else {
                        setError("No data found for this user.");
                    }
                }, (errorObject) => {
                    setError("Failed to fetch data: " + errorObject.message);  // Handle errors
                });
            };

            fetchReadings();

            const interval = setInterval(fetchReadings, 5000);

            return () => clearInterval(interval);
        } else {
            setError("No user is logged in.");
        }
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Latest Sensor Readings</Text>
            <View style={styles.table}>
                <Text style={styles.tableHeader}>Temperature</Text>
                <View style={styles.row}>
                    <Text style={styles.cell}>
                        {temperature ? `${temperature}°C` : error ? error : 'No data'}
                    </Text>
                </View>
            </View>
            <View style={styles.table}>
                <Text style={styles.tableHeader}>Pressure</Text>
                <View style={styles.row}>
                    <Text style={styles.cell}>
                        {pressure ? `${pressure} psi` : error ? error : 'No data'}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3d3d3d',
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        color: '#af905e',
        textAlign: 'center',
        marginBottom: 20,
    },
    table: {
        backgroundColor: '#af905e',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    tableHeader: {
        fontWeight: '700',
        color: '#000000',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    cell: {
        color: '#000000',
        fontSize: 16,
    },
});
