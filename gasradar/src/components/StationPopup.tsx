'use client';

import type { GasStation } from '@/app/page';

interface StationPopupProps {
  station: GasStation;
  avgPrice: number;
  onDirections: (station: GasStation) => void;
}

export default function StationPopup({ station, avgPrice, onDirections }: StationPopupProps) {
  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Updated recently';
    if (diffHours < 24) return `Updated ${diffHours}h ago`;
    return `Updated ${Math.floor(diffHours / 24)}d ago`;
  };

  const getPriceColor = (price: number) => {
    if (price < avgPrice * 0.95) return 'text-green-600';
    if (price > avgPrice * 1.05) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getPriceBadge = (price: number) => {
    if (price < avgPrice * 0.95) return { text: 'Great Deal!', color: 'bg-green-100 text-green-800' };
    if (price > avgPrice * 1.05) return { text: 'High Price', color: 'bg-red-100 text-red-800' };
    return { text: 'Average Price', color: 'bg-yellow-100 text-yellow-800' };
  };

  const badge = getPriceBadge(station.price);

  return (
    <div className="p-3 min-w-[280px]">
      {/* Header with name and price */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{station.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-2xl font-bold ${getPriceColor(station.price)}`}>
              ${station.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">/{station.fuelType}</span>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
          {badge.text}
        </div>
      </div>

      {/* Address */}
      <div className="flex items-center text-sm text-gray-600 mb-3">
        <span className="mr-2">📍</span>
        <span>{station.address}</span>
      </div>

      {/* Footer with update time and directions */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          <span className="mr-1">🕒</span>
          {formatLastUpdated(station.updatedAt)}
        </div>
        <button
          onClick={() => onDirections(station)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-sm"
        >
          🗺️ Get Directions
        </button>
      </div>
    </div>
  );
}