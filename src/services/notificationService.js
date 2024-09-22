// notificationService.js
import PushNotification from 'react-native-push-notification';

export const sendNotification = (title, message) => {
  PushNotification.localNotification({
    channelId: 'default-channel-id', // Pastikan channelId sesuai dengan yang didaftarkan
    title: title, // Title of the notification
    message: message, // Message of the notification
    playSound: true, // Play sound when the notification is shown
    soundName: 'default', // Default sound
    importance: 'high', // High importance
    vibrate: true, // Vibrate on notification
  });
  
};
