import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FAQModal = () => {
  const [expandedIndex, setExpandedIndex] = useState(null); // State untuk melacak pertanyaan yang diklik

  const faqs = [
    {
      question: "Apa itu Hydrotech_AB?",
      answer: "Hydrotech_AB adalah aplikasi yang dirancang untuk memantau kandungan nutrisi dalam larutan pupuk AB mix dengan menggunakan sensor pH, EC (Electrical Conductivity), DO (Dissolved Oxygen), dan suhu. Aplikasi ini membantu pengguna memastikan bahwa kondisi larutan berada dalam batas aman dan optimal."
    },
    {
      question: "Apa yang terjadi jika sensor di luar batas aman?",
      answer: "Jika nilai yang terdeteksi oleh sensor berada di luar batas aman, aplikasi Hydrotech_AB akan memberikan notifikasi peringatan kepada pengguna, sehingga tindakan koreksi dapat segera dilakukan."
    },
    {
      question: "Bagaimana cara aplikasi ini bekerja?",
      answer: "Aplikasi Hydrotech_AB secara otomatis mengambil data dari sensor secara berkala dan menampilkan grafik serta informasi terkini tentang kondisi larutan. Jika nilai dari sensor melebihi ambang batas yang telah ditentukan, aplikasi akan mengirimkan notifikasi."
    },
    {
      question: "Bagaimana cara menghubungi dukungan teknis?",
      answer: "Anda dapat menghubungi dukungan teknis melalui email di hydrotech@gmail.com."
    },
  ];

  const toggleExpand = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null); // Tutup jawaban jika diklik kembali
    } else {
      setExpandedIndex(index); // Buka jawaban dari pertanyaan yang diklik
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>FAQ</Text>
      </View>

      {faqs.map((faq, index) => (
        <View key={index} style={styles.faqContainer}>
          <TouchableOpacity onPress={() => toggleExpand(index)} style={styles.questionContainer}>
            <Text style={styles.question}>{faq.question}</Text>
            <Icon
              name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#00a5a5"
            />
          </TouchableOpacity>
          {expandedIndex === index && (
            <Text style={styles.answer}>{faq.answer}</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00a5a5',
  },
  faqContainer: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00a5a5',
  },
  answer: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});

export default FAQModal;
