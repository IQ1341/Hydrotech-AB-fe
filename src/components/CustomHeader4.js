import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

const CustomHeader2 = ({ navigation }) => {
  const handleBackPress = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <View style={styles.backButtonInner}>
          <Icon name="arrow-left" size={20} color="#333" />
        </View>
      </TouchableOpacity>
      <View style={styles.userContainer}>
        <Icon name="gear" size={20} color="#333" style={styles.userIcon} />
        <Text style={styles.greetingText}>Settings</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
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

export default CustomHeader2;
