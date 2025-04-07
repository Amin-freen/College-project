export type Schema = {
  places: {
    id?: number;
    name: string;
    latitude: number;
    longitude: number;
    address?: string | null;
    phone?: string | null;
    website?: string | null;
    accessibilityFeatures?: string | null;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: string;
    updatedAt?: string;
  };
  accessibility_reviews: {
    id?: number;
    placeId: number;
    userId: string;
    rating: number;
    features?: string | null;
    comment?: string | null;
    createdAt?: string;
  };
  user_preferences: {
    userId: string;
    accessibilityPreferences: string;
    savedPlaces?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
};