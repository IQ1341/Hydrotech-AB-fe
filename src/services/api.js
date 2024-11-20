import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.1.26:5000/api', // URL backend
});

// Sensor Data
export const getSensorData = () => api.get('/sensors');
export const addSensorData = (data) => api.post('/sensors', data);

// Notifications
export const getNotifications = () => api.get('/notifications');
export const markNotificationAsRead = (id) => api.patch(`/notifications/${id}/read`);
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);

// Thresholds
export const getThresholds = () => api.get('/thresholds'); // Mendapatkan thresholds
export const setAllThresholds = (thresholds) => api.post('/thresholds/set', thresholds); // Mengatur thresholds

export default api;
