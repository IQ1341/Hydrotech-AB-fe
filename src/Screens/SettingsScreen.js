import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import ProfileModal from '../components/ProfileModal';
import AboutAppModal from '../components/AboutAppModal';
import FAQModal from '../components/FAQModal';

const SettingsScreen = ({ navigation }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAboutAppModal, setShowAboutAppModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [profileImage, setProfileImage] = useState(require('../assets/profile.jpg')); // Default local image
  const [profileName, setProfileName] = useState(''); // Default name
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem('username');
        if (savedUsername) {
          setProfileName(savedUsername);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    getProfileData();
  }, []);

  const handleImagePick = () => {
    const options = {
      mediaType: 'photo',
      quality: 1.0,
      noData: true,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          setProfileImage({ uri }); // Update profile image with URI
        }
      }
    });
  };

  const handleLogout = () => {
    setShowLogoutAlert(true); // Show AwesomeAlert
  };

  const confirmLogout = () => {
    // Perform logout logic here (e.g., clear AsyncStorage)
    navigation.replace('Login'); // Navigate back to login screen
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={typeof profileImage === 'string' ? { uri: profileImage } : profileImage}
            style={styles.profileImage}
          />
          <TouchableOpacity onPress={handleImagePick} style={styles.editIcon}>
            <Icon name="pencil" size={24} color="#00a5a5" />
          </TouchableOpacity>
          <Text style={styles.profileName}>{profileName}</Text>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.optionContainer} onPress={() => setShowProfileModal(true)}>
          <View style={styles.optionContent}>
            <View style={styles.iconBox}>
              <Icon name="person-circle-outline" size={24} color="#00a5a5" />
            </View>
            <Text style={styles.optionText}>Profil Saya</Text>
          </View>
          <Icon name="chevron-forward" size={24} color="#757575" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionContainer} onPress={() => setShowFAQModal(true)}>
          <View style={styles.optionContent}>
            <View style={styles.iconBox}>
              <Icon name="help-circle-outline" size={24} color="#00a5a5" />
            </View>
            <Text style={styles.optionText}>FAQ</Text>
          </View>
          <Icon name="chevron-forward" size={24} color="#757575" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionContainer} onPress={() => setShowAboutAppModal(true)}>
          <View style={styles.optionContent}>
            <View style={styles.iconBox}>
              <Icon name="information-circle-outline" size={24} color="#00a5a5" />
            </View>
            <Text style={styles.optionText}>Tentang Aplikasi</Text>
          </View>
          <Icon name="chevron-forward" size={24} color="#757575" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionContainer} onPress={handleLogout}>
          <View style={styles.optionContent}>
            <View style={styles.iconBox}>
              <Icon name="log-out-outline" size={24} color="#00a5a5" />
            </View>
            <Text style={styles.optionText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Profile Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showProfileModal}
        onRequestClose={() => setShowProfileModal(false)}
      >
        <ProfileModal
          profileImage={profileImage}
          profileName={profileName}
          onImageChange={setProfileImage}
          onNameChange={setProfileName}
          onClose={() => setShowProfileModal(false)}
        />
      </Modal>

      {/* About App Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showAboutAppModal}
        onRequestClose={() => setShowAboutAppModal(false)}
      >
        <AboutAppModal onClose={() => setShowAboutAppModal(false)} />
      </Modal>

      {/* FAQ Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showFAQModal}
        onRequestClose={() => setShowFAQModal(false)}
      >
        <FAQModal onClose={() => setShowFAQModal(false)} />
      </Modal>

      {/* Logout Alert */}
      <AwesomeAlert
        show={showLogoutAlert}
        showProgress={false}
        title="Logout"
        message="Are you sure you want to logout?"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Cancel"
        confirmText="Logout"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => setShowLogoutAlert(false)}
        onConfirmPressed={confirmLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#cee8ec',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  profileImageContainer: {
    width: 300,
    height: 240,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#00a5a5',
    marginTop: 20,
  },
  editIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#dcdada',
    borderRadius: 15,
    padding: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00a5a5',
    marginTop: 15,
  },
  menuContainer: {
    flex: 1,
  },
  optionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    backgroundColor: '#e0f7f9',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#00a5a5',
  },
});

export default SettingsScreen;
