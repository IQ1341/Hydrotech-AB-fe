import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import icon library
import AwesomeAlert from 'react-native-awesome-alerts';  // Import AwesomeAlert
import { addSensorData } from '../services/api'; // Ensure the path is correct

const AddDataModal = ({ onClose }) => {
    const [ec, setEc] = useState('');
    const [ph, setPh] = useState('');
    const [doValue, setDoValue] = useState('');
    const [temperature, setTemperature] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false); // State for Success Alert
    const [showErrorAlert, setShowErrorAlert] = useState(false); // State for Error Alert

    const handleSaveAll = async () => {
        try {
            const sensorData = {
                ec: parseFloat(ec),
                ph: parseFloat(ph),
                do: parseFloat(doValue),
                temperature: parseFloat(temperature),
                timestamp: date.toISOString(),
            };

            // Send data to the server
            await addSensorData(sensorData);

            setShowSuccessAlert(true);  // Show success alert
        } catch (error) {
            setShowErrorAlert(true);  // Show error alert
        }
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(new Date(currentDate));
        setShowDatePicker(false);
        setShowTimePicker(true);
    };

    const onChangeTime = (event, selectedTime) => {
        if (selectedTime) {
            const newDate = new Date(date);
            newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
            setDate(newDate);
        }
        setShowTimePicker(false);
    };

    const formatDate = (date) => {
        if (!date) return 'DD/MM/YYYY HH:MM';
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Tambah Data</Text>
            
            <TextInput
                style={styles.input}
                placeholder="EC"
                value={ec}
                onChangeText={setEc}
                keyboardType="numeric"
                placeholderTextColor="#aaa"
            />
            <TextInput
                style={styles.input}
                placeholder="pH"
                value={ph}
                onChangeText={setPh}
                keyboardType="numeric"
                placeholderTextColor="#aaa"
            />
            <TextInput
                style={styles.input}
                placeholder="DO"
                value={doValue}
                onChangeText={setDoValue}
                keyboardType="numeric"
                placeholderTextColor="#aaa"
            />
            <TextInput
                style={styles.input}
                placeholder="Temperature"
                value={temperature}
                onChangeText={setTemperature}
                keyboardType="numeric"
                placeholderTextColor="#aaa"
            />

            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                <Icon name="calendar" size={20} color="#00796b" style={styles.icon} />
                <Text style={styles.dateButtonText}>{formatDate(date)}</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                />
            )}

            {showTimePicker && (
                <DateTimePicker
                    testID="timePicker"
                    value={date}
                    mode="time"
                    display="default"
                    onChange={onChangeTime}
                />
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Icon name="times" size={20} color="#ffffff" style={styles.icon} />
                    <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveAll} style={styles.saveButton}>
                    <Icon name="save" size={20} color="#ffffff" style={styles.icon} />
                    <Text style={styles.saveButtonText}>Add</Text>
                </TouchableOpacity>
            </View>

            {/* Success Alert */}
            <AwesomeAlert
                show={showSuccessAlert}
                showProgress={false}
                title="Success"
                message="Semua Data Berhasil Di Simpan"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor="#009382"
                onConfirmPressed={() => {
                    setShowSuccessAlert(false);
                    onClose();
                }}
            />

            {/* Error Alert */}
            <AwesomeAlert
                show={showErrorAlert}
                showProgress={false}
                title="Error"
                message="Failed to save data"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="Try Again"
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
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 5,
        borderColor: '#009382',
        borderWidth: 1,
        borderRadius: 15,
        color:'#000',
        backgroundColor: '#f1f8f6',
    },
    dateButton: {
        width: '100%',
        padding: 10,
        marginVertical: 5,
        borderColor: '#00796b',
        borderWidth: 1,
        borderRadius: 15,
        backgroundColor: '#f1f8f6',
        alignItems: 'center',
        flexDirection: 'row',
    },
    dateButtonText: {
        color: '#000',
        fontSize: 16,
        marginLeft: 10,
        alignItems: 'center',
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
        borderRadius: 15,
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
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    closeText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    icon: {
        marginRight: 10,
    },
});

export default AddDataModal;

