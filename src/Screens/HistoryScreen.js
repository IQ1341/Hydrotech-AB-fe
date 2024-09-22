import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, PermissionsAndroid, Platform, Dimensions } from 'react-native';
import { DataTable } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { getSensorData } from '../services/api';
import { LineChart } from 'react-native-chart-kit';

const HistoryScreen = () => {
  const [sensorData, setSensorData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showGraphs, setShowGraphs] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 10000); // Polling every 10 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      const response = await getSensorData();
      setSensorData(response.data);
      filterDataByRange(startDate, endDate);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filterDataByRange = (start, end) => {
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    const filtered = sensorData.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= startDate && itemDate <= endDate;
    });
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page when filters change
  };

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
    filterDataByRange(currentDate, endDate);
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
    filterDataByRange(startDate, currentDate);
  };

  const sortData = column => {
    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
    setFilteredData(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const requestWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage to save files',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          Alert.alert('Permission Denied', 'Cannot save file without storage permission.');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const exportToCSV = async () => {
    try {
      const hasPermission = await requestWritePermission();
      if (!hasPermission) return;

      // Menyiapkan konten CSV
      const csvContent = [
        ['Timestamp', 'EC (µS/cm)', 'pH', 'DO (mg/L)', 'Temperature (°C)'],
        ...filteredData.map(item => [
          item.timestamp,
          item.ec,
          item.ph,
          item.do,
          item.temperature,
        ])
      ]
        .map(e => e.join(','))
        .join('\n');

      // Menentukan lokasi file di folder Dokumen
      const fileUri = `${RNFS.DownloadDirectoryPath}/sensor_data.csv`;

      // Menulis file CSV ke penyimpanan
      await RNFS.writeFile(fileUri, csvContent, 'utf8');

      // Menampilkan alert bahwa file telah berhasil disimpan
      Alert.alert('Success', `File has been saved to ${fileUri}`);
    } catch (error) {
      console.error('Error saving file:', error);
      Alert.alert('Error', 'Failed to save the file.');
    }
  };



  const screenWidth = Dimensions.get('window').width;

  const formatDate = date => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () => {
    if (currentPage * itemsPerPage < filteredData.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>FILTER BY DATA RANGE</Text>
        <View style={styles.datePickerContainer}>
          <TouchableOpacity
            onPress={() => setShowStartDatePicker(true)}
            style={styles.dateButton}>
            <Icon name="calendar" size={20} color="#444" style={styles.dateIcon} />
            <Text style={styles.dateText}>{formatDate(startDate)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowEndDatePicker(true)}
            style={styles.dateButton}>
            <Icon name="calendar" size={20} color="#444" style={styles.dateIcon} />
            <Text style={styles.dateText}>{formatDate(endDate)}</Text>
          </TouchableOpacity>
        </View>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={onStartDateChange}
          />
        )}
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={onEndDateChange}
          />
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.exportButton} onPress={exportToCSV}>
          <Icon name="download" size={20} color="#ffffff" />
          <Text style={styles.exportText}>Export to CSV</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.graphButton}
          onPress={() => setShowGraphs(!showGraphs)}>
          <Icon name="bar-chart" size={20} color="#ffffff" />
          <Text style={styles.graphButtonText}>
            {showGraphs ? 'Hide Graphs' : 'Show Graphs'}
          </Text>
        </TouchableOpacity>
      </View>

      {showGraphs && (
        <ScrollView horizontal={true} style={styles.graphScroll}>
          <View style={styles.chartContainer}>
            <Text style={styles.sectionHeader}>EC Sensor</Text>
            <LineChart
              data={{
                labels: filteredData.length > 0 ? filteredData.map(item => new Date(item.timestamp).toLocaleTimeString()) : ['No Data'],
                datasets: [{ data: filteredData.length > 0 ? filteredData.map(item => item.ec) : [0] }],
              }}
              width={screenWidth - 30}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              bezier
            />
          </View>
          <View style={styles.chartContainer}>
            <Text style={styles.sectionHeader}>pH Sensor</Text>
            <LineChart
              data={{
                labels: filteredData.length > 0 ? filteredData.map(item => new Date(item.timestamp).toLocaleTimeString()) : ['No Data'],
                datasets: [{ data: filteredData.length > 0 ? filteredData.map(item => item.ph) : [0] }],
              }}
              width={screenWidth - 30}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              bezier
            />
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.sectionHeader}>DO Sensor</Text>
            <LineChart
              data={{
                labels: filteredData.length > 0 ? filteredData.map(item => new Date(item.timestamp).toLocaleTimeString()) : ['No Data'],
                datasets: [{ data: filteredData.length > 0 ? filteredData.map(item => item.do) : [0] }],
              }}
              width={screenWidth - 30}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              bezier
            />
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.sectionHeader}>Temperature Sensor</Text>
            <LineChart
              data={{
                labels: filteredData.length > 0 ? filteredData.map(item => new Date(item.timestamp).toLocaleTimeString()) : ['No Data'],
                datasets: [{ data: filteredData.length > 0 ? filteredData.map(item => item.temperature) : [0] }],
              }}
              width={screenWidth - 30}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              bezier
            />
          </View>
        </ScrollView>
      )}

      <DataTable style={styles.table}>
        <DataTable.Header style={styles.tableHeader}>
          <DataTable.Title
            onPress={() => sortData('ec')}
            style={styles.tableTitle}>
            EC 
          </DataTable.Title>
          <DataTable.Title
            onPress={() => sortData('ph')}
            style={styles.tableTitle}>
            pH
          </DataTable.Title>
          <DataTable.Title
            onPress={() => sortData('do')}
            style={styles.tableTitle}>
            DO 
          </DataTable.Title>
          <DataTable.Title
            onPress={() => sortData('temperature')}
            style={styles.tableTitle}>
            Temperature (°C)
          </DataTable.Title>
          <DataTable.Title
            onPress={() => sortData('timestamp')}
            style={styles.tableTitle}>
            Time
          </DataTable.Title>
        </DataTable.Header>

        {paginatedData.map((item, index) => (
          <DataTable.Row key={index} style={styles.tableRow}>
            <DataTable.Cell style={styles.tableCell}>{item.ec}</DataTable.Cell>
            <DataTable.Cell style={styles.tableCell}>{item.ph}</DataTable.Cell>
            <DataTable.Cell style={styles.tableCell}>{item.do}</DataTable.Cell>
            <DataTable.Cell style={styles.tableCell}>{item.temperature}</DataTable.Cell>
            <DataTable.Cell style={styles.tableCell}>
              {new Date(item.timestamp).toLocaleTimeString()}
            </DataTable.Cell>
          </DataTable.Row>
        ))}

        <View style={styles.paginationContainer}>
          <TouchableOpacity
            onPress={prevPage}
            disabled={currentPage === 1}
            style={styles.paginationButton}>
            <Icon
              name="chevron-left"
              size={20}
              color={currentPage === 1 ? '#b0b0b0' : '#00a5a5'}
            />
            <Text
              style={[
                styles.paginationText,
                { color: currentPage === 1 ? '#b0b0b0' : '#00a5a5' },
              ]}>
              Previous
            </Text>
          </TouchableOpacity>
          <Text style={styles.pageNumber}>Page {currentPage}</Text>
          <TouchableOpacity
            onPress={nextPage}
            disabled={currentPage * itemsPerPage >= filteredData.length}
            style={styles.paginationButton}>
            <Text
              style={[
                styles.paginationText,
                {
                  color:
                    currentPage * itemsPerPage >= filteredData.length
                      ? '#b0b0b0'
                      : '#00a5a5',
                },
              ]}>
              Next
            </Text>
            <Icon
              name="chevron-right"
              size={20}
              color={
                currentPage * itemsPerPage >= filteredData.length
                  ? '#b0b0b0'
                  : '#00a5a5'
              }
            />
          </TouchableOpacity>
        </View>
      </DataTable>

      {filteredData.length === 0 && (
        <Text style={styles.noDataText}>
          No data available for the selected date range.
        </Text>
      )}
      </View>
      </ScrollView>
  );
};

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#f7f7f7',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 160, 160, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForHorizontalLabels: {
    color: '#444444',
  },
  propsForVerticalLabels: {
    display: 'none',
  },
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00a5a5',
    marginBottom: 20,
    textAlign: 'center',
},
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

  filterContainer: {
    marginBottom: 20,
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    elevation: 3,
  },
  filterLabel: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#444',
    marginLeft: 10,
    textAlign: 'center',
  },
  dateIcon: {
    marginRight: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#00a5a5',
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  exportText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 10,
  },
  graphButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#00a5a5',
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  graphButtonText: {
    fontSize: 16,
    color: '#ffffff',
  },
  graphScroll: {
    marginBottom: 20,
  },
  chartContainer: {
    marginRight: 20,
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 18,
    color: '#2f8f9d',
  },
  chart: {
    borderRadius: 16,
  },
  table: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    marginBottom:165
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  tableCell: {
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationText: {
    fontSize: 16,
    marginHorizontal: 5,
  },
  pageNumber: {
    fontSize: 16,
    color: '#444',
  },
  noDataText: {
    marginTop: 20,
    marginBottom:120,
    textAlign: 'center',
    color: '#777',
  },
});

export default HistoryScreen;

