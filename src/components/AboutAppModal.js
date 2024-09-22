import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AboutAppScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Icon name="information-circle-outline" size={30} color="#00a5a5" />
          <Text style={styles.headerText}>Tentang Aplikasi</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.text}>
          Hydrotech_AB adalah aplikasi yang dirancang untuk memantau kandungan nutrisi dalam larutan pupuk AB mix dengan menggunakan sensor pH, EC, DO, dan suhu. Aplikasi ini membantu pengguna memastikan bahwa kondisi larutan berada dalam batas aman dan optimal.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Versi Aplikasi</Text>
          <Text style={styles.text}>Versi 1.0.0</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pengembang</Text>
          <Text style={styles.text}>
            Dikembangkan oleh Tim Hydrotech_AB. Untuk informasi lebih lanjut, kunjungi situs web kami di
            {' '}
            <TouchableOpacity onPress={() => Linking.openURL('https://www.Hydrotech_AB.com')}>
              <Text style={styles.link}>www.Hydrotech_AB.com</Text>
            </TouchableOpacity>
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kebijakan Privasi</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.example.com/privacy')}>
            <Text style={styles.link}>Lihat Kebijakan Privasi</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Syarat dan Ketentuan</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.example.com/terms')}>
            <Text style={styles.link}>Lihat Syarat dan Ketentuan</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kontak Dukungan</Text>
          <Text style={styles.text}>
            Untuk dukungan teknis, hubungi kami di
            {' '}
            <Text style={styles.link}>hydrotech@gmail.com</Text>
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sumber Terbuka</Text>
          <Text style={styles.text}>
            Aplikasi ini menggunakan beberapa pustaka sumber terbuka
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  contentContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    margin: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00a5a5',
    marginLeft: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  link: {
    color: '#00a5a5',
    textDecorationLine: 'underline',
  },
});

export default AboutAppScreen;
