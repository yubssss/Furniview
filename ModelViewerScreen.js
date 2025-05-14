// ModelViewerScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import ModelViewer from './ModelViewer';

const { width } = Dimensions.get('window');

// Mapping of model names to their respective GLB files
const modelMapping = {
  'Vanity Table': require('./assets/models/VanityTable.glb'),
  'Coffee Table': require('./assets/models/CoffeeTable.glb'),
  'Computer Table': require('./assets/models/ComputerTable.glb'),
  'Dining Table': require('./assets/models/DiningTable.glb'),
  'Folding Table': require('./assets/models/FoldingTable.glb'),
  'Side Table': require('./assets/models/SideTable.glb'),
  'Sleeper Sofa': require('./assets/models/SleeperSofa.glb'),
  'Couch': require('./assets/models/Couch.glb'),
  'Gaming Chair': require('./assets/models/GamingChair.glb'),
  'Office Chair': require('./assets/models/OfficeChair.glb'),
  'Dining Chair': require('./assets/models/DiningChair.glb'),
  'Outdoor Chair': require('./assets/models/OutdoorChair.glb'),
  'Table Lamp': require('./assets/models/TableLamp.glb'),
  'Floor Lamp': require('./assets/models/FloorLamp.glb'),
  'Ceiling Light': require('./assets/models/Ceilinglight.glb'),
  'Pendant Light': require('./assets/models/PendantLight.glb'),
  'Wall Lamp': require('./assets/models/WallLamp.glb'),
  'Spotlight': require('./assets/models/Spotlight.glb'),
};

export default function ModelViewerScreen({ route, navigation }) {
  const modelName = route?.params?.modelName;
  const model = modelMapping[modelName];

  if (!modelName || !model) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          {modelName ? `Model "${modelName}" not found.` : 'No model selected.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ModelViewer modelUrl={model} />

      <TouchableOpacity 
        style={styles.viewARButton}
        onPress={() => navigation.navigate('CameraScreen', { modelName })}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>🔍 View in Your Room</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    position: 'relative',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFF',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
  },
  viewARButton: {
    position: 'absolute',
    bottom: 40,
    left: width * 0.1,
    width: width * 0.8,
    backgroundColor: '#1E88E5',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
