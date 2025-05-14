import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const cardIcons = {
  visa: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png',
  mastercard: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png',
};

// Function to format the card number with spaces
const formatCardNumber = (number) => {
  const cleanedNumber = number.replace(/\s/g, ''); // Remove all spaces
  const formattedNumber = cleanedNumber.replace(/(\d{4})/g, '$1 ').trim(); // Add space after every 4 digits
  return formattedNumber;
};

export default function PaymentMethodScreen({ navigation, route }) {
  const { selectedMethod } = route.params || {};
  const [selected, setSelected] = useState(null);
  const [cards, setCards] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const storedCards = await AsyncStorage.getItem('paymentCards');
        if (storedCards) {
          setCards(JSON.parse(storedCards));
        }
      } catch (error) {
        console.error('Failed to load cards from AsyncStorage:', error);
      }
    };

    loadCards();
  }, []);

  useEffect(() => {
    // Save cards to AsyncStorage whenever the cards state changes
    const saveCards = async () => {
      try {
        await AsyncStorage.setItem('paymentCards', JSON.stringify(cards));
      } catch (error) {
        console.error('Failed to save cards to AsyncStorage:', error);
      }
    };

    saveCards();
  }, [cards]);

  // Add Card Modal State
  const [cardNumber, setCardNumber] = useState('');
  const [expire, setExpire] = useState('');
  const [cvv, setCvv] = useState('');

  const handleApply = useCallback(() => {
    navigation.navigate('Checkout', { paymentMethod: selected });
  }, [navigation, selected]);

  const handleCardPress = (card) => {
    setSelected(card);
  };

  const handleAddCard = useCallback(async () => {
    if (!cardNumber || !expire || !cvv) return;

    // Validate card number length and format
    const cleanedCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanedCardNumber.length !== 16) {
      alert('Card number must be 16 digits');
      return;
    }

    // Validate expiry date format
    const expireRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expireRegex.test(expire)) {
      alert('Expiry date must be in MM/YY format');
      return;
    }

    // Validate CVV length
    if (cvv.length !== 4) {
      alert('CVV must be 4 digits');
      return;
    }

    const brand = cardNumber.startsWith('5') ? 'mastercard' : 'visa';
    const last4 = cleanedCardNumber.slice(-4);
    const newCard = {
      id: Date.now(),
      brand,
      number: `**** **** **** ${last4}`,
    };

    // Update cards state and save to AsyncStorage
    setCards(prevCards => {
      const updatedCards = [...prevCards, newCard];
      return updatedCards;
    });
    setShowAddCard(false);
    setCardNumber('');
    setExpire('');
    setCvv('');
    setSelected(newCard);
  }, [cardNumber, expire, cvv, setCards, setSelected]);

  const handleCardNumberChange = (number) => {
    const formattedNumber = formatCardNumber(number);
    if (formattedNumber.length <= 19) {
      setCardNumber(formattedNumber);
    }
  };

  const handleExpireChange = (text) => {
    // Remove any non-numeric characters
    const cleanedText = text.replace(/[^0-9]/g, '');

    // Format the text as 00/00
    let formattedText = '';
    if (cleanedText.length > 0) {
      formattedText = cleanedText.slice(0, 2);
      if (cleanedText.length > 2) {
        formattedText += '/' + cleanedText.slice(2, 4);
      }
    }
    if (formattedText.length <= 5) {
      setExpire(formattedText);
    }
  };

  const handleCVVChange = (text) => {
    // Allow only numeric characters and limit to 4 characters
    const cleanedText = text.replace(/[^0-9]/g, '').slice(0, 4);
    setCvv(cleanedText);
  };

  const handleCancelAddCard = () => {
    setShowAddCard(false);
    setCardNumber('');
    setExpire('');
    setCvv('');
  };

  const handleDeleteCard = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (selected) {
      try {
        const updatedCards = cards.filter(card => card.id !== selected.id);
        setCards(updatedCards);

        // Update selected payment method
        if (selected.id === selectedMethod?.id) {
          if (updatedCards.length > 0) {
            setSelected(updatedCards[0]); // Select the first card
          } else {
            setSelected(null); // Select Cash on Delivery
          }
        } else {
          setSelected(null)
        }

        await AsyncStorage.setItem('paymentCards', JSON.stringify(updatedCards));
      } catch (error) {
        console.error('Failed to delete card:', error);
      } finally {
        setShowConfirmation(false);
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#4A7F4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Cash on Delivery */}
        <TouchableOpacity
          style={styles.codBox}
          onPress={() => setSelected(null)}
          activeOpacity={0.8}
        >
          <Text style={styles.codText}>Cash on Delivery</Text>
          <View style={styles.radioOuter}>
            {selected === null && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        {/* Saved Cards */}
        <Text style={styles.savedCardsLabel}>Saved Cards</Text>
        {cards.map(card => (
          <TouchableOpacity
            key={card.id}
            style={styles.cardBox}
            onPress={() => handleCardPress(card)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: cardIcons[card.brand] }} style={styles.cardIcon} />
            <Text style={styles.cardNumber}>{card.number}</Text>
            <View style={{ flex: 1 }} />
            <View style={styles.radioOuter}>
              {selected?.id === card.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Add New Card */}
        <TouchableOpacity style={styles.addCardBox} onPress={() => setShowAddCard(true)}>
          <Ionicons name="add" size={24} color="#4A7F4B" />
          <Text style={styles.addCardText}>Add New Card</Text>
        </TouchableOpacity>

        {/* Apply Button */}
        <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
          <Text style={styles.applyBtnText}>Apply</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteBtn, !selected && { opacity: 0.5 }]}
          onPress={handleDeleteCard}
          disabled={!selected}
        >
          <Text style={styles.deleteBtnText}>Delete Card</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Card Modal */}
      <Modal
        visible={showAddCard}
        animationType="fade" // Change animation type to fade
        transparent={true}
        onRequestClose={() => setShowAddCard(false)} // Handle back button press on Android
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add new card</Text>
            <View style={styles.inputCardRow}>
              <TextInput
                style={[styles.inputCard, { color: '#000' }]} // Set TextInput color
                placeholder="Card number"
                placeholderTextColor="#999" // Set placeholder text color
                keyboardType="number-pad"
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                maxLength={19}
              />
              {cardNumber.startsWith('5') ? (
                <Image source={{ uri: cardIcons.mastercard }} style={styles.inputCardIcon} />
              ) : cardNumber ? (
                <Image source={{ uri: cardIcons.visa }} style={styles.inputCardIcon} />
              ) : null}
            </View>
            <TextInput
              style={[styles.input, { color: '#000' }]} // Set TextInput color
              placeholder="Expire Date (MM/YY)"
              placeholderTextColor="#999" // Set placeholder text color
              value={expire}
              onChangeText={handleExpireChange}
              maxLength={5}
              keyboardType="number-pad"
            />
            <TextInput
              style={[styles.input, { color: '#000' }]} // Set TextInput color
              placeholder="CVV"
              placeholderTextColor="#999" // Set placeholder text color
              value={cvv}
              onChangeText={handleCVVChange}
              maxLength={4}
              secureTextEntry
              keyboardType="number-pad"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelAddCard}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addCardBtn} onPress={handleAddCard}>
                <Text style={styles.addCardBtnText}>Add Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      {/* Confirmation Modal */}
            {/* Confirmation Modal */}
            <Modal
        visible={showConfirmation}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationModal}>
            <Text style={styles.confirmationTitle}>Delete Card</Text>
            <Text style={styles.confirmationMessage}>Are you sure you want to delete this card?</Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={cancelDelete}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteConfirmBtn} onPress={confirmDelete}>
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F4F4F4',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#4A7F4B',
  },
  codBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  codText: { fontSize: 16, color: '#333', flex: 1 },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4A7F4B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#4A7F4B',
  },
  savedCardsLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  cardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardIcon: {
    width: 40,
    height: 25,
    marginRight: 12,
    resizeMode: 'contain',
  },
  cardNumber: { fontSize: 16, color: '#333' },
  addCardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 10,
  },
  addCardText: {
    fontSize: 16,
    color: '#4A7F4B',
    marginLeft: 8,
  },
  applyBtn: {
    backgroundColor: '#4A7F4B',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  applyBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteBtn: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  deleteBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4A7F4B',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  inputCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  inputCard: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  inputCardIcon: {
    width: 40,
    height: 25,
    marginLeft: 10,
    resizeMode: 'contain',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ddd',
    borderRadius: 8,
    marginRight: 10,
  },
  cancelBtnText: {
    fontSize: 16,
    color: '#333',
  },
  addCardBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4A7F4B',
    borderRadius: 8,
  },
  addCardBtnText: {
    fontSize: 16,
    color: '#fff',
  },
  confirmationModal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF6B6B',
  },
  confirmationMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmationButtons: {
    flexDirection: 'row',
  },
  deleteConfirmBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
  },
});
