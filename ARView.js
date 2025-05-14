// ARView.js
import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import { GLView } from 'expo-gl';
import { ExpoTHREE } from 'expo-three';
import * as THREE from 'three';
import { Asset } from 'expo-asset';
import { PinchGestureHandler, PanGestureHandler, State } from 'react-native-gesture-handler';

export default function ARView() {
  let arScene;
  const modelRef = useRef();

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState(new THREE.Vector3(0, 0, -3));

  const onPinchGestureEvent = (event) => {
    setScale(event.nativeEvent.scale);
  };

  const onPanGestureEvent = (event) => {
    const { translationX, translationY } = event.nativeEvent;
    modelRef.current.position.set(translationX / 100, -translationY / 100, modelRef.current.position.z);
  };

  const onGLContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: gl });

    const loader = new THREE.GLTFLoader();
    loader.load(
      Asset.fromModule(require('./assets/models/VanityTable.glb')).uri, // Your model path
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        modelRef.current = model;
        model.position.set(0, 0, -3);
      },
      undefined,
      (error) => {
        console.error('An error happened', error);
      }
    );

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    animate();
  };

  return (
    <View style={{ flex: 1 }}>
      <GLView
        style={{ flex: 1 }}
        onContextCreate={onGLContextCreate}
      />
      <PinchGestureHandler onGestureEvent={onPinchGestureEvent}>
        <PanGestureHandler onGestureEvent={onPanGestureEvent}>
          <View />
        </PanGestureHandler>
      </PinchGestureHandler>
    </View>
  );
}
