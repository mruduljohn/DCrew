"use client";

import { useEffect } from 'react';
import Head from 'next/head';

const ARPage: React.FC = () => {
  useEffect(() => {
    console.log('AR.js Loaded');
  }, []);

  return (
    <div>
      <Head>
        {/* Import A-Frame */}
        <script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>

        {/* Import AR.js after ensuring THREE is globally available */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.THREE = AFRAME.THREE;`,
          }}
        />
        <script src="https://cdn.jsdelivr.net/gh/jeromeetienne/ar.js/aframe/build/aframe-ar.min.js"></script>
      </Head>

      <h1 style={{ textAlign: 'center', margin: '20px' }}>AR Airdrop Scanner</h1>

      {/* AR Scene */}
      <a-scene embedded arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;">
        {/* Marker Detection */}
        <a-marker preset="hiro">
          {/* 3D Coin Animation */}
          <a-entity
            geometry="primitive: sphere; radius: 0.5"
            material="color: gold; metalness: 0.8; roughness: 0.1"
            position="0 0.5 0"
            animation="property: rotation; to: 0 360 0; loop: true; dur: 5000"
          ></a-entity>
        </a-marker>

        {/* AR Camera */}
        <a-camera-static />
      </a-scene>
    </div>
  );
};

export default ARPage;
