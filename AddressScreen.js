import React, { useState, useCallback, useEffect } from 'react';
import { View, Text,TouchableOpacity,StyleSheet,FlatList, Dimensions,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const STORAGE_KEY = 'addresses';
const SELECTED_ADDRESS_KEY = 'selectedAddressId';

const AddressScreen = ({ navigation, route }) => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    useEffect(() => {
        const loadAddresses = async () => {
            try {
                const storedAddresses = await AsyncStorage.getItem(STORAGE_KEY);
                if (storedAddresses !== null) {
                    setAddresses(JSON.parse(storedAddresses));
                } else {
                    setAddresses([
                        {
                            id: '1',
                            name: 'Chris Braun',
                            phone: '+63(2)3735052',
                            address: '11-A Miller Avenue, Barangay Bungad, Quezon City',
                            isDefault: true,
                        },
                    ]);
                }
            } catch (error) {
                console.error('Failed to load addresses from AsyncStorage', error);
            }
        };

        const loadSelectedAddress = async () => {
            try {
                const storedSelectedAddressId = await AsyncStorage.getItem(SELECTED_ADDRESS_KEY);
                if (storedSelectedAddressId !== null) {
                    setSelectedAddressId(storedSelectedAddressId);
                }
            } catch (error) {
                console.error('Failed to load selected address ID from AsyncStorage', error);
            }
        };

        loadAddresses();
        loadSelectedAddress();
    }, []);

    useEffect(() => {
        const saveAddresses = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
            } catch (error) {
                console.error('Failed to save addresses to AsyncStorage', error);
            }
        };

        const saveSelectedAddress = async () => {
            try {
                if (selectedAddressId !== null) {
                    await AsyncStorage.setItem(SELECTED_ADDRESS_KEY, selectedAddressId);
                } else {
                    await AsyncStorage.removeItem(SELECTED_ADDRESS_KEY);
                }
            } catch (error) {
                console.error('Failed to save selected address ID to AsyncStorage', error);
            }
        };

        saveAddresses();
        saveSelectedAddress();
    }, [addresses, selectedAddressId]);

    useEffect(() => {
        // Check if there's a selected address passed from Checkout
        if (route.params?.selectedAddress) {
            setSelectedAddressId(route.params.selectedAddress.id);
        }
    }, [route.params?.selectedAddress]);

    const handleAddressSelect = (id) => {
        setSelectedAddressId(id);
    };

    const updateAddress = useCallback((updatedAddress) => {
        setAddresses(prevAddresses =>
            prevAddresses.map(addr =>
                addr.id === updatedAddress.id ? updatedAddress : addr
            )
        );
    }, []);

    const deleteAddress = useCallback((addressId) => {
        setAddresses(prevAddresses =>
            prevAddresses.filter(addr => addr.id !== addressId)
        );
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <TouchableOpacity
                style={[
                    styles.addressCard,
                    item.id === selectedAddressId && styles.selectedAddressCard,
                ]}
                onPress={() => handleAddressSelect(item.id)}
            >
                <View style={styles.addressContent}>
                    <View>
                        <Text style={styles.addressName}>{item.name}</Text>
                        <Text style={styles.addressPhone}>{item.phone}</Text>
                        <Text style={styles.addressText}>{item.address}</Text>
                    </View>
                </View>
                <View style={styles.radioOuter}>
                    {item.id === selectedAddressId && <View style={styles.radioInner} />}
                </View>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditAddressScreen', { address: item, updateAddress: updateAddress, deleteAddress: deleteAddress })}
                >
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    );

    const addAddress = useCallback((newAddress) => {
        setAddresses(prevAddresses => [...prevAddresses, newAddress]);
    }, []);

    const handleApply = useCallback(() => {
        if (selectedAddressId) {
            const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
            navigation.navigate('Checkout', {
                ...route.params, // Pass all existing parameters
                selectedAddress: selectedAddress, // Override selectedAddress
            });
        } else {
            navigation.navigate('Checkout', {
                ...route.params, // Pass all existing parameters
                selectedAddress: null, // Pass null if no address is selected
            });
        }
    }, [navigation, selectedAddressId, addresses, route.params]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#4A7F4B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Address</Text>
                <View style={{ width: 28 }} />
            </View>

            <FlatList
                data={addresses}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                style={styles.list}
                ListFooterComponent={() => (
                    <View style={styles.footerContainer}>
                        <TouchableOpacity
                            style={styles.addAddressButton}
                            onPress={() => navigation.navigate('AddAddressScreen', { addAddress: addAddress })}
                        >
                            <Ionicons name="add" size={24} color="#4A7F4B" />
                            <Text style={styles.addAddressText}>Add New Address</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                            <Text style={styles.applyButtonText}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
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
    list: {
        flex: 1,
        paddingHorizontal: 20,
    },
    itemContainer: {
        width: '100%',
        alignItems: 'center',
    },
    addressCard: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
        width: '99%',
    },
    selectedAddressCard: {
        borderColor: '#4A7F4B',
    },
    addressContent: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    addressName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    addressPhone: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
    },
    addressText: {
        fontSize: 14,
        color: '#555',
    },
    editButton: {
        fontSize: 14,
        color: '#4A7F4B',
        fontWeight: 'bold',
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    radioOuter: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#4A7F4B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4A7F4B',
    },
    addAddressButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#4A7F4B',
        borderRadius: 10,
        padding: 16,
        marginHorizontal: '0.5%',
        marginBottom: 16,
        width: '99%',
    },
    addAddressText: {
        color: '#4A7F4B',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 6,
    },
    applyButton: {
        backgroundColor: '#4A7F4B',
        borderRadius: 999,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: '0.5%',
        marginBottom: 30,
        width: '99%',
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerContainer: {
        paddingHorizontal: 0,
        alignItems: 'center',
    }
});

export default AddressScreen;