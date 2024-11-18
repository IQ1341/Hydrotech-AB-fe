import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {getSensorData, getThresholds, setAllThresholds} from '../services/api';
import {sendNotification} from '../services/notificationService';
import SensorChart from '../components/SensorChart';
import MqttClient from '../services/MqttClient';

const DashboardScreen = ({isDarkMode}) => {
  const [sensorData, setSensorData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [sensorChartData, setSensorChartData] = useState([]);
  
  const [thresholds, setThresholds] = useState({
    ec: {min: 0, max: 0},
    ph: {min: 0, max: 0},
    temperature: {min: 0, max: 0},
  });
  const [mqttSensorData, setMqttSensorData] = useState({
    ec: null,
    ph: null,
    temperature: null,
  });
  const [isMixing, setIsMixing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleToggleMixing = () => {
    setIsMixing(prev => !prev);
    MqttClient.publish('ABsensor/mixing', isMixing ? 'OFF' : 'ON');
  };

  

  const handleToggleConnection = () => {
    if (isConnected) {
      MqttClient.publish('ABsensor/connect', 'OFF');
      // MqttClient.disconnect(); // Disconnect MQTT
    } else {
      MqttClient.publish('ABsensor/connect', 'ON');
      // MqttClient.connect(); // Connect MQTT
    }
    setIsConnected(prev => !prev);
  };

  const handleMqttMessage = (topic, payload) => {
    const type = topic.split('/').pop();
    setMqttSensorData(prevData => ({
      ...prevData,
      [type]: parseFloat(payload),
    }));
  };

  useEffect(() => {
    MqttClient.onMessageReceived = handleMqttMessage; // Assign the handler only once
    MqttClient.connect();

    return () => {
      MqttClient.onMessageReceived = null;
      MqttClient.disconnect(); // Cleanup MQTT connection
    };
  }, []);

  useEffect(() => {
    fetchThresholds();
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchThresholds = async () => {
    try {
      const response = await getThresholds();
      const fetchedThresholds = response.data.reduce((acc, threshold) => {
        acc[threshold.type] = {min: threshold.min, max: threshold.max};
        return acc;
      }, {});
      setThresholds(fetchedThresholds);
    } catch (error) {
      console.error('Error fetching thresholds:', error);
    }
  };

const fetchData = async () => {
  setRefreshing(true);
  try {
    const response = await getSensorData();
    const filteredData = filterDataByRange(response.data); // Filter data berdasarkan rentang tanggal
    setSensorData(filteredData); // Simpan data mentah untuk ditampilkan di kartu
    setSensorChartData(filteredData); // Data mentah langsung untuk grafik
    checkThresholds(filteredData); // Cek data untuk melewati ambang batas
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setRefreshing(false);
  }
};


  const checkThresholds = data => {
    if (data.length > 0) {
      const latestData = data[data.length - 1];

      // Threshold check for EC
      if (
        latestData.ec < thresholds.ec.min ||
        latestData.ec > thresholds.ec.max
      ) {
        sendNotification(
          'Peringatan!',
          `Nilai EC berada di luar batas aman: ${latestData.ec} µS/cm`,
        );
      }

      // Threshold check for pH
      if (
        latestData.ph < thresholds.ph.min ||
        latestData.ph > thresholds.ph.max
      ) {
        sendNotification(
          'Peringatan!',
          `Nilai pH berada di luar batas aman: ${latestData.ph}`,
        );
      }

      // Threshold check for Temperature
      if (
        latestData.temperature < thresholds.temperature.min ||
        latestData.temperature > thresholds.temperature.max
      ) {
        sendNotification(
          'Peringatan!',
          `Suhu berada di luar batas aman: ${latestData.temperature} °C`,
        );
      }
    }
  };

  
  const filterDataByRange = data => {
    const now = new Date();
    return data.filter(item => {
      const timestamp = new Date(item.timestamp);
      return (
        timestamp.getDate() === now.getDate() &&
        timestamp.getMonth() === now.getMonth() &&
        timestamp.getFullYear() === now.getFullYear()
      );
    });
  };

  const getIconBoxColor = (value, type) => {
    const color = getIconColor(value, type);
    if (color === '#226F54') return 'rgba(152, 193, 63, 0.2)'; // Transparan hijau
    if (color === '#eadb02') return 'rgba(234, 219, 2, 0.2)'; // Transparan kuning
    if (color === '#b30000') return 'rgba(179, 0, 0, 0.2)'; // Transparan merah
    return 'rgba(0, 165, 165, 0.2)'; // Warna default transparan hijau
  };

  const getIconColor = (value, type) => {
    if (type === 'ec') {
      if (value >= thresholds.ec.min && value <= thresholds.ec.max)
        return '#226F54'; // Hijau
      if (
        (value >= thresholds.ec.min - 0.3 && value < thresholds.ec.min) ||
        (value > thresholds.ec.max && value <= thresholds.ec.max + 0.3)
      )
        return '#eadb02'; // Kuning
      return '#b30000'; // Merah
    } else if (type === 'ph') {
      if (value >= thresholds.ph.min && value <= thresholds.ph.max)
        return '#226F54'; // Hijau
      if (
        (value >= thresholds.ph.min - 0.5 && value < thresholds.ph.min) ||
        (value > thresholds.ph.max && value <= thresholds.ph.max + 0.5)
      )
        return '#eadb02'; // Kuning
      return '#b30000'; // Merah
    } else if (type === 'temperature') {
      if (
        value >= thresholds.temperature.min &&
        value <= thresholds.temperature.max
      )
        return '#226F54'; // Hijau
      if (
        (value >= thresholds.temperature.min - 2.0 &&
          value < thresholds.temperature.min) ||
        (value > thresholds.temperature.max &&
          value <= thresholds.temperature.max + 2.0)
      )
        return '#eadb02'; // Kuning
      return '#b30000'; // Merah
    }
    return '#226F54'; // Warna default jika tidak ada data atau tipe tidak dikenal
  };

  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundColor: '#ffffff', // Sesuaikan dengan warna latar belakang kartu
    backgroundGradientFrom: '#f7f7f7', // Latar belakang abu-abu muda
    backgroundGradientTo: '#ffffff', // Latar belakang putih
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(34, 111, 84, ${opacity})`, // Sesuaikan dengan warna teks kartu
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Sesuaikan dengan warna teks kartu
    style: {
      borderRadius: 16,
    },
    propsForHorizontalLabels: {
      color: '#444444', // Warna label sumbu X
      rotation: -35,
    },
    propsForVerticalLabels: {
      display: 'none', // Menghilangkan label vertikal
    },
  };

  return (
    <ScrollView
      style={[styles.container, isDarkMode && styles.darkContainer]}
      contentContainerStyle={styles.scrollContent}>
      <View style={styles.innerContainer}>
        <Text style={styles.monitTitle}>MONITORING ABMIX</Text>
        {/* Sensor Cards */}
        <View style={styles.cardContainer}>
          {/* EC Sensor Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>EC</Text>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: getIconBoxColor(mqttSensorData.ec, 'ec'),
                },
              ]}>
              <Icon2
                name="bolt"
                size={25}
                color={getIconColor(mqttSensorData.ec, 'ec')}
                style={styles.icon}
              />
            </View>
            <Text style={styles.cardValue}>
              {mqttSensorData.ec || '0'} µS/cm
            </Text>
          </View>

          {/* pH Sensor Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>pH</Text>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: getIconBoxColor(mqttSensorData.ph, 'ph'),
                },
              ]}>
              <Icon
                name="flask"
                size={25}
                color={getIconColor(mqttSensorData.ph, 'ph')}
                style={styles.icon}
              />
            </View>
            <Text style={styles.cardValue}>{mqttSensorData.ph || '0'} pH</Text>
          </View>

          {/* Temperature Sensor Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>TEMP</Text>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: getIconBoxColor(
                    mqttSensorData.temperature,
                    'temperature',
                  ),
                },
              ]}>
              <Icon
                name="thermometer-half"
                size={25}
                color={getIconColor(mqttSensorData.temperature, 'temperature')}
                style={styles.icon}
              />
            </View>
            <Text style={styles.cardValue}>
              {mqttSensorData.temperature || '0'} °C
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        {/* Tombol Mixing */}
        <TouchableOpacity
          style={[
            styles.connectedButton,
            isConnected ? styles.disconnected : styles.connected,
          ]}
          onPress={handleToggleConnection}>
          <View style={styles.buttonContent}>
            <Icon2
              name={isConnected ? 'power-off' : 'power'}
              size={20}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.connectedButtonText}>
              {isConnected ? 'Disconnect' : 'Connect'}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.mixingButton,
            isMixing ? styles.stopMixing : styles.startMixing,
          ]}
          onPress={handleToggleMixing}>
          <View style={styles.buttonContent}>
            <Icon2
              name={isMixing ? 'pause' : 'play-arrow'}
              size={20}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.mixingButtonText}>
              {isMixing ? 'Stop Mixing' : 'Start Mixing'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Tombol Connected */}
        
      </View>

      <View style={styles.chartContent}>
        <ScrollView horizontal={true} style={styles.graphScroll}>
          <SensorChart
            title="EC Sensor"
            data={sensorChartData.map(item => ({
              timestamp: item.timestamp,
              value: item.ec,
            }))}
            screenWidth={screenWidth}
            chartConfig={chartConfig}
          />

          <SensorChart
            title="pH Sensor"
            data={sensorChartData.map(item => ({
              timestamp: item.timestamp,
              value: item.ph,
            }))}
            screenWidth={screenWidth}
            chartConfig={chartConfig}
          />
          <SensorChart
            title="Temperature Sensor"
            data={sensorChartData.map(item => ({
              timestamp: item.timestamp,
              value: item.temperature,
            }))}
            screenWidth={screenWidth}
            chartConfig={chartConfig}
          />
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Atur menjadi transparan agar background innerContainer terlihat
    marginTop: 10, // Tambahkan margin ke atas
    padding: 20,
  },
  darkContainer: {
    backgroundColor: 'transparent', // Atur menjadi transparan untuk mode gelap
  },
  scrollContent: {
    flexGrow: 1,
  },
  innerContainer: {
    // flex: 1,
    height: 200,
    padding: 15,
    backgroundColor: '#226F54', // Warna latar belakang utama
    borderRadius: 20,
  },
  monitTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular', // Apply Poppins-Regular font
    fontWeight: 'bold',
    color: 'white', // Ubah warna menjadi putih
    textAlign: 'center',
  },
  chartContent: {
    height: 275,
    marginTop: 20,
    padding: 15,
    backgroundColor: '#226F54', // Warna latar belakang utama
    borderRadius: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 15,
    marginHorizontal: 5, // Memberikan jarak horizontal antar card
    borderRadius: 25,
    alignItems: 'center',
    maxWidth: '30%', // Batas maksimal lebar setiap card
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 10, // Jarak antara ikon dan teks
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Menyusun tombol secara horizontal
    marginTop: 20,
  },
  mixingButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1, // Agar tombol bisa mengisi ruang yang ada
     // Memberikan jarak antara tombol Mixing dan Connected
  },
  connectedButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1, // Agar tombol bisa mengisi ruang yang ada
    marginRight: 10,
  },
  startMixing: {
    backgroundColor: '#226F54',
  },
  stopMixing: {
    backgroundColor: '#b30000',
  },
  connected: {
    backgroundColor: '#226F54',
  },
  disconnected: {
    backgroundColor: '#b30000',
  },
  mixingButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  connectedButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 10,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9e0e0',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular', // Apply Poppins-Regular font
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#226F54',
  },
  darkText: {
    color: '#ffffff',
  },
  cardValue: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular', // Apply Poppins-Regular font
    fontWeight: 'bold',
    color: '#444444',
  },
  graphScroll: {
    marginBottom: 10,
  },
});

export default DashboardScreen;
