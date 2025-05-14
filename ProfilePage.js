import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const orders = [
  {
    id: 1,
    name: 'Sleeper Sofa',
    category: 'Chairs',
    price: '₱ 9999',
    image: 'https://i.pinimg.com/736x/8d/e3/f0/8de3f08d67c8a49a86b0eafc332d44d3.jpg',
  },
  {
    id: 2,
    name: 'Cozy Armchair',
    category: 'Seating',
    price: '₱ 7999',
    image: 'https://i.pinimg.com/736x/a4/1f/68/a41f68cfc8f2f7a858a6fbdc03a58fa9.jpg',
  },
  {
    id: 3,
    name: 'Modern Couch',
    category: 'Sofas',
    price: '₱ 11999',
    image: 'https://i.pinimg.com/736x/9b/e8/fc/9be8fce2decd3c8a3c3b3701219f67e8.jpg',
  },
];

const ProfileScreen = ({ navigation }) => {
  const [rateModalVisible, setRateModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);


  const handleStarPress = (index) => {
    setRating(index + 1);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsHorizontalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.profileText}>Profile</Text>
        </View>

        {/* User Info */}
        <View style={styles.profileBox}>
          <Image
            source={{ uri: 'https://i.pinimg.com/736x/8d/e3/f0/8de3f08d67c8a49a86b0eafc332d44d3.jpg' }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>AEAN LEE</Text>
          <Text style={styles.email}>user123@gmail.com</Text>
        </View>

        {/* Previous Orders */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Previous Orders</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PrevOrder')}>
            <Icon name="arrow-forward" size={20} color="#7A7A7A" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal style={styles.ordersRow} showsHorizontalScrollIndicator={false}>
          {orders.map((item) => (
            <View key={item.id} style={styles.orderCard}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.price}>{item.price}</Text>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <TouchableOpacity style={styles.orderButton}>
                <Text style={styles.orderButtonText}>View Order</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Preferences */}
        <Text style={styles.prefTitle}>Preferences</Text>
        <View style={styles.prefContainer}>
  {[
    { icon: 'person-circle', label: 'Edit Profile', screen: 'EditProfile' },
    { icon: 'help-circle', label: 'Help Center', screen: 'HelpCenter' },
    { icon: 'star', label: 'Rate the App', action: () => setRateModalVisible(true) },
    { icon: 'log-out', label: 'Logout', action: () => setLogoutModalVisible(true) },
  ].map((item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.prefItem}
      onPress={() => item.action ? item.action() : navigation.navigate(item.screen)}
    >
      <Icon name={item.icon} size={20} color="#fff" />
      <Text style={styles.prefText}>{item.label}</Text>
      <Icon name="chevron-forward" size={16} color="#fff" />
    </TouchableOpacity>
  ))}
</View>

      </ScrollView>

      <Modal
  visible={logoutModalVisible}
  animationType="fade"
  transparent
  onRequestClose={() => setLogoutModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Confirm Logout</Text>
      <Text style={styles.modalSubtitle}>Are you sure you want to logout?</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.modalButton, { backgroundColor: '#ccc' }]}
          onPress={() => setLogoutModalVisible(false)}
        >
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modalButton, { backgroundColor: '#4A7F4B' }]}
          onPress={() => {
            setLogoutModalVisible(false);
            navigation.navigate('LoginPage'); 
          }}
        >
          <Text style={styles.modalButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>


      {/* Rate Modal inside Profile.js */}
      <Modal
        visible={rateModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setRateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>RATE US!</Text>
            <Text style={styles.modalSubtitle}>How would you love this app?</Text>

            <View style={styles.starsRow}>
              {[0, 1, 2, 3, 4].map((index) => (
                <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
                  <Ionicons
                    name={rating > index ? 'star' : 'star-outline'}
                    size={32}
                    color={rating > index ? '#FFA500' : '#ccc'}
                    style={{ marginHorizontal: 5 }}
                  />
                </TouchableOpacity>
              ))}
              
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={() => setRateModalVisible(false)}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRateModalVisible(false)}>
              <Text style={styles.noThanks}>No, Thanks</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomNavNew}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={24} color="#4A7F4B" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Products')}>
          <Ionicons name="pricetag-outline" size={24} color="#4A7F4B" />
          <Text style={styles.navLabel}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Favorites')}>
          <Ionicons name="heart-outline" size={24} color="#4A7F4B" />
          <Text style={styles.navLabel}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={24} color="#4A7F4B" />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  submitBtn: {
    backgroundColor: '#4A7F4B',
    padding: 12,
    paddingLeft: 50,
    paddingRight: 50,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  starsRow: { flexDirection: 'row', marginBottom: 20 },
  noThanks: { color: '#777', fontSize: 14 },
  wrapper: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#4E7D4E',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  profileText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileBox: {
    backgroundColor: '#4E7D4E',
    margin: 20,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#4E7D4E',
    marginBottom: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff',
  },
  email: {
    color: '#fff',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#4E7D4E',
    fontSize: 16,
  },
  prefTitle: {
    fontWeight: 'bold',
    color: '#4E7D4E',
    fontSize: 16,
    left: 20,
    marginTop: 20,
  },
  ordersRow: {
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  orderCard: {
    backgroundColor: '#4E7D4E',
    borderRadius: 16,
    padding: 10,
    marginHorizontal: 5,
    width: 200,
  },
  productName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  category: {
    color: '#fff',
    fontSize: 12,
  },
  price: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  productImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  orderButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#4E7D4E',
    fontWeight: 'bold',
    fontSize: 12,
  },
  prefContainer: {
    backgroundColor: '#4E7D4E',
    margin: 20,
    borderRadius: 16,
    padding: 25,
  },
  prefItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
    justifyContent: 'space-between',
  },
  prefText: {
    color: '#fff',
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNavNew: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#DDD' },
  navItem: { alignItems: 'center' },
  navLabel: { fontSize: 12, color: '#4A7F4B' },
});

export default ProfileScreen;