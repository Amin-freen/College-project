// A* algorithm implementation for accessible route planning
export function findAccessibleRoute(
  start: [number, number],
  end: [number, number],
  accessibilityFeatures: AccessibilityFeature[]
): RoutePoint[] {
  // This is a simplified version - in a real implementation, this would
  // connect to a routing service that considers accessibility features
  return [
    { lat: start[0], lng: start[1], instruction: "Start" },
    { lat: (start[0] + end[0]) / 2, lng: (start[1] + end[1]) / 2, instruction: "Continue straight" },
    { lat: end[0], lng: end[1], instruction: "Arrive at destination" },
  ];
}

export type RoutePoint = {
  lat: number;
  lng: number;
  instruction?: string;
  distance?: number;
  duration?: number;
};

export type AccessibilityPreference = AccessibilityFeature;

export type AccessibilityFeature = 
  | "ramp"
  | "elevator"
  | "handrails"
  | "braille"
  | "accessibleParking"
  | "accessibleRestroom"
  | "automaticDoors"
  | "alternativeEntrance"
  | "spacious"
  | "quiet"
  | "brightLighting"
  | "stopGapRamp"
  | "outdoorAccessOnly"
  | "signLanguage"
  | "digitalMenu"
  | "animalFriendly"
  | "scentFree"
  | "genderNeutralWashroom"
  | "largePrint"
  | "visualNotifications"
  | "quietEnvironment"
  | "simpleLayout"
  | "clearSignage";

export function getAccessibilityIcon(feature: AccessibilityFeature): string {
  const icons: Record<AccessibilityFeature, string> = {
    ramp: "ramp",
    elevator: "elevator",
    handrails: "handrails",
    braille: "braille",
    accessibleParking: "parking",
    accessibleRestroom: "toilet",
    automaticDoors: "door-open",
    alternativeEntrance: "door",
    spacious: "maximize",
    quiet: "volume-x",
    brightLighting: "sun",
    stopGapRamp: "stairs",
    outdoorAccessOnly: "tree",
    signLanguage: "hand",
    digitalMenu: "smartphone",
    animalFriendly: "paw",
    scentFree: "wind",
    genderNeutralWashroom: "users",
    largePrint: "zoom-in",
    visualNotifications: "bell",
    quietEnvironment: "volume-x",
    simpleLayout: "layout",
    clearSignage: "file-text"
  };
  
  return icons[feature] || "check";
}

export function parseAccessibilityFeatures(featuresJson: string | null): AccessibilityFeature[] {
  if (!featuresJson) return [];
  try {
    return JSON.parse(featuresJson) as AccessibilityFeature[];
  } catch (e) {
    console.error("Failed to parse accessibility features", e);
    return [];
  }
}

export function getAccessibilityScore(features: AccessibilityFeature[]): number {
  // Simple scoring algorithm - more features = higher score
  return Math.min(5, Math.ceil(features.length / 3));
}

export function getNearbyPlaces(lat: number, lng: number, radius: number = 1000): Promise<any[]> {
  // In a real implementation, this would fetch from OpenStreetMap API
  // For now, we'll return mock data
  return Promise.resolve([
    {
      id: 1,
      name: "Bistrograph",
      latitude: lat + 0.002,
      longitude: lng + 0.001,
      address: "Shastri Nagar, Adyar, Chennai, Tamil Nadu",
      accessibilityFeatures: JSON.stringify(["ramp", "accessibleRestroom"]),
      rating: 4.2,
      price: "Rs 150 per person",
      distance: 0.8
    },
    {
      id: 2,
      name: "Loyola Academy",
      latitude: lat - 0.001,
      longitude: lng + 0.002,
      address: "Nungambakkam, West Tambaram, Chennai",
      accessibilityFeatures: JSON.stringify(["ramp", "automaticDoors", "handrails"]),
      rating: 4.5,
      distance: 1.2
    },
    {
      id: 3,
      name: "Nirmal Eye Hospital",
      latitude: lat + 0.003,
      longitude: lng - 0.001,
      address: "Gandhi Road, Chennai",
      accessibilityFeatures: JSON.stringify(["elevator", "accessibleParking", "handrails"]),
      rating: 4.3,
      distance: 1.5
    }
  ]);
}

export function getPlaceDetails(placeId: number): Promise<any> {
  // In a real implementation, this would fetch from the database
  return Promise.resolve({
    id: placeId,
    name: "Loyola Academy",
    latitude: 13.0827,
    longitude: 80.2707,
    address: "Near Kishkintha, Raja Gopala Kandigai, Tharkas (Post) Erumaiyur, West Tambaram, Chennai - 600 044.",
    phone: "+91 9145604423",
    website: "www.loyola.edu.in",
    accessibilityFeatures: JSON.stringify(["ramp", "automaticDoors", "handrails"]),
    rating: 4.5,
    reviewCount: 28,
    accessibilityRating: 4.2
  });
}