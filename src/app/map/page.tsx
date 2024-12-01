"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useGeolocation } from '../../hooks/useGeolocation';

// Custom marker icons
const createMarkerIcon = (type: 'user' | 'airdrop') => {
  return L.icon({
    iconUrl: type === 'user' 
      ? '/icons/user-location.png'
      : '/icons/airdrop-marker.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });
};

// Airdrop interface
interface Airdrop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  reward: number;
  distance?: number;
}

// Mock airdrop data (replace with actual API call)
const mockAirdrops: Airdrop[] = [
  {
    id: '1',
    name: 'Crypto Boost Airdrop',
    latitude: 40.7128,
    longitude: -74.0060,
    description: 'Exclusive token drop for early adopters',
    reward: 100
  },
  {
    id: '2',
    name: 'DeFi Revolution Drop',
    latitude: 40.7300,
    longitude: -73.9900,
    description: 'Participate in groundbreaking DeFi project',
    reward: 250
  }
];

// Location Finder Component
const LocationFinder: React.FC<{ 
  onLocationFound: (location: L.LatLng) => void 
}> = ({ onLocationFound }) => {
  useMapEvents({
    locationfound: (e) => {
      onLocationFound(e.latlng);
    },
    locationerror: (e) => {
      console.error('Location error:', e);
    }
  });
  return null;
};

const MapPage: React.FC = () => {
  const { location } = useGeolocation();
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);
  const [nearbyAirdrops, setNearbyAirdrops] = useState<Airdrop[]>([]);

  // Fetch and filter airdrops
  const fetchNearbyAirdrops = useCallback(() => {
    if (location) {
      const filtered = mockAirdrops.map(airdrop => {
        const distance = calculateDistance(
          location.latitude, 
          location.longitude, 
          airdrop.latitude, 
          airdrop.longitude
        );
        
        return {
          ...airdrop,
          distance: Math.round(distance)
        };
      }).filter(airdrop => airdrop.distance! <= 20000); // 20km radius

      setNearbyAirdrops(filtered);
    }
  }, [location]);

  useEffect(() => {
    fetchNearbyAirdrops();
  }, [fetchNearbyAirdrops]);

  // Handler for map location
  const handleLocationFound = (latlng: L.LatLng) => {
    setUserLocation(latlng);
  };

  // AR View Navigation
  const navigateToARView = (airdrop: Airdrop) => {
    // Implement navigation to AR view with airdrop details
    console.log('Navigate to AR View', airdrop);
  };

  return (
    <div className="map-page">
      <div className="map-container">
        {location && (
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={13}
            style={{ height: '100vh', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* User Location Marker */}
            {location && (
              <Marker
                position={[location.latitude, location.longitude]}
                icon={createMarkerIcon('user')}
              >
                <Popup>Your Current Location</Popup>
              </Marker>
            )}

            {/* Airdrop Markers */}
            {nearbyAirdrops.map((airdrop) => (
              <Marker
                key={airdrop.id}
                position={[airdrop.latitude, airdrop.longitude]}
                icon={createMarkerIcon('airdrop')}
              >
                <Popup>
                  <div className="airdrop-popup">
                    <h3>{airdrop.name}</h3>
                    <p>{airdrop.description}</p>
                    <p>Reward: {airdrop.reward} tokens</p>
                    <p>Distance: {airdrop.distance} meters</p>
                    <button 
                      onClick={() => navigateToARView(airdrop)}
                      className="ar-view-button"
                    >
                      Enter AR View
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            <LocationFinder onLocationFound={handleLocationFound} />
          </MapContainer>
        )}
      </div>

      {/* Airdrop List Sidebar */}
      <div className="airdrops-list">
        <h2>Nearby Airdrops</h2>
        {nearbyAirdrops.map((airdrop) => (
          <div key={airdrop.id} className="airdrop-list-item">
            <h3>{airdrop.name}</h3>
            <p>Distance: {airdrop.distance} meters</p>
            <p>Reward: {airdrop.reward} tokens</p>
            <button onClick={() => navigateToARView(airdrop)}>
              View in AR
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapPage;

// Utility function for distance calculation (from previous implementation)
function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}