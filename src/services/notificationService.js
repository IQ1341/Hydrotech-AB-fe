import PushNotification from 'react-native-push-notification';

export const sendNotification = (title, message) => {
  PushNotification.localNotification({
    channelId: "default-channel", // Ensure a channel is configured in your app
    title: title,
    message: message,
    playSound: true,
    soundName: 'default',
  });
};
