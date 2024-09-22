import React from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';

const GeneralSettingsModal = ({ onClose }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>General Settings</Text>
            <TextInput 
                placeholder="Enter new setting"
                style={styles.input}
            />
            <View style={styles.buttonContainer}>
                <Button title="Save" onPress={() => alert('Settings saved')} color="#049988" />
                <Button title="Cancel" onPress={onClose} color="#d32f2f" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#004d40',
        marginBottom: 20,
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 15,
        padding: 10,
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        fontSize: 16,
        color: '#000000',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
});

export default GeneralSettingsModal;
