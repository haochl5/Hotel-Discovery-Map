import { LucideIcon } from 'lucide-react';

export interface Hotel {
  hotel_id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  star_rating: number;
  price_per_night: number | string;
  currency: string;
  rating: number;
  review_count: number;
  image_url: string;
  room_type: string;
  amenities: string[];
}

export interface Filters {
  priceRange: 'all' | 'budget' | 'mid' | 'luxury';
  minRating: number;
}

export type PriceRange = 'budget' | 'mid' | 'luxury';

export interface PriceRangeConfig {
  value: string;
  label: string;
  color: string;
}

export interface AmenityIconMap {
  [key: string]: LucideIcon;
}