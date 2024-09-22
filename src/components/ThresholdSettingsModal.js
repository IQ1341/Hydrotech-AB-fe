import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AwesomeAlert from 'react-native-awesome-alerts';
import { setAllThresholds } from '../services/api'; // Import the API function

const ThresholdSettingsModal = ({ onClose }) => {
    const [ecMin, setEcMin] = useState('');
    const [ecMax, setEcMax] = useState('');
    const [phMin, setPhMin] = useState('');
    const [phMax, setPhMax] = useState('');
    const [doMin, setDoMin] = useState('');
    const [doMax, setDoMax] = useState('');
    const [temperatureMin, setTemperatureMin] = useState('');
    const [temperatureMax, setTemperatureMax] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const handleSaveThresholds = async () => {
        try {
            const ecMinVal = parseFloat(ecMin);
            const ecMaxVal = parseFloat(ecMax);
            const phMinVal = parseFloat(phMin);
            const phMaxVal = parseFloat(phMax);
            const doMinVal = parseFloat(doMin);
            const doMaxVal = parseFloat(doMax);
            const temperatureMinVal = parseFloat(temperatureMin);
            const temperatureMaxVal = parseFloat(temperatureMax);

            // Validate input
            if (isNaN(ecMinVal) || isNaN(ecMaxVal) || isNaN(phMinVal) || isNaN(phMaxVal) ||
                isNaN(doMinVal) || isNaN(doMaxVal) || isNaN(temperatureMinVal) || isNaN(temperatureMaxVal)) {
                setShowErrorAlert(true);
                return;
            }

            if (ecMinVal >= ecMaxVal || phMinVal >= phMaxVal || doMinVal >= doMaxVal || temperatureMinVal >= temperatureMaxVal) {
                setShowErrorAlert(true);
                return;
            }

            const thresholds = {
                ec: { min: ecMinVal, max: ecMaxVal },
                ph: { min: phMinVal, max: phMaxVal },
                do: { min: doMinVal, max: doMaxVal },
                temperature: { min: temperatureMinVal, max: temperatureMaxVal },
            };

            // Save thresholds to backend
            const response = await setAllThresholds(thresholds);

            if (response.status === 200) {
                setShowSuccessAlert(true);
            } else {
                setShowErrorAlert(true);
            }
        } catch (error) {
            console.error('Error saving thresholds:', error);
            setShowErrorAlert(true);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Set Sensor Thresholds</Text>

            {/* Input for EC Threshold */}
            <Text style={styles.label}>EC Thresholds</Text>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Min"
                    value={ecMin}
                    onChangeText={setEcMin}
                    keyboardType="numeric"
                    placeholderTextColor="#aaa"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Max"
                    value={ecMax}
                    onChangeText={setEcMax}
                    keyboardType="numeric"
                    placeholderTextColor="#aaa"
                />
            </View>

            {/* Input for pH Threshold */}
            <Text style={styles.label}>pH Thresholds</Text>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Min"
                    value={phMin}
                    onChangeText={setPhMin}
                    keyboardType="numeric"
                    placeholderTextColor="#aaa"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Max"
                    value={phMax}
                    onChangeText={setPhMax}
                    keyboardType="numeric"
                    placeholderTextColor="#aaa"
                />
            </View>

            {/* Input for DO Threshold */}
            <Text style={styles.label}>DO Thresholds</Text>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Min"
                    value={doMin}
                    onChangeText={setDoMin}
                    keyboardType="numeric"
                    placeholderTextColor="#aaa"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Max"
                    value={doMax}
                    onChangeText={setDoMax}
                    keyboardType="numeric"
                    placeholderTextColor="#aaa"
                />
            </View>

            {/* Input for Temperature Threshold */}
            <Text style={styles.label}>Temperature Thresholds</Text>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Min"
                    value={temperatureMin}
                    onChangeText={setTemperatureMin}
                    keyboardType="numeric"
                    placeholderTextColor="#aaa"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Max"
                    value={temperatureMax}
                    onChangeText={setTemperatureMax}
                    keyboardType="numeric"
                    placeholderTextColor="#aaa"
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Icon name="times" size={20} color="#ffffff" style={styles.icon} />
                    <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveThresholds} style={styles.saveButton}>
                    <Icon name="save" size={20} color="#ffffff" style={styles.icon} />
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>

            {/* Success Alert */}
            <AwesomeAlert
                show={showSuccessAlert}
                showProgress={false}
                title="Success"
                message="Threshold berhasil di simpan"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor="#009382"
                onConfirmPressed={() => {
                    setShowSuccessAlert(false);
                    onClose(); // Close the modal after saving
                }}
            />

            {/* Error Alert */}
            <AwesomeAlert
                show={showErrorAlert}
                showProgress={false}
                title="Error"
                message="Masukkan nilai numerik yang valid untuk semua ambang batas atau pastikan nilai minimum kurang dari nilai maksimum."
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor="#b71c1c"
                onConfirmPressed={() => {
                    setShowErrorAlert(false);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 30,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        alignItems: 'center',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#00796b',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#009382',
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
    },
    input: {
        width: '48%',
        padding: 10,
        borderColor: '#009382',
        borderWidth: 1,
        borderRadius: 15,
        color: '#000',
        backgroundColor: '#f1f8f6',
    },
    buttonContainer: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    saveButton: {
        backgroundColor: '#009382',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#b71c1c',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    closeText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    icon: {
        marginRight: 5,
    },
});

export default ThresholdSettingsModal;
