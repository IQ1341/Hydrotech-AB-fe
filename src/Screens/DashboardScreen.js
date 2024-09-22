import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {getSensorData, getThresholds, setAllThresholds} from '../services/api'; // Update import API
import {sendNotification} from '../services/notificationService';
import SensorChart from '../components/SensorChart'; // Import komponen SensorChart

const DashboardScreen = ({isDarkMode}) => {
  const [sensorData, setSensorData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [sensorChartData, setSensorChartData] = useState([]);
  const [thresholds, setThresholds] = useState({
    ec: {min: 0, max: 0},
    ph: {min: 0, max: 0},
    do: {min: 0, max: 0},
    temperature: {min: 0, max: 0},
  });

  useEffect(() => {
    fetchThresholds(); // Fetch thresholds when component mounts
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll setiap 5 detik
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
      const filteredData = filterDataByRange(response.data); // Tetap gunakan filter harian
      const averageData = calculateAveragePerFiveMinutes(filteredData); // Hitung rata-rata per 5 menit
      setSensorData(filteredData); // Data mentah untuk card sensor (realtime)
      setSensorChartData(averageData); // Data yang dirata-ratakan untuk chart
      checkThresholds(filteredData); // Cek threshold berdasarkan data mentah
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setRefreshing(false);
    }
  };
  


  const checkThresholds = data => {
    if (data.length > 0) {
      const latestData = data[data.length - 1];

      // Threshold check untuk EC
      if (
        latestData.ec < thresholds.ec.min ||
        latestData.ec > thresholds.ec.max
      ) {
        sendNotification(
          'Peringatan!',
          `Nilai EC berada di luar batas aman: ${latestData.ec} µS/cm`,
        );
      }

      // Threshold check untuk pH
      if (
        latestData.ph < thresholds.ph.min ||
        latestData.ph > thresholds.ph.max
      ) {
        sendNotification(
          'Peringatan!',
          `Nilai pH berada di luar batas aman: ${latestData.ph}`,
        );
      }

      // Threshold check untuk DO
      if (
        latestData.do < thresholds.do.min ||
        latestData.do > thresholds.do.max
      ) {
        sendNotification(
          'Peringatan!',
          `Nilai DO berada di luar batas aman: ${latestData.do} mg/L`,
        );
      }

      // Threshold check untuk Temperature
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

  const calculateAveragePerFiveMinutes = (data) => {
    if (!data.length) return [];
  
    let result = [];
    let startTime = new Date(data[0].timestamp).getTime();
    const endTime = new Date().getTime();
    const interval = 5 * 60 * 1000; // Interval 5 menit
  
    while (startTime <= endTime) {
      const currentTime = startTime + interval;
  
      // Ambil data dalam interval waktu saat ini
      const currentBatch = data.filter(item => {
        const itemTime = new Date(item.timestamp).getTime();
        return itemTime >= startTime && itemTime < currentTime;
      });
  
      // Hitung rata-rata untuk batch saat ini
      const average = calculateAverage(currentBatch);
      result.push({
        ...average,
        timestamp: new Date(startTime).toISOString(), // Tetapkan waktu titik data tetap
      });
  
      // Set waktu awal batch berikutnya
      startTime = currentTime;
    }
  
    return result;
  };
  
  

  
  const calculateAverage = (batch) => {
    if (batch.length === 0) {
      return {
        timestamp: new Date().toISOString(),
        ec: 0,
        ph: 0,
        do: 0,
        temperature: 0,
      };
    }
  
    const average = {
      timestamp: batch[Math.floor(batch.length / 2)].timestamp,
      ec: batch.reduce((sum, item) => sum + item.ec, 0) / batch.length,
      ph: batch.reduce((sum, item) => sum + item.ph, 0) / batch.length,
      do: batch.reduce((sum, item) => sum + item.do, 0) / batch.length,
      temperature: batch.reduce((sum, item) => sum + item.temperature, 0) / batch.length,
    };
    return average;
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
    if (color === '#00a5a5') return 'rgba(0, 165, 165, 0.2)'; // Transparan hijau
    if (color === '#eadb02') return 'rgba(234, 219, 2, 0.2)'; // Transparan kuning
    if (color === '#b30000') return 'rgba(179, 0, 0, 0.2)'; // Transparan merah
    return 'rgba(0, 165, 165, 0.2)'; // Warna default transparan hijau
  };
  

  const getIconColor = (value, type) => {
    if (type === 'ec') {
      if (value >= thresholds.ec.min && value <= thresholds.ec.max)
        return '#00a5a5'; // Hijau
      if (
        (value >= thresholds.ec.min - 0.3 && value < thresholds.ec.min) ||
        (value > thresholds.ec.max && value <= thresholds.ec.max + 0.3)
      )
        return '#eadb02'; // Kuning
      return '#b30000'; // Merah
    } else if (type === 'ph') {
      if (value >= thresholds.ph.min && value <= thresholds.ph.max)
        return '#00a5a5'; // Hijau
      if (
        (value >= thresholds.ph.min - 0.5 && value < thresholds.ph.min) ||
        (value > thresholds.ph.max && value <= thresholds.ph.max + 0.5)
      )
        return '#eadb02'; // Kuning
      return '#b30000'; // Merah
    } else if (type === 'do') {
      if (value >= thresholds.do.min && value <= thresholds.do.max)
        return '#00a5a5'; // Hijau
      if (
        (value >= thresholds.do.min - 1.0 && value < thresholds.do.min) ||
        (value > thresholds.do.max && value <= thresholds.do.max + 1.0)
      )
        return '#eadb02'; // Kuning
      return '#b30000'; // Merah
    } else if (type === 'temperature') {
      if (
        value >= thresholds.temperature.min &&
        value <= thresholds.temperature.max
      )
        return '#00a5a5'; // Hijau
      if (
        (value >= thresholds.temperature.min - 2.0 &&
          value < thresholds.temperature.min) ||
        (value > thresholds.temperature.max &&
          value <= thresholds.temperature.max + 2.0)
      )
        return '#eadb02'; // Kuning
      return '#b30000'; // Merah
    }
    return '#00a5a5'; // Warna default jika tidak ada data atau tipe tidak dikenal
  };

  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundColor: '#ffffff', // Sesuaikan dengan warna latar belakang kartu
    backgroundGradientFrom: '#f7f7f7', // Latar belakang abu-abu muda
    backgroundGradientTo: '#ffffff', // Latar belakang putih
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 160, 160, ${opacity})`, // Sesuaikan dengan warna teks kartu
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Sesuaikan dengan warna teks kartu
    style: {
      borderRadius: 16,
    },
    propsForHorizontalLabels: {
      color: '#444444', // Warna label sumbu X
      rotation: -35,
    },
    propsForVerticalLabels: {
      color: '#444444',
      fontSize: 10, // Kurangi ukuran font jika perlu
      rotation: -35, // Rotasi teks pada sumbu Y
      textAnchor: 'start', // Mengatur titik jangkar teks
      padding: 10, // Jika perlu, tambahkan padding untuk menyesuaikan
    },
  };
  
  return (
    <ScrollView
      style={[styles.container, isDarkMode && styles.darkContainer]}
      contentContainerStyle={styles.scrollContent}>
      <View style={styles.innerContainer}>
        {/* Sensor Cards */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
          <Text style={styles.cardTitle}>EC</Text>
          <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: getIconBoxColor(
                    sensorData.length > 0 ? sensorData[sensorData.length - 1].ec : 0,
                    'ec'
                  ),
                },
              ]}>
              <Icon2
                name="bolt"
                size={45}
                color={getIconColor(
                  sensorData.length > 0 ? sensorData[sensorData.length - 1].ec : 0,
                  'ec'
                )}
                style={styles.icon}
              />
            </View>
            <Text style={styles.cardValue}>
              {sensorData.length > 0
                ? sensorData[sensorData.length - 1].ec + ' µS/cm'
                : '0 µS/cm'}
            </Text>
          </View>
          <View style={styles.card}>
          <Text style={styles.cardTitle}>pH</Text>
            <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: getIconBoxColor(
                      sensorData.length > 0 ? sensorData[sensorData.length - 1].ph : 0,
                      'ph'
                    ),
                  },
                ]}>
              <Icon
                name="flask"
                size={45}
                color={getIconColor(
                  sensorData.length > 0
                    ? sensorData[sensorData.length - 1].ph
                    : 0,
                  'ph',
                )}
                style={styles.icon}
              />
            </View>
            
            <Text style={styles.cardValue}>
              {sensorData.length > 0
                ? sensorData[sensorData.length - 1].ph +  ' pH'
                : '0 pH'}
                
            </Text>
          </View>
          <View style={styles.card}>
          <Text style={styles.cardTitle}>DO</Text>
            <View 
            style={[
              styles.iconBox,
              {
                backgroundColor: getIconBoxColor(
                  sensorData.length > 0 ? sensorData[sensorData.length - 1].do : 0,
                  'do'
                ),
              },
            ]}>
              <Icon2
                name="air"
                size={45}
                color={getIconColor(
                  sensorData.length > 0
                    ? sensorData[sensorData.length - 1].do
                    : 0,
                  'do',
                )}
                style={styles.icon}
              />
            </View>
            <Text style={styles.cardValue}>
              {sensorData.length > 0
                ? sensorData[sensorData.length - 1].do + ' mg/L'
                : '0 mg/L'}
            </Text>
          </View>
          <View style={styles.card}>
                        <Text style={styles.cardTitle}>Temperature</Text>
            <View 
            style={[
              styles.iconBox,
              {
                backgroundColor: getIconBoxColor(
                  sensorData.length > 0 ? sensorData[sensorData.length - 1].temperature : 0,
                  'temperature'
                ),
              },
            ]}>
              <Icon
                name="thermometer-half"
                size={45}
                color={getIconColor(
                  sensorData.length > 0
                    ? sensorData[sensorData.length - 1].temperature
                    : 0,
                  'temperature',
                )}
                style={styles.icon}
              />
            </View>

            <Text style={styles.cardValue}>
              {sensorData.length > 0
                ? sensorData[sensorData.length - 1].temperature + ' °C'
                : '0 °C'}
            </Text>
          </View>
        </View>

        {/* Sensor Graphs */}
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
            title="DO Sensor"
            data={sensorChartData.map(item => ({
              timestamp: item.timestamp,
              value: item.do,
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
  },
  darkContainer: {
    backgroundColor: 'transparent', // Atur menjadi transparan untuk mode gelap
  },
  scrollContent: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: '#cee8ec', // Warna latar belakang utama
    borderTopLeftRadius: 30, // Radius sudut atas kiri
    borderTopRightRadius: 30, // Radius sudut atas kanan
    overflow: 'hidden', // Pastikan isi tidak melampaui sudut yang melengkung
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 2,
    marginTop: 10,
  },
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 25,
    elevation: 2,
    alignItems: 'center',
  },
  darkCard: {
    backgroundColor: '#333',
  },
  icon: {},
  iconBox: {
    width: 70,
    height: 70,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9e0e0',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#0ea3ba',
  },
  darkText: {
    color: '#ffffff',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444444',
  },
  graphScroll: {
    marginBottom: 10,
  },
});

export default DashboardScreen;
