import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PushNotification from 'react-native-push-notification';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
    useEffect(() => {
        // Konfigurasi PushNotification
        PushNotification.configure({
            onNotification: function(notification) {
                console.log('NOTIFICATION:', notification);
            },
            // Request permissions on iOS
            requestPermissions: Platform.OS === 'ios',
        });

        PushNotification.createChannel(
            {
                channelId: 'default-channel-id', // ID unik
                channelName: 'Default Channel', // Nama untuk ditampilkan ke pengguna
                channelDescription: 'A default channel', // (Opsional) Deskripsi channel
                importance: 4, // (Opsional) Importance level
                vibrate: true, // (Opsional) Default: true
            },
            (created) => console.log(`createChannel returned '${created}'`)
        );

        // Mendapatkan notifikasi awal (jika ada)
        PushNotification.popInitialNotification((notification) => {
            if (notification) {
                console.log('Initial Notification:', notification);
                // Handle initial notification here if needed
            }
        });
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AppNavigator />
        </GestureHandlerRootView>
    );
};

export default App;
