'use client';

import { useState, useEffect } from 'react';
import type { UserLocation } from '@/app/page';

interface LocationSelectorProps {
  onLocationChange: (location: UserLocation) => void;
  currentLocation: UserLocation | null;
}

export default function LocationSelector({ onLocationChange, currentLocation }: LocationSelectorProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Auto-locate on component mount
  useEffect(() => {
    getCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        onLocationChange(location);
        setIsLocating(false);
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        setLocationError(errorMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const geocodeAddress = async (address: string) => {
    if (!address.trim()) return;

    setIsGeocoding(true);
    setLocationError(null);

    try {
      // Using Nominatim (OpenStreetMap) geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const results = await response.json();
      
      if (results.length === 0) {
        setLocationError('Address not found. Please try a different address.');
        return;
      }

      const location = {
        lat: parseFloat(results[0].lat),
        lng: parseFloat(results[0].lon),
      };

      onLocationChange(location);
      setManualAddress('');
    } catch {
      setLocationError('Failed to find address. Please try again.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    geocodeAddress(manualAddress);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Current location button */}
      <button
        onClick={getCurrentLocation}
        disabled={isLocating}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          currentLocation 
            ? 'bg-green-100 text-green-700 border border-green-300' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        } ${isLocating ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLocating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            Locating...
          </>
        ) : currentLocation ? (
          <>
            ✅ Location Found
          </>
        ) : (
          <>
            📍 Use My Location
          </>
        )}
      </button>

      {/* Manual address input */}
      <form onSubmit={handleAddressSubmit} className="flex gap-2 flex-1 min-w-0">
        <input
          type="text"
          placeholder="Or enter an address..."
          value={manualAddress}
          onChange={(e) => setManualAddress(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          disabled={isGeocoding}
        />
        <button
          type="submit"
          disabled={!manualAddress.trim() || isGeocoding}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {isGeocoding ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            '🔍'
          )}
        </button>
      </form>

      {/* Error message */}
      {locationError && (
        <div className="text-red-600 text-sm mt-1 sm:mt-0 sm:ml-3">
          ⚠️ {locationError}
        </div>
      )}
    </div>
  );
}