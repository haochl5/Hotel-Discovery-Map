import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { divIcon } from 'leaflet';
import { Star, MapPin, DollarSign, Users, Wifi, Car, Dumbbell, Waves, UtensilsCrossed, Wine, Flower2, Building } from 'lucide-react';
import { Hotel, Filters, PriceRange, AmenityIconMap } from '../types';
import hotelData from '../data/seattle_hotel_data.json';

// Custom marker icon based on price range
const createCustomIcon = (priceRange: PriceRange) => {
  const colors = {
    budget: '#10B981', // emerald-500
    mid: '#F59E0B',    // amber-500
    luxury: '#EF4444'  // red-500
  };
  
  return divIcon({
    html: `<div style="background-color: ${colors[priceRange]}; border: 3px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    className: 'custom-marker-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Get price range category
const getPriceRange = (price: number | string): PriceRange => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (numPrice < 800) return 'budget';
  if (numPrice < 1200) return 'mid';
  return 'luxury';
};

// Amenity icons mapping
const amenityIcons: AmenityIconMap = {
  'WiFi': Wifi,
  'Parking': Car,
  'Gym': Dumbbell,
  'Pool': Waves,
  'Restaurant': UtensilsCrossed,
  'Bar': Wine,
  'Spa': Flower2,
  'Business Center': Building
};

// Custom cluster icon
const createClusterCustomIcon = (cluster: any) => {
  return divIcon({
    html: `<div style="background-color: #3B82F6; color: white; border: 3px solid white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${cluster.getChildCount()}</div>`,
    className: 'custom-cluster-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

// Star rating component
interface StarRatingProps {
  rating: number;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 16 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={`${
            i < fullStars 
              ? 'fill-yellow-400 text-yellow-400' 
              : i === fullStars && hasHalfStar 
                ? 'fill-yellow-200 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-semibold">{rating}</span>
    </div>
  );
};

// Hotel card component for popup
interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  // Ensure price is a number for calculations
  const price = typeof hotel.price_per_night === 'string' 
    ? parseFloat(hotel.price_per_night) 
    : hotel.price_per_night;
  
  const priceRange = getPriceRange(price);
  const priceRangeLabels = {
    budget: 'Budget Friendly',
    mid: 'Mid Range',
    luxury: 'Luxury'
  };

  return (
    <div className="max-w-sm bg-white rounded-lg overflow-hidden">
      <div className="relative">
        <img 
          src={hotel.image_url} 
          alt={hotel.name}
          className="w-full h-32 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold text-white ${
          priceRange === 'budget' ? 'bg-emerald-500' :
          priceRange === 'mid' ? 'bg-amber-500' : 'bg-red-500'
        }`}>
          {priceRangeLabels[priceRange]}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg leading-tight">{hotel.name}</h3>
          <div className="flex">
            {[...Array(hotel.star_rating)].map((_, i) => (
              <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-gray-600 mb-2">
          <MapPin size={14} />
          <span className="text-sm">{hotel.address}</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <DollarSign size={16} className="text-green-600" />
            <span className="font-bold text-lg">${price}</span>
            <span className="text-gray-500 text-sm">/night</span>
          </div>
          <StarRating rating={hotel.rating} />
        </div>
        
        <div className="text-sm text-gray-600 mb-3">
          <div>{hotel.room_type}</div>
          <div className="flex items-center gap-1 mt-1">
            <Users size={14} />
            <span>{hotel.review_count} reviews</span>
          </div>
        </div>
        
        <div className="border-t pt-3">
          <h4 className="font-semibold text-sm mb-2">Amenities</h4>
          <div className="grid grid-cols-4 gap-2">
            {hotel.amenities.slice(0, 8).map((amenity, index) => {
              const IconComponent = amenityIcons[amenity];
              return (
                <div key={index} className="flex flex-col items-center text-xs">
                  {IconComponent && <IconComponent size={16} className="text-blue-600 mb-1" />}
                  <span className="text-center leading-tight">{amenity}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Filters component
interface FiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const FiltersComponent: React.FC<FiltersProps> = ({ filters, onFilterChange }) => {
  const priceRanges = [
    { value: 'all', label: 'All Prices', color: 'bg-gray-500' },
    { value: 'budget', label: 'Budget (<$800)', color: 'bg-emerald-500' },
    { value: 'mid', label: 'Mid Range ($800-$1200)', color: 'bg-amber-500' },
    { value: 'luxury', label: 'Luxury (>$1200)', color: 'bg-red-500' }
  ];

  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-4 max-w-xs">
      <h3 className="font-bold text-lg mb-3">Filter Hotels</h3>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Price Range</label>
        {priceRanges.map(range => (
          <label key={range.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="priceRange"
              value={range.value}
              checked={filters.priceRange === range.value}
              onChange={(e) => onFilterChange({ ...filters, priceRange: e.target.value as any })}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full ${range.color} ${filters.priceRange === range.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`} />
            <span className="text-sm">{range.label}</span>
          </label>
        ))}
      </div>
      
      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">Minimum Rating</label>
        <input
          type="range"
          min="7"
          max="9.5"
          step="0.1"
          value={filters.minRating}
          onChange={(e) => onFilterChange({ ...filters, minRating: parseFloat(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>7.0</span>
          <span className="font-medium">{filters.minRating}</span>
          <span>9.5</span>
        </div>
      </div>
    </div>
  );
};

// Main Hotel Discovery Map component
const HotelDiscoveryMap: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    priceRange: 'all',
    minRating: 7.0
  });

  // Filter hotels based on current filters
  const filteredHotels = (hotelData as Hotel[]).filter((hotel) => {
    // Ensure price_per_night is a number for comparison
    const price = typeof hotel.price_per_night === 'string' 
      ? parseFloat(hotel.price_per_night) 
      : hotel.price_per_night;
    
    const priceRange = getPriceRange(price);
    const matchesPrice = filters.priceRange === 'all' || priceRange === filters.priceRange;
    const matchesRating = hotel.rating >= filters.minRating;
    return matchesPrice && matchesRating;
  });

  // Seattle downtown center coordinates
  const center: [number, number] = [47.61322, -122.33582];

  return (
    <div className="relative w-full h-screen">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Seattle Hotel Discovery</h1>
            <p className="text-blue-100">Find the perfect hotel for your conference stay</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">{filteredHotels.length} hotels found</div>
            <div className="text-blue-200 text-sm">Downtown Seattle</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FiltersComponent filters={filters} onFilterChange={setFilters} />

      {/* Legend */}
      <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-4">
        <h4 className="font-bold text-sm mb-2">Price Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span>Budget (&lt;$800)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span>Mid Range ($800-$1200)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Luxury (&gt;$1200)</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="w-full h-full pt-20">
        <MapContainer
          center={center}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <MarkerClusterGroup
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={50}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
          >
            {filteredHotels.map((hotel: Hotel) => {
              const price = typeof hotel.price_per_night === 'string' 
                ? parseFloat(hotel.price_per_night) 
                : hotel.price_per_night;
              
              return (
                <Marker
                  key={hotel.hotel_id}
                  position={[hotel.latitude, hotel.longitude]}
                  icon={createCustomIcon(getPriceRange(price))}
                >
                  <Popup
                    maxWidth={350}
                    closeButton={true}
                    className="custom-popup"
                  >
                    <HotelCard hotel={hotel} />
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
};

export default HotelDiscoveryMap;