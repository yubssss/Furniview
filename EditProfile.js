import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Profile = ({ navigation }) => {
  const [firstName, setFirstName] = useState('Jisoo');
  const [lastName, setLastName] = useState('Kim');
  const [email, setEmail] = useState('officialkimjisoo@gmail.com');
  const [contact, setContact] = useState('0906 038 1005');
  const [address, setAddress] = useState('11-A Miller Avenue, Barangay Bungad, Quezon City');
  const [password, setPassword] = useState('***********');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with Back Arrow and Title */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color="#4A7F4B" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Profile</Text>
              <View style={{ width: 28 }} />
            </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://i.pinimg.com/736x/8d/e3/f0/8de3f08d67c8a49a86b0eafc332d44d3.jpg' }} // default profile picture
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.cameraIcon}>
          <Ionicons name="camera" size={20} color="#4A7F4B" />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.row}>
          <View style={styles.inputHalf}>
            <Text style={styles.label}>First Name</Text>
            <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
          </View>
          <View style={styles.inputHalf}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
          </View>
        </View>

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />

        <Text style={styles.label}>Contact</Text>
        <TextInput style={styles.input} value={contact} onChangeText={setContact} />

        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} />

        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} value={password} secureTextEntry />

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.changePassBtn}>
          <Text style={styles.changePassText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#4A7F4B',
    textAlign: 'center',
    flex: 1,
  },
  container: {
    padding: 20,
    backgroundColor: '#E8DAD5',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A7F4B',
    marginLeft: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#4A7F4B',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 170,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    borderColor: '#4A7F4B',
    borderWidth: 1,
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
  },
  saveBtn: {
    backgroundColor: '#4A7F4B',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  saveText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  changePassBtn: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#4A7F4B',
  },
  changePassText: {
    color: '#4A7F4B',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Profile;