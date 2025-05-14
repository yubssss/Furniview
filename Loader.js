import React, { useEffect } from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";

const Loader = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish(); // Ensure onFinish is defined and called
      }
    }, 3000); // 3 seconds splash screen duration

    return () => clearTimeout(timer); // Clean up the timer
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Image source={require("./assets/fvlogo.png")} style={styles.logo} />
      <ActivityIndicator size="large" color="#0a76d8" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 350,
    height: 350,
    marginBottom: -10,
  },
  loader: {
    marginTop: 20,
  },
});

export default Loader;
