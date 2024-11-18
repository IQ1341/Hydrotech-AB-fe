import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getNotifications, markNotificationAsRead, deleteNotification } from '../services/api';
import moment from 'moment'; // For formatting time

const NotificationsScreen = ({ navigation }) => {
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 500); // Refresh notifications every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await getNotifications();
            const sortedNotifications = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setNotifications(sortedNotifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleNotificationPress = async (id, notification) => {
        try {
            await markNotificationAsRead(id);
            setSelectedNotification(notification);
            setIsModalVisible(true);
            fetchNotifications(); // Refresh notifications after marking as read
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNotification(id);
            fetchNotifications(); // Refresh notifications after deletion
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const renderNotification = ({ item }) => (
        <View style={[styles.notificationCard, { backgroundColor: item.isRead ? '#e0e0e0' : '#ffffff' }]}>
            <TouchableOpacity
                onPress={() => handleNotificationPress(item._id, item)}
                style={styles.notificationContent}
            >
                <Icon 
                    name="bell" 
                    size={24} 
                    color={item.isRead ? '#cccccc' : '#226F54'} 
                    style={styles.notificationIcon} 
                />
                <View style={styles.notificationText}>
                    <Text style={styles.notificationTitle}>{item.title}</Text>
                    <Text style={styles.notificationDescription}>{item.message}</Text>
                    <Text style={styles.notificationTime}>{moment(item.timestamp).fromNow()}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => handleDelete(item._id)} 
                style={styles.deleteButton}
            >
                <Icon name="trash" size={18} color="#ff0000" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={20} color="#fff" style={styles.backButton} />
                </TouchableOpacity>
                <Text style={styles.header}>Notifications</Text>
            </View>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item._id}
                renderItem={renderNotification}
                contentContainerStyle={styles.flatListContent}
            />
            <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => setIsModalVisible(false)}
                onBackButtonPress={() => setIsModalVisible(false)}
                style={styles.modal}
            >
                <View style={styles.modalContent}>
                    {selectedNotification && (
                        <>
                            <Text style={styles.modalTitle}>{selectedNotification.title}</Text>
                            <Text style={styles.modalTime}>{moment(selectedNotification.timestamp).fromNow()}</Text>
                            <Text style={styles.modalMessage}>{selectedNotification.message}</Text>
                            <View style={styles.suggestionContainer}>
                                {getSuggestions(selectedNotification.message).map((suggestion, index) => (
                                    <Text key={index} style={styles.suggestionText}>
                                        {suggestion}
                                    </Text>
                                ))}
                            </View>
                        </>
                    )}
                    <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

// Function to provide detailed suggestions based on sensor data
const getSuggestions = (message) => {
    const suggestions = [];
    if (message.includes('Nilai EC')) {
        suggestions.push("⚠️ Nilai EC terlalu tinggi. Pertimbangkan untuk mengencerkan larutan nutrisi atau menyesuaikan konsentrasinya.");
    }
    if (message.includes('Nilai pH')) {
        suggestions.push("⚠️ Nilai pH berada di luar kisaran optimal. Periksa dan sesuaikan pH larutan.");
    }
    if (message.includes('Nilai DO')) {
        suggestions.push("⚠️ Tingkat oksigen terlarut rendah. Tingkatkan aerasi atau periksa pompa udara.");
    }
    if (message.includes('Nilai Temperature')) {
        suggestions.push("⚠️ Suhu berada di luar kisaran. Pastikan lingkungan sesuai dengan suhu yang direkomendasikan.");
    }
    
    return suggestions.length > 0 ? suggestions : ["Tidak ada saran yang tersedia"];
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#226F54',
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    backButton: {
        marginRight: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    flatListContent: {
        padding: 15,
    },
    notificationCard: {
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    notificationContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    notificationIcon: {
        marginRight: 15,
    },
    notificationText: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    notificationDescription: {
        fontSize: 14,
        color: '#666',
        marginVertical: 5,
    },
    notificationTime: {
        fontSize: 12,
        color: '#999',
    },
    deleteButton: {
        padding: 5,
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    modalTime: {
        fontSize: 14,
        color: '#999',
        marginBottom: 15,
    },
    modalMessage: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    suggestionContainer: {
        width: '100%',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 20,
    },
    suggestionText: {
        fontSize: 14,
        color: '#226F54',
        fontStyle: 'italic',
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: '#226F54',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default NotificationsScreen;
