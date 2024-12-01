import { useState, useEffect } from 'react';

interface LocationState {
  latitude: number;
  longitude: number;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      setError(error.message);
    };

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess, 
      handleError, 
      { 
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000 
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { location, error };
};