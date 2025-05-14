import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HelpCenter({ navigation }) {
  const [activeTab, setActiveTab] = useState('FAQ');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [expandedQuestion, setExpandedQuestion] = useState(0);
  const [feedback, setFeedback] = useState('');

  const faqs = {
    General: [
      {
        question: 'What is FurniView?',
        answer: 'FurniView is a premium furniture marketplace offering modern home and office furniture designs.',
      },
      {
        question: 'How to use FurniView?',
        answer: 'You can browse products, view details, add to cart, and checkout easily within the app!',
      },
    ],
    Account: [
      {
        question: 'How do I create an account?',
        answer: 'You can sign up with your email address and password to start shopping.',
      },
      {
        question: 'How do I reset my password?',
        answer: 'Click on "Forgot Password" on the login screen and follow the instructions.',
      },
    ],
    Service: [
      {
        question: 'How can I track my order?',
        answer: 'You can view the status of your order in your account under "My Orders".',
      },
      {
        question: 'What should I do if my item is damaged?',
        answer: 'Please contact our support team within 7 days to process a return or exchange.',
      },
    ],
  };
  


  const toggleExpand = (index) => {
    if (expandedQuestion === index) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(index);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#4A7F4B" />
        </TouchableOpacity>
        <Text style={styles.title}>HELP CENTER</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab('FAQ')} style={styles.tab}>
          <Text style={[styles.tabText, activeTab === 'FAQ' && styles.activeTab]}>
            FAQ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Contact')} style={styles.tab}>
          <Text style={[styles.tabText, activeTab === 'Contact' && styles.activeTab]}>
            Contact Us
          </Text>
        </TouchableOpacity>
      </View>

      {/* Green Line Indicator */}
      <View style={styles.tabIndicatorContainer}>
        <View style={[styles.tabIndicator, activeTab === 'FAQ' ? { left: 0 } : { left: '50%' }]} />
      </View>

      {/* Category Buttons only visible on FAQ */}
      {activeTab === 'FAQ' && (
        <View style={styles.categoryContainer}>
          {['General', 'Account', 'Service'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                selectedCategory === cat && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Content Area */}
      <ScrollView contentContainerStyle={styles.content}>
  {activeTab === 'FAQ' ? (
    faqs[selectedCategory].map((item, index) => (
      <View key={index} style={styles.faqItem}>
        <TouchableOpacity
          style={styles.questionRow}
          onPress={() => toggleExpand(index)}
        >
          <Text style={styles.questionText}>{item.question}</Text>
          <Ionicons
            name={expandedQuestion === index ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#4A7F4B"
          />
        </TouchableOpacity>
        {expandedQuestion === index && (
          <Text style={styles.answerText}>{item.answer}</Text>
        )}
      </View>
    ))
  ) : (
    <View style={{ marginTop: 20 }}>
      {/* Contact Us form and company number */}
      <Text style={styles.contactTitle}>Send us your feedback</Text>
      <TextInput
        style={styles.feedbackInput}
        multiline
        numberOfLines={5}
        placeholder="Write your feedback here..."
        value={feedback}
        onChangeText={setFeedback}
      />
      <TouchableOpacity style={styles.submitBtn}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>

      <View style={styles.companyInfo}>
        <Text style={styles.companyText}>Company Hotline:</Text>
        <Text style={styles.companyPhone}>+63 912 345 6789</Text>
      </View>
    </View>
  )}
</ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8DAD5', paddingHorizontal: 20, paddingTop: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginLeft: 10, color: '#4A7F4B' },
  tabs: { flexDirection: 'row', justifyContent: 'center' },
  tab: { marginHorizontal: 20 },
  tabText: { fontSize: 16, color: '#777' },
  activeTab: { color: '#4A7F4B', fontWeight: 'bold' },
  tabIndicatorContainer: { flexDirection: 'row', marginTop: 8, height: 2 },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '50%',
    height: 2,
    backgroundColor: '#4A7F4B',
  },
  categoryContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 20 },
  categoryButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#4A7F4B',
  },
  categoryButtonActive: {
    backgroundColor: '#4A7F4B',
  },
  categoryText: {
    color: '#4A7F4B',
    fontWeight: 'bold',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#fff',
  },
  content: { paddingBottom: 50 },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    elevation: 2,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  answerText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A7F4B',
    marginBottom: 10,
  },
  feedbackInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    textAlignVertical: 'top',
    fontSize: 14,
    marginBottom: 15,
  },
  submitBtn: {
    backgroundColor: '#4A7F4B',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  companyInfo: {
    marginTop: 10,
    alignItems: 'center',
  },
  companyText: {
    fontSize: 16,
    color: '#333',
  },
  companyPhone: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A7F4B',
    marginTop: 5,
  },
});