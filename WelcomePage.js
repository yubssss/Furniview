import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Image, ImageBackground, TouchableOpacity, Text, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function WelcomePage() {
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();
        console.log("Navigation Object:", navigation); 
    }, []);

    return (
        <ImageBackground source={require('./assets/backgroun2.png')} style={styles.background}>
            <View style={styles.container}>
                <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                    <Image source={require('./assets/furniview.png')} style={styles.fvImage} />
                    <Image source={require('./assets/chair.png')} style={styles.chairImage} />
                    <TouchableOpacity style={styles.button} onPress={() => {
                        console.log("Button Pressed, navigating to Login"); 
                        navigation.navigate('LoginPage');
                    }}>
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    fvImage: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    chairImage: {
        width: 300,
        height: 400,
        resizeMode: 'contain',
        marginTop: -30,
    },
    button: {
        marginTop: 30,
        backgroundColor: '#4A7F4B',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
