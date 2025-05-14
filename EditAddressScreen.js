import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditAddressScreen = ({ navigation, route }) => {
  const { address, updateAddress, deleteAddress } = route.params;
  const [name, setName] = useState(address.name);
  const [phone, setPhone] = useState(address.phone);
  const [addressText, setAddressText] = useState(address.address);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const handleSaveAddress = useCallback(() => {
    // Basic validation
    if (!name || !phone || !addressText) {
      alert('Please fill in all fields.');
      return;
    }

    // Create a new address object
    const updatedAddress = {
      id: address.id, // Keep the same ID
      name: name,
      phone: phone,
      address: addressText,
      isDefault: address.isDefault, // Keep the same isDefault value
    };

    // Pass the updated address back to the AddressScreen
    updateAddress(updatedAddress);

    // Navigate back
    navigation.goBack();
  }, [navigation, address, name, phone, addressText, updateAddress]);

  const handleDeleteAddress = useCallback(() => {
    setShowDeleteConfirmation(true);
    Animated.timing(fadeAnim, {
      toValue: 1, // Changed to 1 for full opacity
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, []);

  const confirmDeleteAddress = useCallback(() => {
    deleteAddress(address.id);
    navigation.goBack();
  }, [navigation, address, deleteAddress]);

  const cancelDeleteAddress = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: false,
    }).start(() => setShowDeleteConfirmation(false));
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#4A7F4B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Address</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.inputLabel}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.inputLabel}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            value={addressText}
            onChangeText={setAddressText}
            multiline
          />
        </View>

        {/* Save Address Button */}
        <TouchableOpacity style={styles.saveAddressButton} onPress={handleSaveAddress}>
          <Text style={styles.saveAddressText}>Save Address</Text>
        </TouchableOpacity>

        {/* Delete Address Button */}
        <TouchableOpacity style={styles.deleteAddressButton} onPress={handleDeleteAddress}>
          <Text style={styles.deleteAddressText}>Delete Address</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={showDeleteConfirmation}
        onRequestClose={cancelDeleteAddress}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Address</Text>
            <Text style={styles.modalText}>Are you sure you want to delete this address?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={cancelDeleteAddress}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={confirmDeleteAddress}>
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveAddressButton: {
    backgroundColor: '#4A7F4B',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  saveAddressText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteAddressButton: {
    backgroundColor: '#FF5050', 
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  deleteAddressText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#222',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  cancelBtn: {
    backgroundColor: '#ddd',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  cancelBtnText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteBtn: {
    backgroundColor: '#FF5050',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditAddressScreen;   