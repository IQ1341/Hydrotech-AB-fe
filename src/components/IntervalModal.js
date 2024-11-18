import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';

const IntervalModal = ({ onClose, onIntervalChange }) => {
  const [intervalValue, setIntervalValue] = useState('');

  const handleSetInterval = () => {
    const intervalInSeconds = parseInt(intervalValue, 10);
    if (isNaN(intervalInSeconds) || intervalInSeconds <= 0) {
      alert('Masukkan nilai interval yang valid (dalam detik).');
      return;
    }

    onIntervalChange(intervalInSeconds);
    alert(`Interval diatur ke ${intervalInSeconds} detik.`);
    onClose();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Atur Interval Pengambilan Data</Text>
      <TextInput
        style={styles.input}
        placeholder="Interval (dalam detik)"
        keyboardType="numeric"
        value={intervalValue}
        onChangeText={setIntervalValue}
      />
      <View style={styles.buttonContainer}>
        <Button title="Atur Interval" onPress={handleSetInterval} color="#00796b" />
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
    color: '#00796b', // Set the text color to green
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

export default IntervalModal;
