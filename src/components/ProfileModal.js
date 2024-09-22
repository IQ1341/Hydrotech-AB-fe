import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import AwesomeAlert from 'react-native-awesome-alerts';

const ProfileModal = ({ profileImage, profileName, onImageChange, onNameChange, onClose }) => {
    const [name, setName] = useState(profileName);
    const [email, setEmail] = useState('user@example.com');
    const [phoneNumber, setPhoneNumber] = useState('+6281234567890');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    const handleImagePick = () => {
        const options = {
            mediaType: 'photo',
            quality: 1.0,
        };

        launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const uri = response.assets[0].uri;
                if (uri) {
                    onImageChange({ uri });
                }
            }
        });
    };

    const handleSaveChanges = () => {
        onNameChange(name);
        setAlertTitle('Perubahan Disimpan');
        setAlertMessage(`Nama: ${name}\nEmail: ${email}\nNomor Telepon: ${phoneNumber}`);
        setAlertVisible(true);
    };

    const handleChangePassword = () => {
        setAlertTitle('Ganti Kata Sandi');
        setAlertMessage('Fungsi untuk mengganti kata sandi belum diimplementasikan.');
        setAlertVisible(true);
    };

    return (
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Icon name="close" size={24} color="#00a5a5" />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleImagePick}>
                    <Image 
                        source={profileImage} 
                        style={styles.profileImage} 
                    />
                </TouchableOpacity>
                <Text style={styles.profileName}>{name}</Text>

                <TextInput 
                    style={styles.input} 
                    placeholder="Nama Lengkap" 
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput 
                    style={styles.input} 
                    placeholder="Email" 
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput 
                    style={styles.input} 
                    placeholder="Nomor Telepon" 
                    placeholderTextColor="#999"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />

                <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}>
                    <Text style={styles.changePasswordButtonText}>Ganti Kata Sandi</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                    <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
                </TouchableOpacity>
            </View>

            <AwesomeAlert
                show={alertVisible}
                title={alertTitle}
                message={alertMessage}
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor="#00a5a5"
                onConfirmPressed={() => {
                    setAlertVisible(false);
                    if (alertTitle === 'Perubahan Disimpan') {
                        onClose();
                    }
                }}
                titleStyle={styles.alertTitle}
                messageStyle={styles.alertMessage}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 320,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#00a5a5',
        marginBottom: 10,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00a5a5',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#dcdcdc',
        borderRadius: 10,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        color: '#333',
    },
    changePasswordButton: {
        marginBottom: 15,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#00a5a5',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        alignItems: 'center',
    },
    changePasswordButtonText: {
        color: '#00a5a5',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#00a5a5',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    alertTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00a5a5',
    },
    alertMessage: {
        fontSize: 16,
        color: '#333',
    },
});

export default ProfileModal;
