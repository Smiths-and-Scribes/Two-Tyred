import React, { useState } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Image,
    Text,
    TouchableOpacity,
    TextInput,
} from 'react-native'; 
import { useAuthentication } from './hooks/useAuthentication';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { auth } from './config/firebase';
import { signOut } from 'firebase/auth';
import logo from './assets/img.png';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const { user } = useAuthentication();
    const navigation = useNavigation();
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigation.navigate('Login');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView>
                <View style={styles.header}>
                    <Image
                        alt="App Logo"
                        resizeMode="contain"
                        style={styles.headerImg}
                        source={logo}
                    />
                    <Text style={styles.title}>
                        <Text style={{ color: '#af905e' }}>Two Tyred</Text>
                    </Text>
                </View>
                <View style={styles.welcome}>
                    <Text style={styles.welcomeText}>Welcome {user?.email}!{"\n"}{"\n"}What would you like to do today?</Text>
                </View>
                <View style={styles.gridContainer}>
                    <TouchableOpacity style={styles.box1} onPress={() => navigation.navigate('TKPH')}>
                        <Text style={styles.boxText}>{"\n"}Calculate TKPH{"\n"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.box2} onPress={() => navigation.navigate('SensorData')}>
                        <Text style={styles.boxText}>{"\n"}Sensor Data{"\n"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.box3} onPress={() => navigation.navigate('SensorCharts')}>
                        <Text style={styles.boxText}>{"\n"}Sensor Charts{"\n"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.box4} onPress={() => navigation.navigate('AboutProject')}>
                        <Text style={styles.boxText}>{"\n"}About Project{"\n"}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                        <Text style={styles.signOutButtonText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3d3d3d',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 20,
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 35,
    },
    headerImg: {
        width: 60,
        height: 60,
        alignSelf: 'center',
        marginBottom: 5,
    },
    welcome: {
        alignItems: 'center',

    },
    welcomeText: {
        color: '#ffffff',
        fontSize: 20,
        marginBottom: 40,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 40,
    },
    box1: {
        width: '48%',
        backgroundColor: '#af905e',
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 10,
    },
    box2: {
        width: '48%',
        backgroundColor: '#af905e',
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 10,
    },
    box3: {
        width: '48%',
        backgroundColor: '#af905e',
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 10,
    },
    box4: {
        width: '48%',
        backgroundColor: '#af905e',
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 10,
    },
    boxText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: '600',
    },
    buttonContainer: {
        paddingBottom: 20,
    },
    signOutButton: {
        backgroundColor: '#af905e',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    signOutButtonText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: '600',
    },
});
