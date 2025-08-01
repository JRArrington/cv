# ⛽ GasRadar

**Find nearby gas stations and compare prices with an interactive map interface**

GasRadar is a modern web application that helps users locate gas stations within a customizable radius (1-30 miles) and compare fuel prices in real-time. Built with Next.js, TypeScript, and Leaflet for a smooth, responsive experience.

## 🚀 Features

- **🗺️ Interactive Map**: Powered by Leaflet.js with OpenStreetMap tiles
- **📍 Location Services**: Auto-detect user location or manual address search
- **🎯 Radius Control**: Adjustable search radius from 1-30 miles with preset options
- **💰 Price Comparison**: Color-coded markers (green=cheap, red=expensive, yellow=average)
- **🏪 Station Details**: View station info, prices, addresses, and last update times
- **🧭 Navigation**: One-click directions via Google Maps
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **⚡ Real-time Updates**: Dynamic price fetching and station filtering

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet.js with React-Leaflet
- **Geolocation**: HTML5 Geolocation API
- **Geocoding**: OpenStreetMap Nominatim
- **API**: Next.js API Routes

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd gasradar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌟 How It Works

1. **Location Detection**: The app automatically requests your location or allows manual address entry
2. **Radius Selection**: Choose your search radius using the slider or preset buttons (5, 10, 15, 25 miles)
3. **Station Discovery**: View nearby gas stations on the interactive map
4. **Price Analysis**: Markers are color-coded based on price comparison to area average
5. **Station Details**: Click any marker to see detailed information and get directions

## 🎨 UI Components

### Core Components
- **MapView**: Main map container with Leaflet integration
- **LocationSelector**: Handles geolocation and address geocoding
- **RadiusSlider**: Interactive radius control with presets
- **StationPopup**: Detailed station information display

### Key Features
- **Smart Markers**: Color-coded gas station icons based on price comparison
- **User Location**: Special marker with pulsing animation
- **Search Radius**: Visual circle showing search area
- **Responsive Layout**: Optimized for all screen sizes

## 🔧 API Endpoints

### GET `/api/gas-prices`
Fetches gas stations within specified radius.

**Parameters:**
- `lat` (number): Latitude
- `lng` (number): Longitude  
- `radius` (number): Search radius in miles (1-30)

**Response:**
```json
[
  {
    "id": "station-1",
    "name": "Shell",
    "lat": 34.0522,
    "lng": -118.2437,
    "price": 4.59,
    "fuelType": "Regular",
    "updatedAt": "2025-01-01T10:30:00Z",
    "address": "123 Main St"
  }
]
```

## 🔮 Future Enhancements

- **Real API Integration**: Connect to GasBuddy or similar services
- **User Reports**: Allow users to submit price updates
- **Favorites**: Save frequently visited stations
- **Price Alerts**: Notify when prices drop below threshold
- **Fuel Types**: Support for Premium, Diesel, Electric charging
- **Historical Data**: Price trends and analytics
- **Route Planning**: Multi-stop fuel optimization

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

**Required APIs:**
- Geolocation API
- Fetch API
- WebGL (for map rendering)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Leaflet](https://leafletjs.com/) for the mapping library
- [OpenStreetMap](https://www.openstreetmap.org/) for map tiles
- [Nominatim](https://nominatim.org/) for geocoding services
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities

---

Built with ❤️ for finding the best gas deals near you!
