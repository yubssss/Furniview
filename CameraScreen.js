import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { GLView } from 'expo-gl';
import { Asset } from 'expo-asset';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import {
  GestureHandlerRootView,
  PinchGestureHandler,
  PanGestureHandler,
  RotationGestureHandler,
} from 'react-native-gesture-handler';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons'; // for icons

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

const useModel = (modelName) => {
  const [modelUri, setModelUri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (modelName) {
      const asset = Asset.fromModule(modelMapping[modelName]);
      asset.downloadAsync()
        .then(() => {
          setModelUri(asset.localUri || asset.uri);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error downloading model:', error);
          setLoading(false); // Ensure loading stops even in case of error
        });
    }
  }, [modelName]);

  return { modelUri, loading };
};

export default function CameraScreen({ route, navigation }) {
  const cameraRef = useRef(null);
  const modelName = route?.params?.modelName;
  const { modelUri, loading } = useModel(modelName);
  const [permission, requestPermission] = useCameraPermissions();

  const modelRef = useRef();
  const pinchScale = useSharedValue(1);
  const panX = useSharedValue(0);
  const panY = useSharedValue(0);
  const rotationDeg = useSharedValue(0);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission]);

  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    gl.clearColor(0, 0, 0, 0);

    scene.add(new THREE.AmbientLight(0x404040, 2));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    if (!modelUri) return;

    const loader = new GLTFLoader();
    loader.load(
      modelUri,
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);
        scene.add(model);
        modelRef.current = model;

        const render = () => {
          requestAnimationFrame(render);
          model.rotation.set(rotationDeg.value, rotationDeg.value, 0);
          model.scale.set(pinchScale.value, pinchScale.value, pinchScale.value);
          model.position.set(panX.value, panY.value, 0);
          renderer.render(scene, camera);
          gl.endFrameEXP();
        };

        render();
      },
      undefined,
      (error) => console.error('GLTFLoader error:', error)
    );
  };

  const onPinchGestureEvent = (event) => {
    pinchScale.value = withSpring(event.nativeEvent.scale);
  };

  const onPanGestureEvent = (event) => {
    panX.value = withSpring(event.nativeEvent.translationX / 100);
    panY.value = withSpring(-event.nativeEvent.translationY / 100);
  };

  const onRotateGestureEvent = (event) => {
    rotationDeg.value = withSpring(rotationDeg.value + event.nativeEvent.rotation / 100);
  };

  if (permission === null) return <View />;
  if (!permission.granted) return <Text>No access to camera</Text>;

  return (
    <GestureHandlerRootView style={styles.container}>
      <CameraView style={StyleSheet.absoluteFill} facing="back" ref={cameraRef} />

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#fff" />
      ) : (
        modelUri && (
          <GLView
            style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]}
            onContextCreate={onContextCreate}
          />
        )
      )}

      <PinchGestureHandler onGestureEvent={onPinchGestureEvent}>
        <PanGestureHandler onGestureEvent={onPanGestureEvent}>
          <RotationGestureHandler onGestureEvent={onRotateGestureEvent}>
            <Animated.View style={styles.overlay} />
          </RotationGestureHandler>
        </PanGestureHandler>
      </PinchGestureHandler>

      <View style={styles.uiContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modelName}>{modelName}</Text>
        </View>

        <View style={styles.bottomPanel}>
          <Text style={styles.instructionText}>Pinch, rotate, and drag to place your furniture</Text>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  uiContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 50,
  },
  modelName: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  bottomPanel: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  instructionText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});
