import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import hotel data from JSON file
import hotelData from '../data/seattle_hotel_data.json';

// Import types and constants
import { 
  Hotel, 
  Filters, 
  HotelCardProps, 
  FilterPanelProps, 
  StarRatingProps,
  PRICE_RANGE_LABELS,
  PRICE_RANGE_OPTIONS,
  AMENITY_ICONS
} from '../types';

// Import component styles
import '../styles/HotelMap.css';

// Utility functions
const getPriceRange = (price: number): string => {
  if (price < 800) return 'budget';
  if (price < 1200) return 'mid';
  return 'luxury';
};

const createCustomMarker = (priceRange: string) => {
  const colors = {
    budget: '#10B981',
    mid: '#F59E0B',
    luxury: '#EF4444'
  };

  const color = colors[priceRange as keyof typeof colors] || colors.mid;

  return divIcon({
    html: `<div style="
      background-color: ${color}; 
      border: 3px solid white; 
      border-radius: 50%; 
      width: 20px; 
      height: 20px; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    className: 'custom-marker-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Create custom cluster icon - Smart clustering based on hotel count
const createSmartClusterIcon = (cluster: any) => {
  const childCount = cluster.getChildCount();
  
  // Simple clustering based on count (no hotel price access needed)
  let size, color;
  
  if (childCount < 3) {
    size = 35;
    color = '#3B82F6'; // Blue
  } else if (childCount < 6) {
    size = 45;
    color = '#F59E0B'; // Orange
  } else {
    size = 55;
    color = '#EF4444'; // Red
  }

  return divIcon({
    html: `<div style="
      background-color: ${color}; 
      color: white; 
      border: 3px solid white; 
      border-radius: 50%; 
      width: ${size}px; 
      height: ${size}px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-weight: bold; 
      font-size: ${size > 40 ? '16px' : '14px'};
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    ">${childCount}</div>`,
    className: 'custom-cluster-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

// Components (StarRating, HotelCard, FilterPanel - same as before)
const StarRating: React.FC<StarRatingProps> = ({ rating, size = 16 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, i) => (
        <span 
          key={i} 
          className="star"
          style={{ 
            color: i < fullStars ? '#fbbf24' : i === fullStars && hasHalfStar ? '#fbbf24' : '#e5e7eb',
            fontSize: `${size}px`
          }}
        >
          ⭐
        </span>
      ))}
      <span className="rating-value">{rating}</span>
    </div>
  );
};

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const priceRange = getPriceRange(hotel.price_per_night);

  return (
    <div className="hotel-card">
      <div className="hotel-image-container">
        <img 
          src={hotel.image_url} 
          alt={hotel.name}
          className="hotel-image"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className={`price-badge ${priceRange}`}>
          {PRICE_RANGE_LABELS[priceRange as keyof typeof PRICE_RANGE_LABELS]}
        </div>
      </div>
      
      <div className="hotel-card-content">
        <div className="hotel-header">
          <h3 className="hotel-name">{hotel.name}</h3>
          <div className="hotel-stars">
            {[...Array(hotel.star_rating)].map((_, i) => (
              <span key={i} className="star">⭐</span>
            ))}
          </div>
        </div>
        
        <div className="hotel-address">
          <span>📍</span>
          <span>{hotel.address}</span>
        </div>
        
        <div className="hotel-pricing">
          <div className="price-container">
            <span className="price-icon">💰</span>
            <span className="price-amount">${hotel.price_per_night}</span>
            <span className="price-period">/night</span>
          </div>
          <StarRating rating={hotel.rating} />
        </div>
        
        <div className="hotel-details">
          <div className="room-type">{hotel.room_type}</div>
          <div className="review-info">
            <span>👥</span>
            <span>{hotel.review_count} reviews</span>
          </div>
        </div>
        
        <div className="amenities-section">
          <h4 className="amenities-title">Amenities</h4>
          <div className="amenities-grid">
            {hotel.amenities.slice(0, 8).map((amenity, index) => (
              <div key={index} className="amenity-item">
                <span className="amenity-icon">
                  {AMENITY_ICONS[amenity as keyof typeof AMENITY_ICONS] || '✓'}
                </span>
                <span className="amenity-text">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="filter-panel">
      <h3 className="filter-title">Filter Hotels</h3>
      
      <div className="filter-section">
        <label className="filter-label">Price Range</label>
        {PRICE_RANGE_OPTIONS.map(range => (
          <label key={range.value} className="filter-option">
            <input
              type="radio"
              name="priceRange"
              value={range.value}
              checked={filters.priceRange === range.value}
              onChange={(e) => onFilterChange({ ...filters, priceRange: e.target.value as any })}
            />
            <div className={`filter-radio-button ${range.value} ${filters.priceRange === range.value ? 'active' : ''}`} />
            <span className="filter-option-text">{range.label}</span>
          </label>
        ))}
      </div>
      
      <div>
        <label className="filter-label">
          Minimum Rating: {filters.minRating}
        </label>
        <input
          type="range"
          min="7"
          max="9.5"
          step="0.1"
          value={filters.minRating}
          onChange={(e) => onFilterChange({ ...filters, minRating: parseFloat(e.target.value) })}
          className="rating-slider"
        />
        <div className="rating-range-labels">
          <span>7.0</span>
          <span>9.5</span>
        </div>
      </div>
    </div>
  );
};

// Main Component with Clustering
const ClusteredHotelMap: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    priceRange: 'all',
    minRating: 7.0
  });

  // Type assertion for imported JSON data
  const hotels = hotelData as Hotel[];
  
  // Debug log to verify import
  console.log('Imported hotel data with clustering:', hotels.length, 'hotels');

  const filteredHotels = hotels.filter((hotel) => {
    const priceRange = getPriceRange(hotel.price_per_night);
    const matchesPrice = filters.priceRange === 'all' || priceRange === filters.priceRange;
    const matchesRating = hotel.rating >= filters.minRating;
    return matchesPrice && matchesRating;
  });

  const center: [number, number] = [47.61322, -122.33582];

  return (
    <div className="hotel-map-container">
      {/* Header */}
      <div className="hotel-map-header">
        <div className="hotel-map-header-content">
          <div>
            <h1 className="hotel-map-title">Seattle Hotel Discovery</h1>
            <p className="hotel-map-subtitle">Find the perfect hotel for your conference stay • With Smart Clustering</p>
          </div>
          <div className="hotel-map-stats">
            <div className="hotel-count">{filteredHotels.length} hotels found</div>
            <div className="hotel-location">Downtown Seattle ({hotels.length} total)</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterPanel filters={filters} onFilterChange={setFilters} />

      {/* Enhanced Legend */}
      <div className="legend-panel">
        <h4 className="legend-title">Map Legend</h4>
        <div className="legend-items">
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ fontSize: '12px' }}>Hotel Prices:</strong>
          </div>
          <div className="legend-item">
            <div className="legend-color budget"></div>
            <span>Budget (&lt;$800)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color mid"></div>
            <span>Mid Range ($800-$1200)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color luxury"></div>
            <span>Luxury (&gt;$1200)</span>
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', color: '#6b7280' }}>
            <div><strong>Clusters:</strong> Numbers show hotel count</div>
            <div>🔵 Small (2-3 hotels)</div>
            <div>🟡 Medium (4-6 hotels)</div>
            <div>🔴 Large (7+ hotels)</div>
            <div>Click clusters to zoom in</div>
          </div>
        </div>
      </div>

      {/* Map with Clustering */}
      <div className="map-container">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Marker Cluster Group - This is where the magic happens! */}
          <MarkerClusterGroup
            iconCreateFunction={createSmartClusterIcon}
            maxClusterRadius={80}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            zoomToBoundsOnClick={true}
            spiderfyDistanceMultiplier={2}
            animateAddingMarkers={true}
          >
            {filteredHotels.map((hotel) => (
              <Marker
                key={hotel.hotel_id}
                position={[hotel.latitude, hotel.longitude]}
                icon={createCustomMarker(getPriceRange(hotel.price_per_night))}
              >
                <Popup maxWidth={370} closeButton={true}>
                  <HotelCard hotel={hotel} />
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
};

export default ClusteredHotelMap;