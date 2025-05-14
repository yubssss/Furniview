// Enhanced ProductDetails.js

import React, { useState, useContext } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
  ScrollView, Platform, ToastAndroid, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from './CartContext';

// Add this updated relatedProducts array at the top
const relatedProducts = [
  {
    id: '1',
    name: 'Vanity Table',
    price: '₱3,490',
    category: 'Tables',
    image: require('./assets/VANITYTABLE.png'),
    description: 'Elegant vanity table with a minimalist design, perfect for makeup and daily grooming.'
  },
  {
    id: '2',
    name: 'Coffee Table',
    price: '₱1,290',
    category: 'Tables',
    image: require('./assets/COFFEETABLE.png'),
    description: 'Modern coffee table with a wooden finish, ideal for living room setups.'
  },
  {
    id: '3',
    name: 'Computer Table',
    price: '₱6,380',
    category: 'Tables',
    image: require('./assets/COMPUTERTABLE.png'),
    description: 'Sturdy computer table with cable management and ample legroom for comfort.'
  },
  {
    id: '4',
    name: 'Dining Table',
    price: '₱34,990',
    category: 'Tables',
    image: require('./assets/DININGTABLE.png'),
    description: 'Luxurious dining table that seats six, perfect for family gatherings and dinners.'
  },
  {
    id: '5',
    name: 'Folding Table',
    price: '₱1,890',
    category: 'Tables',
    image: require('./assets/FOLDINGTABLE.png'),
    description: 'Space-saving folding table suitable for multi-purpose home or office use.'
  },
  {
    id: '6',
    name: 'Side Table',
    price: '₱1,290',
    category: 'Tables',
    image: require('./assets/SIDETABLE.png'),
    description: 'Compact side table perfect for placing beside your bed or couch.'
  },
  {
    id: '7',
    name: 'Sleeper Sofa',
    price: '₱20,990',
    category: 'Chairs',
    image: require('./assets/SLEEPERSOFA.png'),
    description: 'Comfortable sleeper sofa that converts into a bed, ideal for small spaces.'
  },
  {
    id: '8',
    name: 'Couch',
    price: '₱11,990',
    category: 'Chairs',
    image: require('./assets/COUCH.png'),
    description: 'Stylish and cozy couch for your modern living room setup.'
  },
  {
    id: '9',
    name: 'Gaming Chair',
    price: '₱13,990',
    category: 'Chairs',
    image: require('./assets/GAMINGCHAIR.png'),
    description: 'Ergonomic gaming chair designed for long hours of comfort and performance.'
  },
  {
    id: '10',
    name: 'Office Chair',
    price: '₱8,190',
    category: 'Chairs',
    image: require('./assets/OFFICECHAIR.png'),
    description: 'Adjustable office chair with lumbar support and breathable mesh back.'
  },
  {
    id: '11',
    name: 'Dining Chair',
    price: '₱5,750',
    category: 'Chairs',
    image: require('./assets/DININGCHAIR.png'),
    description: 'Elegant dining chair with cushioned seating for added comfort.'
  },
  {
    id: '12',
    name: 'Outdoor Chair',
    price: '₱2,750',
    category: 'Chairs',
    image: require('./assets/OUTDOORCHAIR.png'),
    description: 'Weather-resistant outdoor chair suitable for patios and gardens.'
  },
  {
    id: '13',
    name: 'Table Lamp',
    price: '₱990',
    category: 'Lights',
    image: require('./assets/TABLELAMP.png'),
    description: 'Compact table lamp with warm lighting, great for study and reading.'
  },
  {
    id: '14',
    name: 'Floor Lamp',
    price: '₱2,990',
    category: 'Lights',
    image: require('./assets/FLOORLAMP.png'),
    description: 'Tall floor lamp with adjustable brightness for cozy ambiance.'
  },
  {
    id: '15',
    name: 'Ceiling Light',
    price: '₱2,290',
    category: 'Lights',
    image: require('./assets/CEILINGLIGHT.png'),
    description: 'Modern ceiling light fixture that brightens up your room evenly.'
  },
  {
    id: '16',
    name: 'Pendant Light',
    price: '₱4,990',
    category: 'Lights',
    image: require('./assets/PENDANTLIGHT.png'),
    description: 'Elegant pendant light ideal for dining rooms or kitchen counters.'
  },
  {
    id: '17',
    name: 'Wall Lamp',
    price: '₱2,590',
    category: 'Lights',
    image: require('./assets/WALLLAMP.png'),
    description: 'Wall-mounted lamp that adds a decorative touch and soft lighting.'
  },
  {
    id: '18',
    name: 'Spotlight',
    price: '₱450',
    category: 'Lights',
    image: require('./assets/SPOTLIGHT.png'),
    description: 'Directional spotlight perfect for highlighting specific areas or décor.'
  }
];



export default function ProductDetails({ route, navigation }) {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart: addToCartFromContext } = useContext(CartContext);

  const handleQuantity = (type) => {
    setQuantity(prev => type === 'add' ? prev + 1 : Math.max(1, prev - 1));
  };

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  const addToCart = () => {
    const priceNumber = parseFloat(product.price.replace(/[₱,]/g, ''));
    const newProduct = {
      ...product,
      quantity,
      totalPrice: priceNumber * quantity,
    };
    addToCartFromContext(newProduct);

    Platform.OS === 'android'
      ? ToastAndroid.show(`Added ${quantity} to cart!`, ToastAndroid.SHORT)
      : Alert.alert('Success', `Added ${quantity} to cart!`);
  };

  const formattedPrice = parseFloat(product.price.replace(/[₱,]/g, '')).toLocaleString();

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.logo}>FurniView</Text>
          <TouchableOpacity onPress={toggleFavorite}>
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={product.image} style={styles.productImage} />
        </View>

        {/* Title and Price */}
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{product.name}</Text>
          <Text style={styles.productPrice}>₱ {formattedPrice}</Text>
          <Text style={styles.rating}>⭐ 4.5 | In Stock</Text>
        </View>

        {/* Quantity Selector */}
        <View style={styles.quantityRow}>
          <Text style={styles.qtyText}>Quantity:</Text>
          <View style={styles.qtyControls}>
            <TouchableOpacity onPress={() => handleQuantity('remove')} style={styles.qtyBtn}>
              <Text style={styles.qtySymbol}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyNum}>{quantity}</Text>
            <TouchableOpacity onPress={() => handleQuantity('add')} style={styles.qtyBtn}>
              <Text style={styles.qtySymbol}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Key Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <Text style={styles.featureText}>✔️ High-quality materials</Text>
          <Text style={styles.featureText}>✔️ Elegant and space-saving design</Text>
          <Text style={styles.featureText}>✔️ Perfect for modern interiors</Text>
        </View>

        {/* 3D / AR Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.view3DButton} onPress={() => navigation.navigate('ModelViewerScreen', { modelName: product.name })}>
            <Ionicons name="cube" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>View in 3D</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewARButton} onPress={() => navigation.navigate('CameraScreen', { modelName: product.name })}>
            <Ionicons name="camera" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>View in Room</Text>
          </TouchableOpacity>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
          <Text style={styles.addToCartText}>ADD TO CART</Text>
        </TouchableOpacity>

        <Text style={styles.productDescription}>
          {product.description || 'No description available.'}
        </Text>

        {/* Related Products */}
        <View style={styles.relatedSection}>
          <Text style={styles.sectionTitle}>Related Products</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {relatedProducts
              .filter(item => item.category === product.category && item.id !== product.id)
              .map(item => (
                <TouchableOpacity key={item.id} onPress={() => navigation.push('ProductDetails', { product: item })}>
                  <View style={styles.relatedCard}>
                    <Image source={item.image} style={styles.relatedImage} />
                    <Text style={styles.relatedText}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </ScrollView>

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
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#4A7F4B',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  logo: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  imageContainer: { alignItems: 'center', padding: 10 },
  productImage: { width: '100%', height: 250, resizeMode: 'contain' },
  productInfo: { padding: 16 },
  productTitle: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  productPrice: { fontSize: 22, color: '#4A7F4B', marginTop: 8 },
  rating: { fontSize: 16, color: 'gray', marginTop: 4 },
  quantityRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16, marginTop: 10
  },
  qtyText: { fontSize: 18 },
  qtyControls: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: {
    backgroundColor: '#4A7F4B', padding: 8, borderRadius: 4, marginHorizontal: 8
  },
  qtySymbol: { color: '#fff', fontSize: 20 },
  qtyNum: { fontSize: 18 },
  section: { paddingHorizontal: 16, paddingTop: 10 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  featureText: { fontSize: 16, marginBottom: 2 },
  actionsRow: {
    flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 12
  },
  view3DButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#4A7F4B',
    padding: 10, borderRadius: 10, paddingHorizontal: 20
  },
  viewARButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#3A5F3A',
    padding: 10, borderRadius: 10, paddingHorizontal: 20
  },
  actionButtonText: { color: '#fff', marginLeft: 6 },
  addToCartButton: {
    backgroundColor: '#FF914D', padding: 16, margin: 20, borderRadius: 12,
    alignItems: 'center'
  },
  addToCartText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  relatedSection: { paddingHorizontal: 16 },
  relatedCard: {
    marginRight: 12, backgroundColor: '#f9f9f9',
    padding: 10, borderRadius: 10, alignItems: 'center'
  },
  relatedImage: { width: 100, height: 100, resizeMode: 'contain' },
  relatedText: { marginTop: 6, fontSize: 14, textAlign: 'center' },
   bottomNavNew: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#DDD' },
  navItem: { alignItems: 'center' },
  navLabel: { fontSize: 12, color: '#4A7F4B' },
  productDescription: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
    lineHeight: 22,
    paddingHorizontal: 16
  },
});