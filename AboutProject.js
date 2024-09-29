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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import logo from './assets/img.png';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();


export default function Login() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  async function signIn() {
    if (form.email === '' || form.password === '') {
      setForm({
        ...form,
        error: 'Email and password are mandatory.'
      })
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigation.navigate('Welcome');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      setForm({
        ...form,
        error: error.message,
      })
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#3d3d3d' }}>
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
            <Text style={styles.subtitle}>
              Tyrents looking to leave a lasting treadmark
            </Text>
          </View>
          <View style={styles.text}>
            <Text style={styles.info}>
                Frequently having to change tyres due to wear and tear can be tyring, and that's where Two Tyred helps you out by providing real-time data visualization and alerts to indicate when sensor readings such as the tyre pressure and the tyre temperature show extreme values.
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    backgroundColor: '#3d3d3d',
    marginTop: 10,
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#eeeeee',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 35,
  },
  headerImg: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
  text: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#af905e',
    borderColor: '#af905e',
  },
  info: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#000000',
  },
});
