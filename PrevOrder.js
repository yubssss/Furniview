import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const initialOrders = [
  {
    id: '1023892',
    paymentDate: 'March 3, 2025',
    status: 'Completed',
    paymentStatus: 'Paid',
    address: 'Pedro Burgos, anak ni Rizal',
    paymentMethod: 'Cash on Delivery',
    items: [
      {
        name: 'Coffee Table',
        qty: 1,
        color: 'Black',
        price: 2520,
        deliveryDate: 'March 3, 2025',
        status: 'Delivered',
        image: require('./assets/OFFICECHAIR.png'),
      },
    ],
    total: 2520,
  },
  {
    id: '1023893',
    paymentDate: 'March 5, 2025',
    status: 'On-going',
    paymentStatus: 'Processing',
    address: 'Pedro Burgos, anak ni Rizal',
    paymentMethod: 'Cash on Delivery',
    items: [
      {
        name: 'Sleeper Sofa',
        qty: 1,
        color: 'Gray',
        price: 2899,
        deliveryDate: 'March 7, 2025',
        status: 'Pending',
        image: require('./assets/OFFICECHAIR.png'),
      },
    ],
    total: 2899,
  },
];

const OrderHistoryScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('All');
  const [orders, setOrders] = useState(initialOrders);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredOrders =
    selectedTab === 'All'
      ? orders
      : orders.filter(order => order.status === selectedTab);

  const handleViewDetails = item => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCancelOrder = orderId => {
    const updatedOrders = orders.map(order =>
      order.id === orderId
        ? {
            ...order,
            status: 'Cancelled',
            paymentStatus: 'Cancelled',
            items: order.items.map(item => ({
              ...item,
              status: 'Cancelled',
            })),
          }
        : order
    );
    setOrders(updatedOrders);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        <Image source={require('./assets/furniview-logo.png')} style={styles.logo} />
        <Text style={styles.title}>Order History</Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          {['All', 'On-going', 'Completed', 'Cancelled'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab)}
              style={[
                styles.tab,
                selectedTab === tab ? styles.activeTab : styles.inactiveTab,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab ? styles.activeTabText : styles.inactiveTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Orders */}
        {filteredOrders.map(order => (
          <View key={order.id} style={styles.orderCard}>
            <Text style={styles.orderTitle}>Order #{order.id}</Text>
            <Text style={styles.orderDate}>Date: {order.paymentDate}</Text>

            {order.items.map((item, index) => (
              <View key={index} style={styles.productItem}>
                <Image source={item.image} style={styles.image} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.details}>
                    Qty: {item.qty} | Color: {item.color}
                  </Text>
                  <Text style={styles.price}>₱{item.price}</Text>
                  <Text
                    style={[
                      styles.deliveryStatus,
                      item.status === 'Delivered'
                        ? styles.delivered
                        : item.status === 'Cancelled'
                        ? styles.cancelled
                        : styles.pending,
                    ]}
                  >
                    {item.status}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleViewDetails({ ...item, orderId: order.id })}
                  >
                    <Text style={styles.viewDetails}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.summaryRow}>
              <Text style={styles.statusText}>Payment: {order.paymentStatus}</Text>
              <Text style={styles.statusText}>Total: ₱{order.total}</Text>
            </View>

            {order.status === 'On-going' && (
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => handleCancelOrder(order.id)}
              >
                <Text style={styles.cancelBtnText}>Cancel Order</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* Modal for item details */}
        {selectedItem && (
          <Modal visible={modalVisible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Order Details</Text>
                <Image source={selectedItem.image} style={styles.modalImage} />

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>{selectedItem.name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Quantity:</Text>
                  <Text style={styles.value}>{selectedItem.qty}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Color:</Text>
                  <Text style={styles.value}>{selectedItem.color}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Price:</Text>
                  <Text style={styles.value}>₱{selectedItem.price}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Delivery Date:</Text>
                  <Text style={styles.value}>{selectedItem.deliveryDate}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Status:</Text>
                  <Text style={styles.value}>{selectedItem.status}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Order ID:</Text>
                  <Text style={styles.value}>{selectedItem.orderId}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeBtn}
                >
                  <Text style={styles.closeBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>

      {/* Bottom Navbar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home-outline" size={28} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="pricetag-outline" size={28} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={28} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderHistoryScreen;

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#4A7F4B',
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 12 },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  
  activeTab: {
    backgroundColor: '#4A7F4B',
  },
  
  inactiveTab: {
    backgroundColor: '#fff',
  },
  
  tabText: {
    fontWeight: '500',
    fontSize: 14,
  },
  
  activeTabText: {
    color: '#fff',
  },
  
  inactiveTabText: {
    color: '#4A7F4B',
  },
  

  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    elevation: 2,
  },
  orderTitle: { fontSize: 16, fontWeight: '600' },
  orderDate: { fontSize: 12, color: '#666', marginBottom: 8 },

  productItem: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  image: { width: 60, height: 60, marginRight: 10 },
  productName: { fontWeight: 'bold', fontSize: 15 },
  details: { color: '#666' },
  price: { marginTop: 4, fontWeight: '600' },
  deliveryStatus: { marginTop: 4, fontSize: 12, fontWeight: 'bold' },
  delivered: { color: 'green' },
  pending: { color: 'orange' },
  cancelled: { color: 'red' },
  viewDetails: { color: '#0000FF', marginTop: 6, fontSize: 13, textDecorationLine: 'underline' },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statusText: { fontSize: 14, fontWeight: '500' },

  cancelBtn: {
    marginTop: 10,
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtnText: { color: '#fff', fontWeight: '600' },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalImage: { width: 100, height: 100, marginBottom: 10 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#555',
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  closeBtn: {
    marginTop: 12,
    backgroundColor: '#4A7F4B',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  logo: {
    width: '100%',
    height: 50,
    resizeMode: 'contain',
    alignSelf: 'left',
    marginBottom: 20,
    marginTop: 10,
  },
});