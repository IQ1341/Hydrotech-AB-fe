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
  ImageBackground, 
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleSignUp = async () => {
    setLoading(true);
    setTimeout(async () => {
      if (password === confirmPassword) {
        Alert.alert('Sign Up Success', 'Welcome aboard!');
        navigation.replace('MainTabs'); 
      } else {
        Alert.alert('Password Mismatch', 'Passwords do not match.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.avoidingView}
      >
        <View style={styles.backgroundContainer}>
          <ImageBackground
            source={require('../assets/bg3.jpg')} // Path ke gambar setengah lingkaran
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            {/* Logo */}
          </ImageBackground>
        </View>
        {/* Logo */}
        <Image
          source={require('../assets/hydrotech.png')} // Update the path to your logo
          style={styles.logo}
        />
        <View style={styles.appNameContainer}>
          <Text style={styles.hydrotechText}>Hydrotech</Text>
          <Text style={styles.abText}>AB</Text>
        </View>
        {/* Username input */}
        <TextInput
          style={styles.input}
          placeholder="User Name"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        {/* Email input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Password input with eye icon */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Icon
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="#226F54"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password input with eye icon */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            placeholderTextColor="#aaa"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIcon}
          >
            <Icon
              name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="#226F54"
            />
          </TouchableOpacity>
        </View>

        {/* Sign Up button */}
        {loading ? (
          <ActivityIndicator size="large" color="#34a853" style={styles.loading} />
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={handleSignUp}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        )}

        {/* Login navigation */}
        <Text style={styles.footerText}>
          Already have an account? <Text style={styles.signInText} onPress={() => navigation.goBack()}>Log in</Text>
        </Text>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  avoidingView: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backgroundContainer: {
    width: 380,
    height: 210,
    overflow: 'hidden',
    borderBottomLeftRadius: 170,
    borderBottomRightRadius: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    marginTop: 30,
    },
  appNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:30
  },
  hydrotechText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#98C13F', // Color for "Hydrotech"
  },
  abText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#226F54', // Color for "AB"
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  input: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#226F54',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f7f7f7',
    fontSize: 16,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#226F54',
    borderRadius: 8,
    backgroundColor: '#f7f7f7',
    marginBottom: 10,
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#226F54',
    borderRadius: 25,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loading: {
    marginVertical: 20,
  },
  footerText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
  signInText: {
    color: '#226F54',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
