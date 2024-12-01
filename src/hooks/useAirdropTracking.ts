import { useState, useEffect } from 'react';
import { calculateDistance } from '../utils/calculateDistance.ts';

interface Location {
  latitude: number;
  longitude: number;
}

export const useAirdropTracking = (
  currentLocation: Location | null,
  airdropLocations: Location[]
) => {
  const [nearbyAirdrops, setNearbyAirdrops] = useState<Location[]>([]);

  useEffect(() => {
    if (currentLocation && airdropLocations) {
      const nearby = airdropLocations.filter(airdrop => 
        calculateDistance(
          currentLocation.latitude, 
          currentLocation.longitude,
          airdrop.latitude, 
          airdrop.longitude
        ) <= 20 // 20 meters radius
      );

      setNearbyAirdrops(nearby);
    }
  }, [currentLocation, airdropLocations]);

  return nearbyAirdrops;
};