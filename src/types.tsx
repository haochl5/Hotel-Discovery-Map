import { LucideIcon } from 'lucide-react';

// Hotel data interface
export interface Hotel {
  hotel_id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  star_rating: number;
  price_per_night: number;
  currency: string;
  rating: number;
  review_count: number;
  image_url: string;
  room_type: string;
  amenities: string[];
}

// Filter state interface
export interface Filters {
  priceRange: 'all' | 'budget' | 'mid' | 'luxury';
  minRating: number;
}

// Price range types
export type PriceRange = 'budget' | 'mid' | 'luxury';

// Price range configuration
export interface PriceRangeConfig {
  value: string;
  label: string;
  color: string;
}

// Amenity icon mapping
export interface AmenityIconMap {
  [key: string]: LucideIcon;
}

// Component prop interfaces
export interface HotelCardProps {
  hotel: Hotel;
}

export interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export interface StarRatingProps {
  rating: number;
  size?: number;
}

// Price range labels
export const PRICE_RANGE_LABELS = {
  budget: 'Budget Friendly',
  mid: 'Mid Range',
  luxury: 'Luxury'
} as const;

// Price range configurations for filters
export const PRICE_RANGE_OPTIONS: PriceRangeConfig[] = [
  { value: 'all', label: 'All Prices', color: '#6b7280' },
  { value: 'budget', label: 'Budget (<$800)', color: '#10B981' },
  { value: 'mid', label: 'Mid Range ($800-$1200)', color: '#F59E0B' },
  { value: 'luxury', label: 'Luxury (>$1200)', color: '#EF4444' }
];

// Amenity to emoji mapping
export const AMENITY_ICONS = {
  'WiFi': '📶',
  'Parking': '🚗',
  'Gym': '🏋️',
  'Pool': '🏊',
  'Restaurant': '🍽️',
  'Bar': '🍺',
  'Spa': '💆',
  'Business Center': '💼'
} as const;