# Seattle Hotel Discovery Map

An interactive hotel discovery platform for conference attendees in downtown Seattle. Built with React, TypeScript, and Leaflet for an optimal user experience.

For Best experience, please use a Desktop Browser.

## 🌟 Features

- **Interactive Map**: Powered by Leaflet with smooth pan and zoom
- **Smart Clustering**: Visual clustering for nearby hotels with custom cluster icons
- **Rich Hotel Cards**: Detailed popups with images, pricing, ratings, and amenities
- **Advanced Filtering**: Filter by price range and minimum rating
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, professional design with intuitive navigation

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Mapping**: Leaflet + React-Leaflet
- **Clustering**: React-Leaflet-Cluster
- **Styling**: Tailwind CSS + Custom CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/haochl5/Hotel-Discovery-Map.git
   cd Hotel-Discovery-Map
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Visit `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
seattle-hotel-discovery/
├── src/
│   ├── components/
│   │   └── FinalHotelDiscoveryMap.tsx   # Clean component (no inline styles/types)
│   ├── data/
│   │   └── seattle_hotel_data.json      # Hotel dataset (clean JSON)
│   ├── styles/                          # Organized CSS files
│   │   ├── HotelMap.css                 # Component-specific styles (NEW)
│   │   ├── leaflet-custom.css           # Leaflet map customizations
│   │   └── components.css               # Global component styles
│   ├── types.tsx                        # All TypeScript definition
│   ├── App.tsx                          # Main app component
│   ├── main.tsx                         # Entry point
│   └── index.css                        # Global styles and imports
├── .gitignore                           # Git ignore rules
├── package.json                         # Dependencies and scripts
├── package-lock.json                    # Exact dependency versions (auto-generated)
├── vite.config.ts                       # Vite configuration
├── tsconfig.json                        # TypeScript configuration
├── tailwind.config.js                   # Tailwind CSS configuration
├── index.html                           # HTML template
└── README.md                            # Project documentation
```

## 🎯 Key Components

### HotelDiscoveryMap
The main component containing:
- Interactive map with Leaflet
- Marker clustering functionality
- Hotel filtering system
- Custom marker icons based on price ranges

### HotelCard
Rich popup component displaying:
- Hotel images and basic info
- Star ratings and review counts
- Price per night
- Available amenities with icons
- Room type information

### Filtering System
- Price range filters (Budget, Mid Range, Luxury)
- Minimum rating slider
- Real-time filter updates

## 🎨 Design Decisions

### Mapping Library Choice: Leaflet
- **Free and open-source**: No API keys or usage limits
- **Excellent clustering support**: Smooth performance with many markers
- **Highly customizable**: Easy to style and extend
- **Future-proof**: Strong ecosystem for adding features

### Price Range Color Coding
- 🟢 **Green**: Budget-friendly (<$800)
- 🟡 **Amber**: Mid-range ($800-$1200)
- 🔴 **Red**: Luxury (>$1200)

### User Experience Enhancements
- Loading spinner for better perceived performance
- Responsive design for mobile users
- Intuitive filter controls
- Professional gradient header
- Smooth animations and transitions

## 📊 Data Structure

### Hotel Data (`src/data/seattle_hotel_data.json`)
```json
{
  "hotel_id": 1,
  "name": "Four Seasons Hotel Seattle",
  "latitude": 47.60763,
  "longitude": -122.33941,
  "address": "99 Union Street",
  "star_rating": 5,
  "price_per_night": 1999,
  "currency": "USD",
  "rating": 9,
  "review_count": 828,
  "image_url": "https://...",
  "room_type": "Room, 1 King Bed, Non Smoking (Seattle View)",
  "amenities": ["WiFi", "Parking", "Gym", "Pool", "Restaurant", "Bar", "Spa", "Business Center"]
}
```

## 🚀 Deployment

### Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   npm run build
   vercel --prod --public
   ```

## 🔧 Configuration

### Customization
- Modify hotel data in `src/data/hotels.json`
- Adjust map center coordinates in `HotelDiscoveryMap.tsx`
- Customize colors and styling in `src/index.css`

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📧 Contact

For questions or support, reach out to [haochl5@cs.washington.edu]

---

Built with ❤️ for the Seattle conference community
