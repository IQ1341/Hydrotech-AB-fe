import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomHeader from '../components/CustomHeader';
import CustomHeader2 from '../components/CustomHeader2';
// import CustomHeader3 from '../components/CustomHeader3'

// Import screen components
import DashboardScreen from '../Screens/DashboardScreen';
import AddDataScreen from '../Screens/FeatureScreen';
import HistoryScreen from '../Screens/HistoryScreen';
import SettingsScreen from '../Screens/SettingsScreen';
import NotificationsScreen from '../Screens/NotificationsScreen';
import LoginScreen from '../Screens/LoginScreen'; // Import LoginScreen
import SignUpScreen from '../Screens/SignUpScreen';

// Create a bottom tab navigator instance
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Dashboard':
            iconName = 'home';
            break;
          case 'Add Data':
            iconName = 'plus';
            break;
          case 'Data Report':
            iconName = 'history';
            break;
          case 'Settings':
            iconName = 'cogs';
            break;
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#226F54',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        backgroundColor: '#f8f9fa',
        height: 65,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        // Optional: to apply shadow for better visibility of radius effect
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // This will add shadow on Android
      },
      tabBarLabelStyle: {
        fontSize: 12,
        marginBottom: 5,
      },
    })}
  >
    <Tab.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{
        header: ({ navigation }) => <CustomHeader navigation={navigation} />,
      }}
    />
    <Tab.Screen
      name="Add Data"
      component={AddDataScreen}
      options={{
        header: ({ navigation }) => <CustomHeader2 navigation={navigation} />,
      }}
    />
    <Tab.Screen
      name="Data Report"
      component={HistoryScreen}
      options={{
        header: ({ navigation }) => <CustomHeader2 navigation={navigation} />,
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        header: ({ navigation }) => <CustomHeader2 navigation={navigation} />,
      }}
    />
  </Tab.Navigator>
);


const AppNavigator = () => (
  <View style={styles.container}>
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#949494', // Set the global background color here
  },
});

export default AppNavigator;
