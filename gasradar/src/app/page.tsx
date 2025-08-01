'use client';

import { useState, useEffect } from 'react';
import MapView from '@/components/MapView';
import RadiusSlider from '@/components/RadiusSlider';
import LocationSelector from '@/components/LocationSelector';

export interface GasStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  price: number;
  fuelType: string;
  updatedAt: string;
  address: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
}

export default function Home() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [gasStations, setGasStations] = useState<GasStation[]>([]);
  const [radius, setRadius] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchGasStations = async (location: UserLocation, searchRadius: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/gas-prices?lat=${location.lat}&lng=${location.lng}&radius=${searchRadius}`
      );
      if (response.ok) {
        const stations = await response.json();
        setGasStations(stations);
      }
    } catch (error) {
      console.error('Failed to fetch gas stations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userLocation) {
      fetchGasStations(userLocation, radius);
    }
  }, [userLocation, radius]);

  return (
    <main className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">⛽ GasRadar</h1>
          <div className="text-sm opacity-90">
            Find gas stations within {radius} miles
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="bg-white p-4 shadow-md border-b">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <LocationSelector 
            onLocationChange={setUserLocation}
            currentLocation={userLocation}
          />
          <RadiusSlider 
            radius={radius}
            onRadiusChange={setRadius}
            min={1}
            max={30}
          />
          {loading && (
            <div className="flex items-center text-blue-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
              Loading stations...
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {userLocation ? (
          <MapView 
            userLocation={userLocation}
            gasStations={gasStations}
            radius={radius}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">📍</div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Enable Location Access
              </h2>
              <p className="text-gray-500">
                Allow location access to find nearby gas stations
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <footer className="bg-white border-t p-3">
        <div className="flex justify-center items-center text-sm text-gray-600">
          {gasStations.length > 0 && (
            <div className="flex gap-6">
              <span>🏪 {gasStations.length} stations found</span>
              <span>💰 Best price: ${Math.min(...gasStations.map(s => s.price)).toFixed(2)}</span>
              <span>📍 Within {radius} miles</span>
            </div>
          )}
        </div>
      </footer>
    </main>
  );
}
