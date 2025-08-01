import { NextRequest, NextResponse } from 'next/server';

interface GasStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  price: number;
  fuelType: string;
  updatedAt: string;
  address: string;
}

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Generate mock gas station data around a location
function generateMockStations(centerLat: number, centerLng: number, radiusMiles: number): GasStation[] {
  const stations = [
    { name: 'Shell', brandColor: '#FFD100' },
    { name: 'Chevron', brandColor: '#0066CC' },
    { name: 'Exxon', brandColor: '#FF0000' },
    { name: 'BP', brandColor: '#00A651' },
    { name: 'Arco', brandColor: '#003366' },
    { name: 'Mobil', brandColor: '#FF0000' },
    { name: '76', brandColor: '#FF6600' },
    { name: 'Valero', brandColor: '#FF0000' },
    { name: 'Circle K', brandColor: '#FF0000' },
    { name: 'Speedway', brandColor: '#FF0000' },
  ];

  const mockStations: GasStation[] = [];
  const stationCount = Math.max(5, Math.min(20, Math.floor(radiusMiles * 2))); // More stations for larger radius

  for (let i = 0; i < stationCount; i++) {
    const station = stations[Math.floor(Math.random() * stations.length)];
    
    // Generate random position within the radius
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radiusMiles;
    
    // Convert distance and angle to lat/lng offset
    const latOffset = (distance / 69) * Math.cos(angle); // 1 degree lat ≈ 69 miles
    const lngOffset = (distance / (69 * Math.cos(centerLat * Math.PI / 180))) * Math.sin(angle);
    
    const stationLat = centerLat + latOffset;
    const stationLng = centerLng + lngOffset;
    
    // Generate realistic price (between $3.20 and $5.80)
    const basePrice = 4.20;
    const priceVariation = (Math.random() - 0.5) * 1.6; // ±$0.80 variation
    const price = Math.max(3.20, Math.min(5.80, basePrice + priceVariation));
    
    // Generate address
    const streetNumber = Math.floor(Math.random() * 9999) + 1;
    const streetNames = ['Main St', 'Oak Ave', 'Elm St', 'Park Blvd', 'First St', 'Broadway', 'Lincoln Ave', 'Washington St'];
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    const address = `${streetNumber} ${streetName}`;
    
    // Generate realistic update time (within last 24 hours)
    const hoursAgo = Math.floor(Math.random() * 24);
    const updatedAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
    
    mockStations.push({
      id: `station-${i}-${Date.now()}`,
      name: station.name,
      lat: stationLat,
      lng: stationLng,
      price: Math.round(price * 100) / 100, // Round to 2 decimal places
      fuelType: 'Regular',
      updatedAt,
      address,
    });
  }

  return mockStations;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lng = parseFloat(searchParams.get('lng') || '0');
  const radius = parseFloat(searchParams.get('radius') || '10');

  // Validate parameters
  if (!lat || !lng || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json(
      { error: 'Invalid latitude or longitude' },
      { status: 400 }
    );
  }

  if (radius <= 0 || radius > 30) {
    return NextResponse.json(
      { error: 'Radius must be between 1 and 30 miles' },
      { status: 400 }
    );
  }

  try {
    // In a real app, you would:
    // 1. Query a gas price database or API (like GasBuddy)
    // 2. Filter by radius using spatial queries
    // 3. Cache results for performance
    
    // For demo purposes, generate mock data
    const stations = generateMockStations(lat, lng, radius);
    
    // Filter stations by actual distance (in case our generation was slightly off)
    const stationsInRadius = stations.filter(station => {
      const distance = calculateDistance(lat, lng, station.lat, station.lng);
      return distance <= radius;
    });

    // Sort by price (cheapest first)
    stationsInRadius.sort((a, b) => a.price - b.price);

    // Add some artificial delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

    return NextResponse.json(stationsInRadius);
  } catch (error) {
    console.error('Error fetching gas stations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gas station data' },
      { status: 500 }
    );
  }
}