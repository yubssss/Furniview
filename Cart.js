import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, SafeAreaView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from './CartContext';

const Cart = ({ navigation }) => {
  const { cartItems, setCartItems } = useCart();

  const increaseQty = id => setCartItems(prev => {
    const updated = prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i);
    AsyncStorage.setItem('cart', JSON.stringify(updated));
    return updated;
  });

  const decreaseQty = id => setCartItems(prev => {
    const updated = prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
    AsyncStorage.setItem('cart', JSON.stringify(updated));
    return updated;
  });

  useEffect(() => { 
    (async () => {
      const stored = await AsyncStorage.getItem('cart');
      if (stored) setCartItems(JSON.parse(stored));
    })();
  }, []);

  // Fix: Ensure price and quantity are valid numbers, and handle fallback
  const total = cartItems.reduce((sum, i) => {
    const price = i.price || 0; // Ensure price is a number
    const quantity = i.quantity || 0; // Ensure quantity is a number
    return sum + (price * quantity);
  }, 0);

  const renderItem = ({ item, index }) => (
    <View style={[styles.cartItem, index === cartItems.length - 1 && styles.lastItem]}>
      <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>₱ {item.price.toLocaleString()}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => decreaseQty(item.id)} style={styles.qtyButtonMinus}>
            <Ionicons name="remove" size={16} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => increaseQty(item.id)} style={styles.qtyButton}>
            <Ionicons name="add" size={16} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#4A7F4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Cart List */}
      {cartItems.length === 0 ? (
        <Text style={styles.empty}>🛒 Your cart is empty</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={i => i.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Discount Section */}
      {cartItems.length > 0 && (
        <View style={styles.discountContainer}>
          <Text style={styles.discountTitle}>Enter Promo Code</Text>
          <TextInput 
            style={styles.discountInput}
            placeholder="Enter code here"
          />
        </View>
      )}

      {/* Footer with total & checkout */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Total: <Text style={styles.total}>₱ {total.toLocaleString()}</Text>
          </Text>
          <TouchableOpacity 
            style={styles.checkoutButton} 
            onPress={() => {
              if (cartItems.length > 0) {
                navigation.navigate('Checkout');
              } else {
                alert("Your cart is empty. Please add items before proceeding.");
              }
            }}
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}

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
          <Text style={styles.navLabel}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={24} color="#4A7F4B" />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', justifyContent: 'space-between' },  // Ensures the footer stays at the bottom
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff' },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 18, color: '#777' },
  list: { padding: 16, paddingBottom: 120 },
  cartItem: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, elevation: 5 },
  itemImage: { width: 100, height: 100, borderRadius: 8, marginRight: 12 },
  itemDetails: { flex: 1, justifyContent: 'space-between' },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemPrice: { fontSize: 14, fontWeight: 'bold', marginTop: 4 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  qtyButton: { backgroundColor: '#4A7F4B', padding: 6, borderRadius: 4 },
  qtyButtonMinus: { backgroundColor: '#999', padding: 6, borderRadius: 4 },
  qtyText: { fontSize: 16, marginHorizontal: 12 },
  footer: { backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  footerText: { fontSize: 16, marginBottom: 8 },
  total: { fontWeight: 'bold', fontSize: 18 },
  checkoutButton: { backgroundColor: '#4A7F4B', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 24 },
  checkoutText: { color: '#fff', fontWeight: 'bold' },
  discountContainer: { padding: 16, backgroundColor: '#f9f9f9', borderRadius: 12, marginBottom: 12, elevation: 2 },
  discountTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  discountInput: { height: 40, borderColor: '#ddd', borderWidth: 1, borderRadius: 8, paddingLeft: 12, fontSize: 14 },
  bottomNavNew: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#DDD' },
  navItem: { alignItems: 'center' },
  navLabel: { fontSize: 12, color: '#4A7F4B' },
  lastItem: { marginBottom: 16 },
});

export default Cart;
