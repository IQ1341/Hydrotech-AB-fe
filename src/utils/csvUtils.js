import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const saveAsCSV = async (data, fileName) => {
    let csv = 'Time,EC (µS/cm),pH,DO (mg/L),Temperature (°C)\n';
    data.forEach(item => {
        csv += `${new Date(item.timestamp).toLocaleTimeString()},${item.ec},${item.ph},${item.do},${item.temperature}\n`;
    });

    const fileUri = FileSystem.documentDirectory + fileName;
    await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });

    await Sharing.shareAsync(fileUri);
};
