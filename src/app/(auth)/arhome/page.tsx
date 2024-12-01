"use client";

import React, { useEffect, useState } from 'react';

interface Airdrop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  reward: string;
}

const Page: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [nearbyAirdrops, setNearbyAirdrops] = useState<Airdrop[]>([]);
  const [renderableAirdrops, setRenderableAirdrops] = useState<Airdrop[]>([]);
  const [airdrops, setAirdrops] = useState<Airdrop[]>([
    { 
      id: '1', 
      name: 'Team DCrew Airdrop 1', 
      latitude: 12.979272, 
      longitude: 77.727549,
      reward: '100 DCREW Tokens'
    },
    { 
      id: '2', 
      name: 'Team DCrew Airdrop 2', 
      latitude: 12.979171, 
      longitude: 77.727667,
      reward: '150 DCREW Tokens'
    },
  ]);

  // Calculate distance between two geographical points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return distance * 1000; // Convert to meters
  };

  // Handle airdrop proximity and rendering
  useEffect(() => {
    if (!userLocation) return;

    // Find nearby airdrops (within 50 meters)
    const nearby = airdrops.filter(airdrop => {
      const distance = calculateDistance(
        userLocation.latitude, 
        userLocation.longitude, 
        airdrop.latitude, 
        airdrop.longitude
      );
      return distance <= 50;
    });

    setNearbyAirdrops(nearby);

    // Find rendereable airdrops (within 10 meters)
    const renderableDrops = nearby.filter(airdrop => {
      const distance = calculateDistance(
        userLocation.latitude, 
        userLocation.longitude, 
        airdrop.latitude, 
        airdrop.longitude
      );
      return distance <= 10;
    });

    // Trigger function when an airdrop is renderable
    if (renderableDrops.length > 0) {
      handleRenderableAirdrop(renderableDrops);
    }

    setRenderableAirdrops(renderableDrops);
  }, [userLocation, airdrops]);

  // Dummy function to be populated later for renderable airdrops
  const handleRenderableAirdrop = (airdrops: Airdrop[]) => {
    console.log('Renderable Airdrops:', airdrops);
    // TODO: Implement specific logic when an airdrop is renderable
    // This could include showing a notification, playing a sound, etc.
  };

  // Geolocation setup
  useEffect(() => {
    const getUserLocation = () => {
      if ('geolocation' in navigator) {
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            console.error('Error getting location:', error);
            alert('Unable to get location. Please enable GPS.');
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );

        // Clean up the geolocation watch when component unmounts
        return () => navigator.geolocation.clearWatch(watchId);
      } else {
        alert('Geolocation is not supported by your browser');
      }
    };

    getUserLocation();
  }, []);

  // HTML for AR rendering
  const htmlCode = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>Airdrop AR Scanner</title>
        <script src="https://aframe.io/releases/1.3.0/aframe.min.js"></script>
        <script src="https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js"></script>
        <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js"></script>
        <style>
          body { margin: 0; overflow: hidden; }
        </style>
      </head>
      <body>
        <a-scene
          vr-mode-ui="enabled: false"
          arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false;"
        >
          ${renderableAirdrops.map(airdrop => `
            <a-text
              value="${airdrop.name}\n${airdrop.reward}"
              look-at="[gps-camera]"
              scale="50 50 50"
              gps-entity-place="latitude: ${airdrop.latitude}; longitude: ${airdrop.longitude};"
              color="#000000"
            ></a-text>
          `).join('')}
          
          <a-camera gps-camera rotation-reader> </a-camera>
        </a-scene>
        <div id="debug-info" style="
          position: absolute; 
          top: 10px; 
          left: 10px; 
          color: white; 
          background: rgba(0,0,0,0.7); 
          padding: 10px;
          z-index: 1000;
        "></div>
        
        <script>
          window.addEventListener('load', () => {
            const debugInfo = document.getElementById('debug-info');
            const camera = document.querySelector('[gps-camera]');
            
            camera.addEventListener('gps-camera-update-position', (event) => {
              const userCoords = event.detail.position;
              debugInfo.innerHTML = \`
                Latitude: \${userCoords.latitude.toFixed(6)}<br>
                Longitude: \${userCoords.longitude.toFixed(6)}<br>
                Heading: \${event.detail.heading || 'N/A'}
              \`;
            });
          });
        </script>
      </body>
    </html>
  `;

  return (
    <div>
      <div 
        style={{
          position: 'absolute', 
          top: '10px', 
          left: '10px', 
          zIndex: 1000, 
          color: 'white',
          background: 'rgba(0,0,0,0.7)',
          padding: '10px'
        }}
      >
        {userLocation ? (
          <>
            <p>Nearby Airdrops:</p>
            {nearbyAirdrops.map(airdrop => {
              const distance = calculateDistance(
                userLocation.latitude, 
                userLocation.longitude, 
                airdrop.latitude, 
                airdrop.longitude
              );
              return (
                <p key={airdrop.id}>
                  {airdrop.name}: {distance.toFixed(2)}m away
                </p>
              );
            })}
          </>
        ) : (
          'Fetching location...'
        )}
      </div>
      <div dangerouslySetInnerHTML={{ __html: htmlCode }} />
    </div>
  );
};

export default Page;