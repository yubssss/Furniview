import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadFavorites = async () => {
      const data = await AsyncStorage.getItem('favorites');
      if (data) setFavorites(JSON.parse(data));
    };
    loadFavorites();
  }, []);

  const removeFavorite = async (id) => {
    const updated = favorites.filter(item => item.id !== id);
    setFavorites(updated);
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
  };

  const removeAllFavorites = async () => {
    Alert.alert("Remove all?", "Are you sure you want to clear all favorites?", [
      { text: "Cancel" },
      {
        text: "Yes", onPress: async () => {
          setFavorites([]);
          await AsyncStorage.removeItem('favorites');
        }
      }
    ]);
  };

  const addToCart = async (item) => {
    const cart = await AsyncStorage.getItem('cart');
    const parsedCart = cart ? JSON.parse(cart) : [];
    parsedCart.push({ ...item, quantity: 1 });
    await AsyncStorage.setItem('cart', JSON.stringify(parsedCart));
    Alert.alert("Added to cart", `${item.name} has been added to your cart.`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={item.image} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>Lorem ipsum dolor sit amet</Text>
        <Text style={styles.price}>₱ {item.price}</Text>
        <View style={styles.ratingContainer}>
          {/* Example of 4-star rating */}
          {[...Array(5)].map((_, index) => (
            <Ionicons
              key={index}
              name={index < item.rating ? "star" : "star-outline"}
              size={16}
              color={index < item.rating ? "#FFD700" : "#bbb"}
            />
          ))}
        </View>
        <Text style={styles.availability}>{item.isAvailable ? "In Stock" : "Out of Stock"}</Text>
        <TouchableOpacity style={styles.cartButton} onPress={() => addToCart(item)}>
          <Text style={{ color: 'green', fontWeight: 'bold' }}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
      <View style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => removeFavorite(item.id)}>
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
        <Ionicons name="heart" size={24} color="green" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Favorites</Text>
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
      {favorites.length > 0 && (
        <TouchableOpacity style={styles.removeAllBtn} onPress={removeAllFavorites}>
          <Text style={styles.removeAllText}>Remove all</Text>
        </TouchableOpacity>
      )}
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
  container: { flex: 1, backgroundColor: '#F4F4F9' },
  header: {
    backgroundColor: '#4A7F4B',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  description: {
    color: '#777',
    fontSize: 12,
  },
  price: {
    fontWeight: 'bold',
    color: 'green',
    marginVertical: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  availability: {
    color: '#999',
    fontSize: 12,
    marginVertical: 4,
  },
  cartButton: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  removeAllBtn: {
    backgroundColor: 'red',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    margin: 16,
  },
  removeAllText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  bottomNavNew: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#DDD' },
  navItem: { alignItems: 'center' },
  navLabel: { fontSize: 12, color: '#4A7F4B' },
});

export default FavoritesScreen;
