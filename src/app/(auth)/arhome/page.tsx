"use client";

import React, { useEffect, useState } from 'react';
import { useWallet,InputTransactionData } from '@aptos-labs/wallet-adapter-react';
import { Provider, Network } from "aptos";
import { Types } from 'aptos';

interface Airdrop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  reward: string;
  imageUrl: string;
  renderType: 'image' | 'text';
  creatorAddress: string;
  amount: string;
}

interface CollectionStatus {
  isCollecting: boolean;
  message: string;
}

const Page: React.FC = () => {
  const provider = new Provider(Network.TESTNET); // or Network.MAINNET for production
    const { account, signAndSubmitTransaction } = useWallet();
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [nearbyAirdrops, setNearbyAirdrops] = useState<Airdrop[]>([]);
    const [renderableAirdrops, setRenderableAirdrops] = useState<Airdrop[]>([]);
    const [renderMode, setRenderMode] = useState<'lottie' | 'text'>('lottie');
    const [airdrops, setAirdrops] = useState<Airdrop[]>([
      { 
            id: '4', 
            name: 'Team DCrew Airdrop 4', 
            latitude: 12.979025, 
            longitude: 77.728035,
            reward: '450 DCREW Tokens',
            imageUrl: 'icons/music_logo.png', // Replace with actual Lottie URL
            renderType: 'image',
            creatorAddress: '0x1234567890123456789012345678901234567890',
            amount: '450 DCREW Tokens'
          },
          { 
            id: '5', 
            name: 'Team DCrew Airdrop 5', 
            latitude: 12.978735, 
            longitude: 77.727962,
            reward: '550 DCREW Tokens',
            imageUrl: 'icons/music_logo.png', // Replace with actual Lottie URL
            renderType: 'image',
            creatorAddress: '0x1234567890123456789012345678901234567890',
            amount: '550 DCREW Tokens'
          },
          { 
            id: '6', 
            name: 'Team DCrew Airdrop 6', 
            latitude: 12.978783, 
            longitude: 77.728152,
            reward: '650 DCREW Tokens',
            imageUrl: 'icons/music_logo.png', // Replace with actual Lottie URL
            renderType: 'image',
            creatorAddress: '0x1234567890123456789012345678901234567890',
            amount: '650 DCREW Tokens'
          },
          { 
              id: '7', 
              name: 'Team DCrew Airdrop 6', 
              latitude: 12.979232, 
              longitude: 77.728069,
              reward: '750 DCREW Tokens',
              imageUrl: 'icons/music_logo.png', // Replace with actual Lottie URL
              renderType: 'image',
              creatorAddress: '0x1234567890123456789012345678901234567890',
              amount: '750 DCREW Tokens'
            },
    ]);
    const [collectionStatus, setCollectionStatus] = useState<CollectionStatus>({
        isCollecting: false,
        message: ''
    });

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

    // Find renderable airdrops (within 10 meters)
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

  // Add this function to handle airdrop collection
  const collectAirdrop = async (airdrop: Airdrop) => {
    if (!account?.address) {
        setCollectionStatus({
            isCollecting: false,
            message: 'Please connect your wallet'
        });
        return;
    }

    try {
        setCollectionStatus({
            isCollecting: true,
            message: 'Collecting airdrop...'
        });

        const payload: InputTransactionData = {
            sender: account?.address,
            data: {
                function: "dcrew_address::dcrew_airdrop::claim_airdrop",
                typeArguments: [],
                functionArguments: [
                    airdrop.creatorAddress,
                    Math.floor(airdrop.latitude * 1e6),
                    Math.floor(airdrop.longitude * 1e6),
                    airdrop.amount
                ]
            }
        };

        const response = await signAndSubmitTransaction(payload);
        await provider.waitForTransaction(response.hash);

        setCollectionStatus({
            isCollecting: false,
            message: 'Successfully collected!'
        });

        // Remove collected airdrop from the list
        setAirdrops(prev => prev.filter(drop => drop.id !== airdrop.id));

    } catch (error: any) {
        setCollectionStatus({
            isCollecting: false,
            message: error.message || 'Failed to collect airdrop'
        });
    }
  };

  // Add collection button to renderable airdrops
  const renderCollectionButton = (airdrop: Airdrop) => {
    if (!renderableAirdrops.find(drop => drop.id === airdrop.id)) {
        return null;
    }

    return (
        <button
            onClick={() => collectAirdrop(airdrop)}
            disabled={collectionStatus.isCollecting}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
        >
            {collectionStatus.isCollecting ? 'Collecting...' : 'Collect Airdrop'}
        </button>
    );
  };

  // Updated HTML for AR rendering with Images
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
            <a-entity
              look-at="[gps-camera]"
              gps-entity-place="latitude: ${airdrop.latitude}; longitude: ${airdrop.longitude};"
            >
              <a-image 
                src="${airdrop.imageUrl}"
                scale="1 1 1"
                rotation="0 0 0"
                class="clickable"
                onclick="window.collectAirdrop('${airdrop.id}')"
              ></a-image>
              <a-text
                value="${airdrop.name}\n${airdrop.reward}\nClick to collect!"
                position="0 1 0"
                scale="0.5 0.5 0.5"
                align="center"
                color="#000000"
              ></a-text>
            </a-entity>
          `).join('')}
          
          <a-camera gps-camera rotation-reader> </a-camera>
        </a-scene>
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
      <div 
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(0,0,0,0.7)',
          padding: '10px',
          borderRadius: '8px',
          color: 'white'
        }}
      >
        {collectionStatus.message}
      </div>
      <div dangerouslySetInnerHTML={{ __html: htmlCode }} />
    </div>
  );
};

export default Page;