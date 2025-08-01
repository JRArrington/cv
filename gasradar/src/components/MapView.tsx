'use client';

import { useEffect, useRef, useState } from 'react';
import type { GasStation, UserLocation } from '@/app/page';

interface MapViewProps {
  userLocation: UserLocation;
  gasStations: GasStation[];
  radius: number;
}

export default function MapView({ userLocation, gasStations, radius }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [mapInstance, setMapInstance] = useState<unknown>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current) return;

    // Dynamically import Leaflet and React-Leaflet only on client side
    const initializeMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        
        // Fix for default markers in react-leaflet
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Initialize the map with Leaflet directly
        if (!mapRef.current) return;
        const map = L.map(mapRef.current).setView([userLocation.lat, userLocation.lng], 12);

        // Add the tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // User location marker
        const userIcon = L.divIcon({
          html: `
            <div style="
              background-color: #3b82f6;
              color: white;
              border-radius: 50%;
              width: 20px;
              height: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
            ">
              📍
            </div>
          `,
          className: 'user-location-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup('<strong>Your Location</strong>');

        // Search radius circle
        L.circle([userLocation.lat, userLocation.lng], {
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.1,
          radius: radius * 1609.34, // Convert miles to meters
          weight: 2,
        }).addTo(map);

        setMapInstance(map);

        return map;
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      if (mapInstance && typeof mapInstance === 'object' && 'remove' in mapInstance) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstance as any).remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, userLocation]);

  useEffect(() => {
    if (!mapInstance || !isClient) return;

    const updateMapContent = async () => {
      try {
        const L = (await import('leaflet')).default;
        
        // Clear existing gas station markers (keep user location and circle)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstance as any).eachLayer((layer: any) => {
          if (layer.options?.className === 'gas-station-marker') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (mapInstance as any).removeLayer(layer);
          }
        });

        // Calculate average price for color coding
        const avgPrice = gasStations.length > 0 
          ? gasStations.reduce((sum, station) => sum + station.price, 0) / gasStations.length
          : 0;

        // Add gas station markers
        gasStations.forEach((station) => {
          const isExpensive = station.price > avgPrice * 1.05;
          const isCheap = station.price < avgPrice * 0.95;
          
          const color = isCheap ? '#10b981' : isExpensive ? '#ef4444' : '#f59e0b';
          
          const gasIcon = L.divIcon({
            html: `
              <div style="
                background-color: ${color};
                color: white;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 12px;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              ">
                ⛽
              </div>
            `,
            className: 'gas-station-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          const formatLastUpdated = (dateString: string) => {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            
            if (diffHours < 1) return 'Updated recently';
            if (diffHours < 24) return `Updated ${diffHours}h ago`;
            return `Updated ${Math.floor(diffHours / 24)}d ago`;
          };

          const popupContent = `
            <div style="min-width: 250px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div>
                  <h3 style="font-weight: bold; font-size: 18px; margin: 0;">${station.name}</h3>
                  <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                    <span style="font-size: 20px; font-weight: bold; color: ${isCheap ? '#059669' : isExpensive ? '#dc2626' : '#d97706'};">
                      $${station.price.toFixed(2)}
                    </span>
                    <span style="font-size: 12px; color: #6b7280;">/${station.fuelType}</span>
                  </div>
                </div>
                <div style="padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: 500; ${isCheap ? 'background-color: #dcfce7; color: #166534;' : isExpensive ? 'background-color: #fef2f2; color: #b91c1c;' : 'background-color: #fef3c7; color: #92400e;'}">
                  ${isCheap ? 'Great Deal!' : isExpensive ? 'High Price' : 'Average Price'}
                </div>
              </div>
              
              <div style="font-size: 14px; color: #6b7280; margin-bottom: 12px;">
                📍 ${station.address}
              </div>
              
              <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid #f3f4f6;">
                <div style="font-size: 12px; color: #9ca3af;">
                  🕒 ${formatLastUpdated(station.updatedAt)}
                </div>
                <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}', '_blank')" style="background-color: #2563eb; color: white; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 500; border: none; cursor: pointer;">
                  🗺️ Directions
                </button>
              </div>
            </div>
          `;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          L.marker([station.lat, station.lng], { icon: gasIcon }).addTo(mapInstance as any)
            .bindPopup(popupContent);
        });

        // Update the radius circle
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstance as any).eachLayer((layer: any) => {
          if (layer instanceof L.Circle) {
            layer.setRadius(radius * 1609.34);
          }
        });

      } catch (error) {
        console.error('Failed to update map content:', error);
      }
    };

    updateMapContent();
  }, [gasStations, radius, mapInstance, isClient]);

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full"
      style={{ background: '#f8fafc' }}
    />
  );
}