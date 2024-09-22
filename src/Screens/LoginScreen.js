import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true); // Show loading indicator
    // Simulate login process
    setTimeout(async () => {
      if (email === 'admin' && password === '123456') {
        // Save login status and username to AsyncStorage
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('username', username);
        navigation.replace('MainTabs'); // Navigate to Dashboard after successful login
      } else {
        Alert.alert('Login Failed', 'Email or password is incorrect');
      }
      setLoading(false); // Hide loading indicator
    }, 1000); // Simulate network delay
  };

  return (
    <View style={styles.background}>
      <Image
        source={require('../assets/logo.png')} // Replace with Smartfren logo
        style={styles.logo}
      />
      <Text style={styles.title}>Login</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#009688"
          style={styles.loading}
        />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cee8ec', // Neutral background color
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#009688',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loading: {
    marginVertical: 20,
  },
});

export default LoginScreen;
