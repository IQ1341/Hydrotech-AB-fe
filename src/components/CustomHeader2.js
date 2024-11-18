import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getNotifications} from '../services/api';

const CustomHeader = ({navigation}) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [badgeScale] = useState(new Animated.Value(1));
  const handleBackPress = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        const unreadNotifications = response.data.filter(
          notification => !notification.isRead,
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


  const handleBellPress = () => {
    navigation.navigate('Notifications');
  };
  

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <View style={styles.backButtonInner}>
          <Icon name="arrow-left" size={20} color="#435B71" />
        </View>
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/hydrotech.png')} // Path ke file PNG Anda
          style={styles.logoImage}
        />
        <View style={styles.logoTextContainer}>
          <Text style={styles.logoTextPrimary}>Hydrotech</Text>
          <Text style={styles.logoTextSecondary}>AB</Text>
        </View>
      </View>

      <TouchableOpacity onPress={handleBellPress} style={styles.iconButton}>
        <View style={styles.bellContainer}>
          <Icon name="bell" size={24} color="#435B71" />
          {unreadCount > 0 && (
            <Animated.View
              style={[
                styles.badgeContainer,
                {transform: [{scale: badgeScale}]},
              ]}>
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
  iconButton: {
    padding: 5,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 42, // Atur ukuran sesuai kebutuhan
    height: 42,
    resizeMode: 'contain',
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTextPrimary: {
    fontFamily:'Poppins-Regular',
    fontSize: 18,
    color: '#98C13F',
    fontWeight: 'bold',
  },
  logoTextSecondary: {
    fontFamily:'Poppins-Regular',
    fontSize: 18,
    color: '#226F54',
    fontWeight: 'bold',
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
  backButton: {
    padding: 5,
  },
  backButtonInner: {
    width: 36,
    height: 36,
    borderRadius:18,
    backgroundColor: '#e0e0e0', // Background color for the button
    justifyContent: 'center',
    alignItems: 'center',
   
  },
});

export default CustomHeader;
