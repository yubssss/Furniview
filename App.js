// App.js
import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartProvider } from './CartContext';
import Cart from './Cart';
import Loader from './Loader';
import WelcomePage from './WelcomePage';
import LoginPage from './LoginPage';
import SignupScreen from './SignUp';
import ForgotPasswordScreen from './forgotpassword';
import HomePage from './HomeScreen';
import FavoritesScreen from './FavoritesScreen';
import ProfilePage from './ProfilePage';
import ProductDetails from './ProductDetails';
import ProductPage from './ProductPage1';
import Receipt from './Receipt';
import AddressScreen from './AddressScreen';
import PaymentMethodScreen from './PaymentMethodScreen';
import AddAddressScreen from './AddAddressScreen';
import EditAddressScreen from './EditAddressScreen';
import Checkout from './Checkout'
import CameraScreen from './CameraScreen';
import HelpCenter from './HelpCenter';
import EditProfile from './EditProfile';
import PrevOrder from './PrevOrder';
import ModelViewer from './ModelViewer';
import ModelViewerScreen from './ModelViewerScreen';

const Stack = createNativeStackNavigator();
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  // Show loader as a screen inside navigator
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>{isLoading ? (
              <Stack.Screen name="Splash">
                {() => <Loader onFinish={() => setIsLoading(false)} />}
              </Stack.Screen>
            ) : (
              <>
                <Stack.Screen name="WelcomePage" component={WelcomePage} />
                <Stack.Screen name="LoginPage" component={LoginPage} />
                <Stack.Screen name="SignUp" component={SignupScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                <Stack.Screen name="Home" component={HomePage} />
                <Stack.Screen name="Products" component={ProductPage} />
                <Stack.Screen name="Favorites" component={FavoritesScreen} />
                <Stack.Screen name="Profile" component={ProfilePage} />
                <Stack.Screen name="ProductDetails" component={ProductDetails} />
                <Stack.Screen name="Cart" component={Cart} />
                <Stack.Screen name="Checkout" component={Checkout} />
                <Stack.Screen name="Receipt" component={Receipt} />
                <Stack.Screen name="PaymentMethodScreen" component={PaymentMethodScreen} />
                <Stack.Screen name="AddressScreen" component={AddressScreen} />
                <Stack.Screen name="AddAddressScreen" component={AddAddressScreen} />
                <Stack.Screen name="EditAddressScreen" component={EditAddressScreen} />
                <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenter} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="PrevOrder" component={PrevOrder} />
      <Stack.Screen name="ModelViewer" component={ModelViewer} />
      <Stack.Screen name="ModelViewerScreen" component={ModelViewerScreen} />
              </>
            )}</Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </GestureHandlerRootView>
  );
}
