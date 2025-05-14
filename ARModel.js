// src/screens/ARModel.js
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ARModel = () => {
const model = useLoader(GLTFLoader, require('../assets/models/VanityTable.glb'));
  return (
    <Canvas style={{ flex: 1 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <primitive object={model.scene} scale={[0.1, 0.1, 0.1]} position={[0, 0, -1]} />
    </Canvas>
  );
};

export default ARModel;
