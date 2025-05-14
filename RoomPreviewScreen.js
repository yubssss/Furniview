import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, PanResponder, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const RoomPreviewScreen = ({ navigation, route }) => {
  const { furnitureImage } = route.params; // Get the furniture image from navigation params
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [scale, setScale] = useState(1);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      setPosition({
        x: gestureState.moveX - furnitureImage.width / 2,
        y: gestureState.moveY - furnitureImage.height / 2,
      });
    },
    onPanResponderRelease: () => {},
  });

  const handlePinch = (e) => {
    const pinch = e.nativeEvent.scale;
    setScale(scale * pinch);
  };

  return (
    <View style={styles.container}>
      {/* Static Room Background */}
      <Image
        source={require('./assets/backgroun2.png')} // Your room background image
        style={styles.roomBackground}
      />

      {/* Draggable and Scalable Furniture Image */}
      <View
        style={[
          styles.furnitureContainer,
          {
            left: position.x,
            top: position.y,
            transform: [{ scale }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Image
          source={furnitureImage}
          style={[styles.furnitureImage, { width: furnitureImage.width * scale, height: furnitureImage.height * scale }]}
          onPinch={handlePinch} // Pinch gesture to zoom
        />
      </View>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomBackground: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
    resizeMode: 'cover',
  },
  furnitureContainer: {
    position: 'absolute',
  },
  furnitureImage: {
    width: 200, // Default size, can be updated based on the furniture
    height: 200,
    resizeMode: 'contain',
  },
  backButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default RoomPreviewScreen;
