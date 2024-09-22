import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AddDataModal from '../components/AddDataModal';
import ThresholdSettingsModal from '../components/ThresholdSettingsModal';
import CalibrationModal from '../components/CalibrationModal';
import { getThresholds } from '../services/api'; // Adjust the import path as needed

const FeatureScreen = () => {
    const [showAddData, setShowAddData] = useState(false);
    const [showThresholdSettings, setShowThresholdSettings] = useState(false);
    const [showCalibration, setShowCalibration] = useState(false);
    const [thresholds, setThresholds] = useState(null);

    const fetchThresholds = async () => {
        try {
            const response = await getThresholds();
            // Mengubah array data menjadi objek dengan `type` sebagai kunci
            const thresholdsObject = response.data.reduce((acc, curr) => {
                acc[curr.type] = { min: curr.min, max: curr.max };
                return acc;
            }, {});
            setThresholds(thresholdsObject);
        } catch (error) {
            Alert.alert('Error', 'Failed to load thresholds from the database');
        }
    };
    
    useEffect(() => {
        fetchThresholds();
    }, []);

    const handleThresholdsUpdate = async () => {
        await fetchThresholds(); // Refresh thresholds after closing the modal
    };

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => setShowAddData(true)}
                >
                    <View style={styles.iconContainer}>
                        <Icon name="add" size={24} color="#00a5a5" />
                    </View>
                    <Text style={styles.optionText}>Tambah Data</Text>
                    <Icon name="chevron-right" size={24} color="#00a5a5" style={styles.arrowIcon} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.option}
                    onPress={() => setShowThresholdSettings(true)}
                >
                    <View style={styles.iconContainer}>
                        <Icon name="tune" size={24} color="#00a5a5" />
                    </View>
                    <Text style={styles.optionText}>Custom Threshold</Text>
                    <Icon name="chevron-right" size={24} color="#00a5a5" style={styles.arrowIcon} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.option}
                    onPress={() => setShowCalibration(true)}
                >
                    <View style={styles.iconContainer}>
                        <Icon name="settings" size={24} color="#00a5a5" />
                    </View>
                    <Text style={styles.optionText}>Fitur Lain</Text>
                    <Icon name="chevron-right" size={24} color="#00a5a5" style={styles.arrowIcon} />
                </TouchableOpacity>

                {/* Modal for Add Data */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showAddData}
                    onRequestClose={() => setShowAddData(false)}
                >
                    <View style={styles.modalBackground}>
                        <AddDataModal onClose={() => setShowAddData(false)} />
                    </View>
                </Modal>

                {/* Modal for Threshold Settings */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showThresholdSettings}
                    onRequestClose={() => setShowThresholdSettings(false)}
                >
                    <View style={styles.modalBackground}>
                        <ThresholdSettingsModal
                            onClose={() => {
                                setShowThresholdSettings(false);
                                handleThresholdsUpdate(); // Refresh thresholds after closing
                            }}
                        />
                    </View>
                </Modal>

                {/* Modal for Calibration */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showCalibration}
                    onRequestClose={() => setShowCalibration(false)}
                >
                    <View style={styles.modalBackground}>
                        <CalibrationModal onClose={() => setShowCalibration(false)} />
                    </View>
                </Modal>
            </View>

            {/* Display thresholds */}
            {thresholds ? (
                <View style={styles.thresholdContainer}>
                    <Text style={styles.thresholdTitle}>Current Thresholds:</Text>
                    <View style={styles.thresholdItem}>
                        <Icon name="speed" size={24} color="#00a5a5" style={styles.thresholdIcon} />
                        <Text style={styles.thresholdText}>
                            EC: {thresholds.ec ? `${thresholds.ec.min} - ${thresholds.ec.max}` : 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.thresholdItem}>
                        <Icon name="spa" size={24} color="#00a5a5" style={styles.thresholdIcon} />
                        <Text style={styles.thresholdText}>
                            pH: {thresholds.ph ? `${thresholds.ph.min} - ${thresholds.ph.max}` : 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.thresholdItem}>
                        <Icon name="filter-alt" size={24} color="#00a5a5" style={styles.thresholdIcon} />
                        <Text style={styles.thresholdText}>
                            DO: {thresholds.do ? `${thresholds.do.min} - ${thresholds.do.max}` : 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.thresholdItem}>
                        <Icon name="thermostat" size={24} color="#00a5a5" style={styles.thresholdIcon} />
                        <Text style={styles.thresholdText}>
                            Temperature: {thresholds.temperature ? `${thresholds.temperature.min} - ${thresholds.temperature.max}` : 'N/A'}
                        </Text>
                    </View>
                </View>
            ) : (
                <Text style={styles.loadingText}>Loading thresholds...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#cee8ec',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
    },
    innerContainer: {
        flex: 1,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        marginVertical: 10,
        elevation: 3,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#dcdcdc',
    },
    optionText: {
        fontSize: 18,
        color: '#00a5a5',
        marginLeft: 10,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#e0f7f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    arrowIcon: {
        marginLeft: 10,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: '100%',
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        elevation: 5,
        alignItems: 'center',
    },
    thresholdContainer: {
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginTop: 20,
        elevation: 3,
    },
    thresholdTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00a5a5',
        marginBottom: 10,
    },
    thresholdItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#dcdcdc',
    },
    thresholdIcon: {
        marginRight: 10,
    },
    thresholdText: {
        fontSize: 16,
        color: '#333',
    },
    loadingText: {
        fontSize: 18,
        color: '#00a5a5',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default FeatureScreen;
