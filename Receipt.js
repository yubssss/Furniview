import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Receipt = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Completed</Text>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2435/2435281.png' }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.subtitle}>Thank you for your purchase.</Text>
      <Text style={styles.description}>You can view your order in 'Order History' section.</Text>

      <TouchableOpacity style={styles.continueShoppingButton} onPress={() => navigation.navigate('Products')}>
        <Text style={styles.continueShoppingText}>Continue shopping</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 40,
  },
  continueShoppingButton: {
    backgroundColor: '#4A7F4B',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 999,
  },
  continueShoppingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Receipt;