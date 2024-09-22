// components/CalibrationModal.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';

const CalibrationModal = ({ onClose }) => {
    const [sensorValue, setSensorValue] = useState('');

    const handleCalibrate = () => {
        // Add your calibration logic here
        alert('Sensor calibrated!');
        onClose();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Kalibrasi Sensor</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Sensor Value"
                keyboardType="numeric"
                value={sensorValue}
                onChangeText={setSensorValue}
            />

            <View style={styles.buttonContainer}>
                <Button title="Kalibrasi" onPress={handleCalibrate} color="#00796b" />
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeText}>Tutup</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        alignItems: 'center',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 5,
        borderColor: '#00796b',
        borderWidth: 1,
        borderRadius: 5,
    },
    buttonContainer: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    closeButton: {
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeText: {
        color: '#00796b',
        fontSize: 16,
    },
});

export default CalibrationModal;
