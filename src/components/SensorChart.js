import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const SensorChart = ({ title, data, screenWidth, chartConfig }) => {
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.sectionHeader}>{title}</Text>
      <LineChart
        data={{
          labels: data.length > 0 ? data.map(item => new Date(item.timestamp).toLocaleTimeString()) : ['No Data'],
          datasets: [
            {
              data: data.length > 0 ? data.map(item => item.value) : [0],
            },
          ],
        }}
        width={screenWidth - 30}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        bezier
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default SensorChart;
