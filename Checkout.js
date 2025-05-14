import React, { useState, useCallback, useEffect, } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, ScrollView, Dimensions, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from './CartContext';
import { Platform } from 'react-native';


const { width } = Dimensions.get('window');

const dummyAddress = {
  name: 'Chris Braun',
  address: '11-A Miller Avenue, Barangay Bungad, Quezon City',
  phone: '+63(2)3735052',
};

const handlingFee = 999;

const cardIcons = {
  visa: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png',
  mastercard: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png',
};

const Checkout = ({ navigation, route }) => {
  const { cartItems, setCartItems, getTotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState(route.params?.paymentMethod || null);
  const [selectedAddress, setSelectedAddress] = useState(route.params?.selectedAddress || null);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  const totalPrice = getTotal();
  const grandTotal = totalPrice + handlingFee;

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDesc}>Lorem ipsum dolor sit amet</Text>
        <Text style={styles.itemDetail}>Color: Gray</Text>
        <Text style={styles.itemDetail}>Qty: {item.quantity}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
          <Ionicons name="star" size={16} color="#FFB800" />
          <Text style={{ marginLeft: 2, fontWeight: 'bold' }}>4.5</Text>
        </View>
      </View>
      <Text style={styles.itemTotal}>₱ {item.price.toLocaleString()}</Text>
    </View>
  );

  const handlePlaceOrder = () => {
    setLoading(true);
    setCartItems([]); // Clear the cart after placing the order
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Receipt');
    }, 2000); // Simulate loading for 2 seconds
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#4A7F4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Address Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Address</Text>
          </View>
          <TouchableOpacity
            style={styles.addressCard}
            onPress={() => navigation.navigate('AddressScreen', {
              selectedAddress: selectedAddress,
              cart: cartItems,
              paymentMethod: paymentMethod,
            })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.addressName}>{selectedAddress ? selectedAddress.name : dummyAddress.name}</Text>
              <Text style={styles.addressText}>{selectedAddress ? selectedAddress.address : dummyAddress.address}</Text>
              <Text style={styles.addressText}>{selectedAddress ? selectedAddress.phone : dummyAddress.phone}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#4A7F4B" />
          </TouchableOpacity>
        </View>

        {/* Promo Code Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Promo Code</Text>
          </View>
          <TextInput
            style={styles.promoInput}
            placeholder="Enter Promo Code"
            value={promoCode}
            onChangeText={setPromoCode}
          />
        </View>

        {/* Items Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cube-outline" size={20} color="#4A7F4B" />
            <Text style={styles.sectionTitle}>Items</Text>
          </View>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            scrollEnabled={false}
          />
          <Text style={styles.itemTotalLabel}>Item Total: {' '}
            <Text style={{ fontWeight: 'bold' }}>₱ {totalPrice.toLocaleString()}</Text>
          </Text>
        </View>

        {/* Payment Method Section */}
        <View style={[styles.section, { paddingBottom: 220 }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card-outline" size={20} color="#4A7F4B" />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>
          <TouchableOpacity
            style={styles.paymentBox}
            onPress={() => navigation.navigate('PaymentMethodScreen', { selectedMethod: paymentMethod })}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
              {paymentMethod?.brand ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={{ uri: cardIcons[paymentMethod.brand] }} style={styles.cardIcon} />
                  <Text style={[styles.paymentText, { marginLeft: 5 }]}>{paymentMethod.number}</Text>
                </View>
              ) : (
                <Text style={styles.paymentText}>Cash on Delivery</Text>
              )}
              <Ionicons name="chevron-forward" size={20} color="#4A7F4B" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, Platform.OS === 'ios' ? styles.footerShadowIOS : styles.footerShadowAndroid]}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Selected Items ({cartItems.length})</Text>
          <Text style={styles.summaryValue}>₱ {totalPrice.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Handling Fee</Text>
          <Text style={styles.summaryValue}>₱ {handlingFee.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabelTotal}>Total</Text>
          <Text style={styles.summaryValueTotal}>₱ {grandTotal.toLocaleString()}</Text>
        </View>

        {/* Place Order Button */}
        <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.placeOrderText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 40, marginBottom: 10,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#4A7F4B', textAlign: 'center', flex: 1 },
  content: { flex: 1 },
  section: { marginHorizontal: 16, marginVertical: 8 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  sectionTitle: { marginLeft: 6, fontWeight: 'bold', fontSize: 16, color: '#222' },
  addressCard: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12,
    padding: 12, marginTop: 4, justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 6,
    elevation: 3,
  },
  addressName: { fontWeight: 'bold', fontSize: 15, marginBottom: 2 },
  addressText: { fontSize: 13, color: '#444' },
  itemCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12,
    padding: 12, marginTop: 4, marginBottom: 6,
  },
  itemImage: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
  itemName: { fontWeight: 'bold', fontSize: 16 },
  itemDesc: { color: '#888', fontSize: 12 },
  itemDetail: { fontSize: 13, color: '#444' },
  itemTotal: { fontWeight: 'bold', fontSize: 15, color: '#222', marginLeft: 10 },
  itemTotalLabel: { fontSize: 14, color: '#333', marginTop: 8 },
  paymentBox: {
    backgroundColor: '#f5f5f5', borderRadius: 8, padding: 16, marginTop: 12, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 6,
    elevation: 3,
  },
  paymentText: { fontSize: 16, color: '#444' },
  cardIcon: { width: 30, height: 30, borderRadius: 4 },
  promoInput: {
    backgroundColor: '#F5F5F5', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 16,
    fontSize: 14, color: '#555',
  },
  footer: {
    padding: 20, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryLabel: { fontSize: 14, color: '#444' },
  summaryValue: { fontSize: 14, color: '#444' },
  summaryLabelTotal: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  summaryValueTotal: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  placeOrderBtn: {
    backgroundColor: '#4A7F4B', paddingVertical: 12, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center', marginTop: 20,
  },
  placeOrderText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footerShadowIOS: { shadowColor: '#000', shadowOffset: { width: 0, height: -1 }, shadowOpacity: 0.2, shadowRadius: 4 },
  footerShadowAndroid: { elevation: 6 },
});

export default Checkout;
