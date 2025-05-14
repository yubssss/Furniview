// ModelViewer.js
import React, { useRef } from 'react';
import { GLView } from 'expo-gl';
import { Asset } from 'expo-asset';
import * as THREE from 'three';
import { Renderer } from 'expo-three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function ModelViewer({ modelUrl }) {
  const glRef = useRef();

  // Function to set up the 3D scene
  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    
    // Create the scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;

    // Create the WebGL renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);

    // Set up lighting
    scene.add(new THREE.AmbientLight(0x404040, 2)); // Ambient light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    try {
      // Load the model asset
      const asset = Asset.fromModule(modelUrl);
      await asset.downloadAsync();
      
      const loader = new GLTFLoader();
      loader.load(
        asset.localUri || asset.uri,
        (gltf) => {
          const model = gltf.scene;

          // Traverse the model and apply simple materials
          model.traverse((child) => {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0xdddddd, // Light gray color
                roughness: 0.5,
                metalness: 0.5,
              });
              child.material.map = null; // Ignore any textures
            }
          });

          model.scale.set(0.5, 0.5, 0.5);
          scene.add(model);

          // Animation loop
          const render = () => {
            requestAnimationFrame(render);
            model.rotation.y += 0.01; // Rotate the model
            renderer.render(scene, camera);
            gl.endFrameEXP();
          };

          render();
        },
        undefined,
        (error) => {
          console.error('GLTFLoader error:', error);
        }
      );
    } catch (err) {
      console.error('Error loading model asset:', err);
    }
  };

  return (
    <GLView
      style={{ flex: 1 }}
      onContextCreate={onContextCreate}
      ref={glRef}
    />
  );
}