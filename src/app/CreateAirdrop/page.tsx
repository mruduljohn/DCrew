"use client";
import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Interfaces for Airdrop Creation
interface AirdropLocation {
  latitude: number;
  longitude: number;
}

interface AirdropDetails {
  tokenAddress: string;
//   tokenName: string;
  totalAmount: number;
  maxPerUser: number;
  startDate: string;
  endDate: string;
  locations: AirdropLocation[];
  radius: number;
}

// Pin Placement Component
const PinPlacementMap: React.FC<{
  onLocationSelect: (locations: AirdropLocation[]) => void;
}> = ({ onLocationSelect }) => {
  const [pins, setPins] = useState<AirdropLocation[]>([]);
  const markerIcon = L.icon({
    iconUrl: '/icons/pin-icon.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38]
  });

  // Map Click Event Handler
  const MapClickHandler = () => {
    const map = useMapEvents({
      click: (e) => {
        const newLocation: AirdropLocation = {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng
        };
        
        // Prevent duplicate locations
        const isDuplicate = pins.some(
          pin => 
            pin.latitude === newLocation.latitude && 
            pin.longitude === newLocation.longitude
        );

        if (!isDuplicate) {
          const updatedPins = [...pins, newLocation];
          setPins(updatedPins);
          onLocationSelect(updatedPins);
        }
      }
    });
    
    return null;
  };

  // Remove Pin Handler
  const handleRemovePin = (indexToRemove: number) => {
    const updatedPins = pins.filter((_, index) => index !== indexToRemove);
    setPins(updatedPins);
    onLocationSelect(updatedPins);
  };
  const backgroundImage = "/bg/image.jpg";
  

  return (
    
    <div className="flex flex-col h-screen">
      <div className="flex-1 relative overflow-hidden">
        <div className="h-full w-full">
          <MapContainer 
            center={[40.7128, -74.0060]} 
            zoom={13} 
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <MapClickHandler />
            
            {pins.map((pin, index) => (
              <Marker
                key={`${pin.latitude}-${pin.longitude}`}
                position={[pin.latitude, pin.longitude]}
                icon={markerIcon}
                eventHandlers={{
                  click: () => handleRemovePin(index)
                }}
              />
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="bg-white p-4 shadow-lg border-t">
        <div className="max-h-32 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Selected Locations:</h3>
          {pins.map((pin, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span>
                Lat: {pin.latitude.toFixed(4)}, 
                Lng: {pin.longitude.toFixed(4)}
              </span>
              <button 
                onClick={() => handleRemovePin(index)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Airdrop Creation Component
const AirdropCreationPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [airdropDetails, setAirdropDetails] = useState<AirdropDetails>({
    tokenAddress: '',
    totalAmount: 0,
    maxPerUser: 0,
    startDate: '',
    endDate: '',
    locations: [],
    radius: 20 // default 20 meters
  });

  const backgroundImage = "/bg/image.jpg";
  // Form Validation
  const validateStep = () => {
    switch(step) {
      case 1:
        return airdropDetails.tokenAddress && 
               airdropDetails.totalAmount > 0;
      case 2:
        return airdropDetails.maxPerUser > 0 && 
               airdropDetails.startDate && 
               airdropDetails.endDate;
      case 3:
        return airdropDetails.locations.length > 0;
      default:
        return false;
    }
  };

  // Step Rendering
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          
          <div className="nes-field token-details-step mt-4">
            <h2>Token Details</h2>
            <input
              type="text"
              className='nes-input'
              placeholder="Token Contract Address"
              value={airdropDetails.tokenAddress}
              onChange={(e) => setAirdropDetails(prev => ({
                ...prev, 
                tokenAddress: e.target.value
              }))}
            />
            {/* <input
              type="text"
              placeholder="Token Name"
              value={airdropDetails.tokenName}
              onChange={(e) => setAirdropDetails(prev => ({
                ...prev, 
                tokenName: e.target.value
              }))}
            /> */}
            <h2 className='mt-4'>Total Airdrop Amount</h2>
            <input
              type="number"
              className='nes-input'
              placeholder="Total Airdrop Amount"
              value={airdropDetails.totalAmount}
              onChange={(e) => setAirdropDetails(prev => ({
                ...prev, 
                totalAmount: Number(e.target.value)
              }))}
            />
          </div>
        );
      
      case 2:
        return (
          <div className="mt-4 airdrop-rules-step">
            <h2>Maximum Tokens per User</h2>
            <input
              type="number"
              placeholder="Max Tokens per User"
              className='nes-input'
              value={airdropDetails.maxPerUser}
              onChange={(e) => setAirdropDetails(prev => ({
                ...prev, 
                maxPerUser: Number(e.target.value)
              }))}
            />
            <div>
              <label className='mt-4'>Start Date</label>
              <input
                type="date"
                className='nes-input'
                value={airdropDetails.startDate}
                onChange={(e) => setAirdropDetails(prev => ({
                  ...prev, 
                  startDate: e.target.value
                }))}
              />
            </div>
            <div>
              <label className='mt-4'>End Date</label>
              <input
                type="date"
                className='nes-input'
                value={airdropDetails.endDate}
                onChange={(e) => setAirdropDetails(prev => ({
                  ...prev, 
                  endDate: e.target.value
                }))}
              />
            </div>
            <label className='mt-4'>Airdrop Radius (meters)</label>
            <input
              type="number"
              placeholder="Airdrop Radius (meters)"
              className='nes-input'
              value={airdropDetails.radius}
              onChange={(e) => setAirdropDetails(prev => ({
                ...prev, 
                radius: Number(e.target.value)
              }))}
            />
          </div>
        );
      
      case 3:
        return (
          <div className="location-selection-step">
            <h2>Select Airdrop Locations</h2>
            <PinPlacementMap 
              onLocationSelect={(locations) => setAirdropDetails(prev => ({
                ...prev,
                locations
              }))}
            />
          </div>
        );
      
      case 4:
        return (
          
          <div className="review-step">
            <h2>Review Airdrop Details</h2>
            <div className='nes-container with-title'>
            <pre>{JSON.stringify(airdropDetails, null, 2)}</pre>

            </div>
            
          </div>
        );
      
      default:
        return null;
    }
  };

  // Navigation Handlers
  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, 4));
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handlePrevious = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    // Final submission logic
    console.log('Submitting Airdrop:', airdropDetails);
    // Integrate with backend/blockchain
  };

  return (
    <div
      className="h-screen w-screen flex flex-col justify-center items-center animate-backgroundMove relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
    <div className="airdrop-creation-container">
      <div className="mt-4 step-indicator">
        Step {step} of 4
      </div>
      
      
      {renderStep()}
      
      <div className="mt-4 navigation-buttons">
        {step > 1 && (
          <button className='nes-btn is-error' onClick={handlePrevious}>
            Previous
          </button>
        )}
        
        {step < 4 ? (
          <button onClick={handleNext} className='nes-btn is-success '>
            Next
          </button>
        ) : (
          <button className='nes-btn is-submit' onClick={handleSubmit}>
            Create Airdrop
          </button>
        )}
      </div>
    </div>
    </div>
  );
};

export default AirdropCreationPage;