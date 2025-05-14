import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const productData = [
  { id: '1', name: 'Coffee Table', price: '₱ 1399', image: require('./assets/coffee.png') },
  { id: '2', name: 'Room Lamp', price: '₱ 799', image: require('./assets/room.png') },
  { id: '3', name: 'Artificial Plant', price: '₱ 499', image: require('./assets/artificial.png') },
  { id: '4', name: 'Cabinet', price: '₱ 3799', image: require('./assets/cabinet.png') },
  { id: '5', name: 'Bookshelf', price: '₱ 2599', image: require('./assets/cabinet.png') },
  { id: '6', name: 'TV Stand', price: '₱ 1999', image: require('./assets/cabinet.png') },
  { id: '7', name: 'Shoe Rack', price: '₱ 899', image: require('./assets/cabinet.png') },
  { id: '8', name: 'Night Stand', price: '₱ 1299', image: require('./assets/cabinet.png') },
];

const sayings = [
  "✨ Style your space in seconds!",
  "🛍️ Shop smart, live better.",
  "🛋️ Your dream home starts here!",
  "🚛 Free delivery for orders ₱1000+!",
];

export default function HomePage() {
  const navigation = useNavigation();
  const [fadeIn] = useState(new Animated.Value(0));

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(productData);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [saleVisible, setSaleVisible] = useState(true);
  const [sloganIndex, setSloganIndex] = useState(0);

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % sayings.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchText === '') {
      setFilteredData(productData);
    } else {
      const filtered = productData.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText]);

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => setQuickViewItem(item)}
      activeOpacity={0.85}
    >
      <Image source={item.image} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>FurniView</Text>
        <Image source={require('./assets/parasayo.png')} style={styles.avatar} />
      </View>

      {/* Sale Pop-up */}
      {saleVisible && (
        <TouchableOpacity style={styles.salePopup} onPress={() => setSaleVisible(false)}>
          <Text style={styles.saleText}>🔥 FLASH SALE! Up to 60% off this weekend!</Text>
        </TouchableOpacity>
      )}

      {/* Welcome & Slogan */}
      <Text style={styles.welcome}>WELCOME USER123!</Text>
      <Text style={styles.slogan}>{sayings[sloganIndex]}</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Search products..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Banner */}
      <View style={styles.banner}>
        <Image source={require('./assets/couch1.png')} style={styles.bannerImage} />
        <View>
          <Text style={styles.bannerTitle}>GET 50% OFF</Text>
          <Text style={styles.bannerSubtitle}>on your first purchase</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>HOT DEALS</Text>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />

      {/* Quick View Modal */}
      <Modal visible={!!quickViewItem} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {quickViewItem && (
              <>
                <Image source={quickViewItem.image} style={{ width: 150, height: 150 }} />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{quickViewItem.name}</Text>
                <Text>{quickViewItem.price}</Text>
                <TouchableOpacity
                  onPress={() => setQuickViewItem(null)}
                  style={styles.closeButton}
                >
                  <Text style={{ color: '#fff' }}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Floating Cart Button */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Cart')}>
        <Ionicons name="cart-outline" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
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
                <Text style={styles.navLabel}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
                <Ionicons name="person-outline" size={24} color="#4A7F4B" />
                <Text style={styles.navLabel}>Profile</Text>
              </TouchableOpacity>
            </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: 22, fontWeight: 'bold' },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  welcome: { fontSize: 18, fontWeight: 'bold', marginVertical: 5, fontStyle: 'italic' },
  slogan: { fontSize: 14, color: '#555', marginBottom: 10 },
  searchBar: {
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  banner: {
    flexDirection: 'row',
    backgroundColor: '#4A7F4B',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 10,
  },
  bannerImage: { width: 80, height: 80, marginRight: 10, resizeMode: 'contain' },
  bannerTitle: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  bannerSubtitle: { fontSize: 14, color: '#fff' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 15, marginHorizontal: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 10 },
  productCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 15,
    margin: 8,
    alignItems: 'center',
    flexBasis: '47%',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 0.5,
    borderColor: '#ddd',
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 13,
    color: '#4A7F4B',
    fontWeight: 'bold',
    marginTop: 3,
  },
  
  bottomNavNew: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#DDD' },
  navItem: { alignItems: 'center' },
  navLabel: { fontSize: 12, color: '#4A7F4B' },
  salePopup: {
    backgroundColor: '#FFD700',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  saleText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    margin: 30,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#4A7F4B',
    padding: 10,
    borderRadius: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#4A7F4B',
    borderRadius: 30,
    padding: 15,
    elevation: 5,
  },
});
