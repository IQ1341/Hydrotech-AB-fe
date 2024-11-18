import React, {useState} from 'react';
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

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setTimeout(async () => {
      if (username === 'hg' && password === '123') {
        navigation.replace('MainTabs');
      } else {
        Alert.alert('Login Failed', 'Username or password is incorrect');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.avoidingView}>
        {/* Background image with curved bottom */}
        <View style={styles.backgroundContainer}>
          <ImageBackground
            source={require('../assets/bg3.jpg')} // Path ke gambar setengah lingkaran
            style={styles.backgroundImage}
            resizeMode="cover">
            {/* Logo */}
          </ImageBackground>
        </View>

        {/* Logo and App Name */}
        <Image
          source={require('../assets/hydrotech.png')} // Update the path to your logo
          style={styles.logo}
        />
        <View style={styles.appNameContainer}>
          <Text style={styles.hydrotechText}>Hydrotech</Text>
          <Text style={styles.abText}>AB</Text>
        </View>
        <Text style={styles.subtitle}>Log in to your account</Text>

        {/* Username input */}
        <TextInput
          style={styles.input}
          placeholder="User Name"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
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
            style={styles.eyeIcon}>
            <Icon
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="#226F54"
            />
          </TouchableOpacity>
        </View>

        {/* Forget Password text */}
        <Text style={styles.forgetPassword}>Forget Password?</Text>

        {/* Login button */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#34a853"
            style={styles.loading}
          />
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
        )}

        {/* Sign Up text */}
        <Text style={styles.footerText}>
          Don't have an account?
          <Text
            style={styles.signUpText}
            onPress={() => navigation.navigate('SignUp')} // Navigate to SignUpScreen
          >
            Sign up
          </Text>
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
    height: 270,
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
  },
  hydrotechText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#98C13F', // Color for "Hydrotech"
    fontFamily: 'Poppins-Regular', // Apply Poppins-Regular font
  },
  abText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#226F54', // Color for "AB"
    fontFamily: 'Poppins-Regular', // Apply Poppins-Regular font
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    alignSelf: 'flex-start',
    marginTop: 30,
    marginBottom: 5,
    fontFamily: 'Poppins-Regular', // Apply Poppins-Regular font
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
    fontFamily: 'Poppins-Regular', // Apply Poppins-Regular font
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
    fontFamily: 'Poppins-Regular', // Apply Poppins-Regular font
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  forgetPassword: {
    color: '#226F54',
    alignSelf: 'flex-end',
    marginBottom: 20,
    fontSize: 14,
    fontFamily: 'Poppins-Regular', // Apply Poppins-Regular font
  },
  button: {
    backgroundColor: '#226F54',
    borderRadius: 25,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular', // Apply Poppins-Regular font
  },
  loading: {
    marginVertical: 20,
  },
  footerText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    fontFamily: 'Poppins-Regular', // Apply Poppins-Regular font
  },
  signUpText: {
    color: '#226F54',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular', // Apply Poppins-Regular font
  },
});


export default LoginScreen;
