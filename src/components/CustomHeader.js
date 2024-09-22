import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getNotifications } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomHeader = ({ navigation }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [badgeScale] = useState(new Animated.Value(1));
  const [username, setUsername] = useState('');
  const [animatedText, setAnimatedText] = useState([]);
  const animatedValues = [];

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();

    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        const unreadNotifications = response.data.filter(
          (notification) => !notification.isRead
        ).length;
        setUnreadCount(unreadNotifications);

        if (unreadNotifications > 0) {
          Animated.sequence([
            Animated.timing(badgeScale, {
              toValue: 1.2,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(badgeScale, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, [badgeScale]);

  // Animasi teks muncul satu per satu
  useEffect(() => {
    const text = 'Selamat datang di Hydrotech_AB';
    const animatedTextArray = text.split('').map(() => new Animated.Value(0));
    setAnimatedText(animatedTextArray);

    animatedTextArray.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 100,
        delay: index * 50,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handleBellPress = () => {
    navigation.navigate('Notifications');
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.userContainer}>
        <Icon name="user" size={20} color="#333" style={styles.userIcon} />
        <View>
          <Text style={styles.greetingText}>Hello, {username || 'User'}</Text>
          
        </View>
        
      </View>
      <TouchableOpacity onPress={handleBellPress} style={styles.bellButton}>
        <View style={styles.bellContainer}>
          <Icon name="bell" size={20} color="#333" />
          {unreadCount > 0 && (
            <Animated.View style={[styles.badgeContainer, { transform: [{ scale: badgeScale }] }]}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 5,

  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    marginRight: 8,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  welcomeTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  bellButton: {
    padding: 5,
  },
  bellContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff0000',
    borderRadius: 12,
    padding: 3,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CustomHeader;
