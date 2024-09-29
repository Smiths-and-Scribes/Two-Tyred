import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';

export default function App() {
    const [machineType, setMachineType] = useState('');
    const [numTyres, setNumTyres] = useState('');
    const [unloadedWeight, setUnloadedWeight] = useState('');
    const [payload, setPayload] = useState('');
    const [frontDistribution, setFrontDistribution] = useState('');
    const [rearDistribution, setRearDistribution] = useState('');
    const [cycleLength, setCycleLength] = useState('');
    const [cycleDuration, setCycleDuration] = useState('');
    const [siteTemp, setSiteTemp] = useState('');

    const [results, setResults] = useState(null);

    const calculateTKPH = () => {
        const unloadedVehicleWeight = parseFloat(unloadedWeight);
        const payloadWeight = parseFloat(payload);
        const gvwFront = parseFloat(frontDistribution) / 100;
        const gvwRear = parseFloat(rearDistribution) / 100;
        const cycleLen = parseFloat(cycleLength);
        const cycleDur = parseFloat(cycleDuration);
        const temperature = parseFloat(siteTemp);

        const grossWeight = unloadedVehicleWeight + payloadWeight;
        const unloadedAxleLoadFront = unloadedVehicleWeight * gvwFront;
        const unloadedAxleLoadRear = unloadedVehicleWeight * gvwRear;
        const unloadedLoadPerTyreFront = unloadedAxleLoadFront / 2;
        const unloadedLoadPerTyreRear = unloadedAxleLoadRear / 2;
        const loadedAxleLoadFront = grossWeight * gvwFront;
        const loadedAxleLoadRear = grossWeight * gvwRear;
        const loadedLoadPerTyreFront = loadedAxleLoadFront / 2;
        const loadedLoadPerTyreRear = loadedAxleLoadRear / 2;
        const meanLoadPerTyreFront =
            (unloadedLoadPerTyreFront + loadedLoadPerTyreFront) / 2;
        const meanLoadPerTyreRear =
            (unloadedLoadPerTyreRear + loadedLoadPerTyreRear) / 2;
        const avgSpeed = (cycleLen * 60) / cycleDur;
        const K1 = 1.06;
        const K2 = avgSpeed / (avgSpeed - 0.4 * (temperature - 38));
        const tkphFront = meanLoadPerTyreFront * avgSpeed * K1 * K2;
        const tkphRear = meanLoadPerTyreRear * avgSpeed * K1 * K2;

        setResults({
            grossWeight,
            unloadedAxleLoadFront,
            unloadedAxleLoadRear,
            unloadedLoadPerTyreFront,
            unloadedLoadPerTyreRear,
            loadedAxleLoadFront,
            loadedAxleLoadRear,
            loadedLoadPerTyreFront,
            loadedLoadPerTyreRear,
            meanLoadPerTyreFront,
            meanLoadPerTyreRear,
            avgSpeed,
            K1,
            K2,
            tkphFront,
            tkphRear,
        });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>TKPH Calculator</Text>

            <TextInput
                style={styles.input}
                placeholder="Type of Machine"
                value={machineType}
                onChangeText={setMachineType}
            />
            <TextInput
                style={styles.input}
                placeholder="Number of Tyres"
                keyboardType="numeric"
                value={numTyres}
                onChangeText={setNumTyres}
            />
            <TextInput
                style={styles.input}
                placeholder="Unloaded Vehicle Weight (tonnes)"
                keyboardType="numeric"
                value={unloadedWeight}
                onChangeText={setUnloadedWeight}
            />
            <TextInput
                style={styles.input}
                placeholder="Payload (tonnes)"
                keyboardType="numeric"
                value={payload}
                onChangeText={setPayload}
            />
            <TextInput
                style={styles.input}
                placeholder="GVW Distribution Front (%)"
                keyboardType="numeric"
                value={frontDistribution}
                onChangeText={setFrontDistribution}
            />
            <TextInput
                style={styles.input}
                placeholder="GVW Distribution Rear (%)"
                keyboardType="numeric"
                value={rearDistribution}
                onChangeText={setRearDistribution}
            />
            <TextInput
                style={styles.input}
                placeholder="Cycle Length (km)"
                keyboardType="numeric"
                value={cycleLength}
                onChangeText={setCycleLength}
            />
            <TextInput
                style={styles.input}
                placeholder="Cycle Duration (minutes)"
                keyboardType="numeric"
                value={cycleDuration}
                onChangeText={setCycleDuration}
            />
            <TextInput
                style={styles.input}
                placeholder="Site Temperature (°C)"
                keyboardType="numeric"
                value={siteTemp}
                onChangeText={setSiteTemp}
            />

            <View style={styles.formAction}>
                <TouchableOpacity
                    onPress={() => {
                        calculateTKPH()
                    }}>
                    <View style={styles.btn}>
                        <Text style={styles.btnText}>Calculate TKPH</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {results && (
                <View style={styles.resultsContainer}>
                    <Text style={styles.resultText}>
                        Gross Weight: {results.grossWeight.toFixed(2)} tonnes
                    </Text>
                    <Text style={styles.resultText}>
                        Unloaded Axle Load (Front): {results.unloadedAxleLoadFront.toFixed(2)} tonnes
                    </Text>
                    <Text style={styles.resultText}>
                        Unloaded Axle Load (Rear): {results.unloadedAxleLoadRear.toFixed(2)} tonnes
                    </Text>
                    <Text style={styles.resultText}>
                        Unloaded Load per Tyre (Front): {results.unloadedLoadPerTyreFront.toFixed(2)} tonnes
                    </Text>
                    <Text style={styles.resultText}>
                        Unloaded Load per Tyre (Rear): {results.unloadedLoadPerTyreRear.toFixed(2)} tonnes
                    </Text>
                    <Text style={styles.resultText}>
                        Loaded Axle Load (Front): {results.loadedAxleLoadFront.toFixed(2)} tonnes
                    </Text>
                    <Text style={styles.resultText}>
                        Loaded Axle Load (Rear): {results.loadedAxleLoadRear.toFixed(2)} tonnes
                    </Text>
                    <Text style={styles.resultText}>
                        Loaded Load per Tyre (Front): {results.loadedLoadPerTyreFront.toFixed(2)} tonnes
                    </Text>
                    <Text style={styles.resultText}>
                        Loaded Load per Tyre (Rear): {results.loadedLoadPerTyreRear.toFixed(2)} tonnes
                    </Text>
                    <Text style={styles.resultText}>
                        Mean Load per Tyre (Front): {results.meanLoadPerTyreFront.toFixed(2)} tonnes
                    </Text>
                    <Text style={styles.resultText}>
                        Mean Load per Tyre (Rear): {results.meanLoadPerTyreRear.toFixed(2)} tonnes
                    </Text>
                    <Text style={styles.resultText}>
                        Average Speed: {results.avgSpeed.toFixed(2)} km/h
                    </Text>
                    <Text style={styles.resultText}>K1: {results.K1}</Text>
                    <Text style={styles.resultText}>K2: {results.K2.toFixed(2)}</Text>
                    <Text style={styles.resultText}>
                        TKPH (Front): {results.tkphFront.toFixed(2)}
                    </Text>
                    <Text style={styles.resultText}>
                        TKPH (Rear): {results.tkphRear.toFixed(2)}
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#3d3d3d',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#FFFFFF',
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 12,
        fontSize: 17,
        fontWeight: '600',
        height: 50,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        borderRadius: 12,
        fontWeight: '500',
        color: '#222',
        borderColor: '#C9D3DB',
        borderStyle: 'solid',
    },
    resultsContainer: {
        marginTop: 20,
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        backgroundColor: '#af905e',
        borderColor: '#af905e',
        marginBottom: 40,
    },
    resultText: {
        fontSize: 15,
        marginBottom: 5,
        fontWeight: '600',
        color: '#000000',
        lineHeight: 25,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        backgroundColor: '#af905e',
        borderColor: '#af905e',
    },
    btnText: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '600',
        color: '#000000',
    },
});