// Calculate distance between two geographic coordinates
export function calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    // Haversine Formula - Most accurate for short to medium distances
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
  
  // Alternative method with more detailed error handling
  export function calculateDistanceAdvanced(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    // Validate input coordinates
    if (!isValidCoordinate(lat1, lon1) || !isValidCoordinate(lat2, lon2)) {
      throw new Error('Invalid geographic coordinates');
    }
  
    // Spherical Law of Cosines - Alternative calculation method
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
  
    const distance = Math.acos(
      Math.sin(φ1) * Math.sin(φ2) + 
      Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)
    ) * R;
  
    return distance;
  }
  
  // Coordinate validation
  function isValidCoordinate(lat: number, lon: number): boolean {
    return (
      !isNaN(lat) && 
      !isNaN(lon) && 
      lat >= -90 && lat <= 90 && 
      lon >= -180 && lon <= 180
    );
  }
  
  // Utility interface for geographic point
  export interface GeoPoint {
    latitude: number;
    longitude: number;
  }
  
  // Distance calculation with GeoPoint interface
  export function calculateDistanceFromPoints(
    point1: GeoPoint, 
    point2: GeoPoint
  ): number {
    return calculateDistance(
      point1.latitude, 
      point1.longitude, 
      point2.latitude, 
      point2.longitude
    );
  }
  
  // Performance-optimized version for frequent calculations
  export function calculateDistanceFast(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
  
    // Simplified approximation - faster but slightly less accurate
    const x = Δλ * Math.cos((φ1 + φ2) / 2);
    const y = Δφ;
    
    return Math.sqrt(x * x + y * y) * 6371000;
  }
  
  // Practical usage example
  export function findNearestAirdrop(
    currentLocation: GeoPoint, 
    airdropLocations: GeoPoint[], 
    maxDistance: number = 20 // meters
  ): GeoPoint | null {
    let nearestAirdrop: GeoPoint | null = null;
    let minDistance = maxDistance;
  
    for (const airdrop of airdropLocations) {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        airdrop.latitude,
        airdrop.longitude
      );
  
      if (distance <= minDistance) {
        minDistance = distance;
        nearestAirdrop = airdrop;
      }
    }
  
    return nearestAirdrop;
  }