import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const products = [
  { id: '1', name: 'Vanity Table', price: '₱3,490', category: 'Tables', image: require('./assets/VANITYTABLE.png') },
  { id: '2', name: 'Coffee Table', price: '₱1,290', category: 'Tables', image: require('./assets/COFFEETABLE.png') },
  { id: '3', name: 'Computer Table', price: '₱6,380', category: 'Tables', image: require('./assets/COMPUTERTABLE.png') },
  { id: '4', name: 'Dining Table', price: '₱34,990', category: 'Tables', image: require('./assets/DININGTABLE.png') },
  { id: '5', name: 'Folding Table', price: '₱1,890', category: 'Tables', image: require('./assets/FOLDINGTABLE.png') },
  { id: '6', name: 'Side Table', price: '₱1,290', category: 'Tables', image: require('./assets/SIDETABLE.png') },
  { id: '7', name: 'Sleeper Sofa', price: '₱20,990', category: 'Chairs', image: require('./assets/SLEEPERSOFA.png') },
  { id: '8', name: 'Couch', price: '₱11,990', category: 'Chairs', image: require('./assets/COUCH.png') },
  { id: '9', name: 'Gaming Chair', price: '₱13,990', category: 'Chairs', image: require('./assets/GAMINGCHAIR.png') },
  { id: '10', name: 'Office Chair', price: '₱8,190', category: 'Chairs', image: require('./assets/OFFICECHAIR.png') },
  { id: '11', name: 'Dining Chair', price: '₱5,750', category: 'Chairs', image: require('./assets/DININGCHAIR.png') },
  { id: '12', name: 'Outdoor Chair', price: '₱2,750', category: 'Chairs', image: require('./assets/OUTDOORCHAIR.png') },
  { id: '13', name: 'Table Lamp', price: '₱990', category: 'Lights', image: require('./assets/TABLELAMP.png') },
  { id: '14', name: 'Floor Lamp', price: '₱2,990', category: 'Lights', image: require('./assets/FLOORLAMP.png') },
  { id: '15', name: 'Ceiling Light', price: '₱2,290', category: 'Lights', image: require('./assets/CEILINGLIGHT.png') },
  { id: '16', name: 'Pendant Light', price: '₱4,990', category: 'Lights', image: require('./assets/PENDANTLIGHT.png') },
  { id: '17', name: 'Wall Lamp', price: '₱2,590', category: 'Lights', image: require('./assets/WALLLAMP.png') },
  { id: '18', name: 'Spotlight', price: '₱450', category: 'Lights', image: require('./assets/SPOTLIGHT.png') }
];

const categories = ['All', 'Tables', 'Chairs', 'Lights'];

export default function ProductPage({ navigation }) {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchFavorites = async () => {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    };
    fetchFavorites();
  }, []);

  const toggleFavorite = async (product) => {
    let updatedFavorites;
    if (favorites.some(fav => fav.id === product.id)) {
      updatedFavorites = favorites.filter(fav => fav.id !== product.id);
    } else {
      updatedFavorites = [...favorites, product];
    }
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const isFavorite = (productId) => favorites.some(item => item.id === productId);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        if (storedCart) setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    };
    loadCart();
  }, []);

  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Failed to save cart:', error);
      }
    };
    saveCart();
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, price: parseInt(product.price.replace(/[₱,]/g, '')), quantity: 1 }];
      }
    });
  };

  const getFilteredProducts = () => selectedCategory === 'All' ? products : products.filter(p => p.category === selectedCategory);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('./assets/furniview-logo.png')} style={styles.logo} />
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="cart-outline" size={28} color="#4A7F4B" />
        </TouchableOpacity>
      </View>
      <Image source={require('./assets/tagline.png')} style={styles.tagline} />

      <View style={styles.categories}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.activeCategory]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.activeCategoryText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={getFilteredProducts()}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={item.image} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
            </View>
            <View style={styles.productActionsColumn}>
  <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(item)}>
    <Text style={styles.addToCartText}>Add to Cart</Text>
  </TouchableOpacity>
  <TouchableOpacity
    onPress={() =>
      navigation.navigate('ProductDetails', {
        product: item,
        cartItems: cart,
        setCart: setCart,
      })
    }
    style={styles.viewDetailsButton}
  >
    <Text style={styles.viewDetailsText}>View Details</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.heartIcon}>
    <Ionicons
      name={isFavorite(item.id) ? 'heart' : 'heart-outline'}
      size={24}
      color={isFavorite(item.id) ? '#E74C3C' : '#888'}
    />
  </TouchableOpacity>
</View>

          </View>
        )}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
      />

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
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
  logo: { width: 300, height: 100, resizeMode: 'contain' },
  tagline: { alignSelf: 'flex-start', width: 250, height: 25, resizeMode: 'contain', marginTop: -35, marginLeft: 20, marginBottom: 15 },
  categories: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, paddingHorizontal: 15 },
  categoryButton: { flex: 1, padding: 8, backgroundColor: '#EEE', borderRadius: 15, marginHorizontal: 5, minWidth: 70, alignItems: 'center' },
  activeCategory: { backgroundColor: '#4A7F4B' },
  categoryText: { fontSize: 14, color: '#333', fontWeight: '500' },
  activeCategoryText: { color: '#FFF' },
  productList: { paddingHorizontal: 10 },
  productCard: { flex: 1, backgroundColor: '#F9F9F9', margin: 5, padding: 10, borderRadius: 10, alignItems: 'center' },
  productImage: { width: 100, height: 100, resizeMode: 'contain' },
  productInfo: { alignItems: 'center', marginVertical: 5 },
  productName: { fontSize: 14, fontWeight: 'bold' },
  productPrice: { fontSize: 13, color: '#666' },
  productActionsColumn: { alignItems: 'center', gap: 5 },
  addToCartButton: { backgroundColor: '#4A7F4B', padding: 5, borderRadius: 5 },
  addToCartText: { color: '#FFF', fontSize: 12 },
  viewDetailsButton: { marginTop: 5 },
  viewDetailsText: { color: '#4A7F4B', fontSize: 12 },
  bottomNavNew: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#DDD' },
  navItem: { alignItems: 'center' },
  navLabel: { fontSize: 12, color: '#4A7F4B' },
  
  
});
