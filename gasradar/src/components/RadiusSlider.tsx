'use client';

import { useState } from 'react';

interface RadiusSliderProps {
  radius: number;
  onRadiusChange: (radius: number) => void;
  min: number;
  max: number;
}

export default function RadiusSlider({ radius, onRadiusChange, min, max }: RadiusSliderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = parseInt(e.target.value);
    onRadiusChange(newRadius);
  };

  // Preset radius options for quick selection
  const presetRadii = [5, 10, 15, 25];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 min-w-0">
      {/* Slider container */}
      <div className="flex items-center gap-3 min-w-0">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Search Radius:
        </label>
        
        <div className="flex items-center gap-3 min-w-[200px]">
          <span className="text-xs text-gray-500 w-8 text-center">{min}mi</span>
          
          <div className="relative flex-1">
            <input
              type="range"
              min={min}
              max={max}
              value={radius}
              onChange={handleChange}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((radius - min) / (max - min)) * 100}%, #e5e7eb ${((radius - min) / (max - min)) * 100}%, #e5e7eb 100%)`
              }}
            />
            
            {/* Custom slider styling */}
            <style jsx>{`
              .slider::-webkit-slider-thumb {
                appearance: none;
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: #3b82f6;
                border: 2px solid #ffffff;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                cursor: pointer;
              }
              
              .slider::-moz-range-thumb {
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: #3b82f6;
                border: 2px solid #ffffff;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                cursor: pointer;
              }
            `}</style>
          </div>
          
          <span className="text-xs text-gray-500 w-8 text-center">{max}mi</span>
        </div>
        
        {/* Current radius display */}
        <div className={`px-3 py-1 rounded-full text-sm font-bold transition-colors ${
          isDragging ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
        }`}>
          {radius} mi
        </div>
      </div>

      {/* Preset buttons */}
      <div className="flex gap-1">
        {presetRadii.map((preset) => (
          <button
            key={preset}
            onClick={() => onRadiusChange(preset)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              radius === preset
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {preset}mi
          </button>
        ))}
      </div>
    </div>
  );
}