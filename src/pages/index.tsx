import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Map } from "@/components/Map";
import { SearchBar } from "@/components/SearchBar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { AccessibilityFilter } from "@/components/AccessibilityFilter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { PlaceCard } from "@/components/PlaceCard";
import { VoiceControl } from "@/components/VoiceControl";
import { NavigationPanel } from "@/components/NavigationPanel";
import { getNearbyPlaces, findAccessibleRoute, RoutePoint, AccessibilityFeature } from "@/lib/map-utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronUp, Mic, MapPin } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [showVoiceControl, setShowVoiceControl] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [route, setRoute] = useState<RoutePoint[]>([]);
  const [accessibilityFilters, setAccessibilityFilters] = useState<AccessibilityFeature[]>([]);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          loadNearbyPlaces(latitude, longitude);
        },
        (error) => {
          console.error("Error getting user location:", error);
          // Default to Chennai coordinates if location access is denied
          setUserLocation([80.2707, 13.0827]);
          loadNearbyPlaces(13.0827, 80.2707);
        }
      );
    }
  }, []);

  const loadNearbyPlaces = async (lat: number, lng: number) => {
    try {
      const places = await getNearbyPlaces(lat, lng);
      setNearbyPlaces(places);
    } catch (error) {
      console.error("Error loading nearby places:", error);
    }
  };

  const handleSearch = (query: string) => {
    // In a real implementation, this would search for places
    console.log("Searching for:", query);
  };

  const handleVoiceSearch = () => {
    setShowVoiceControl(true);
  };

  const handleVoiceCommand = (command: string) => {
    // In a real implementation, this would parse the command and take action
    console.log("Voice command:", command);
    setShowVoiceControl(false);
  };

  const handlePlaceSelect = (placeId: number) => {
    const place = nearbyPlaces.find(p => p.id === placeId);
    if (place) {
      setSelectedPlace(place);
      navigate(`/place-details/${placeId}`);
    }
  };

  const handleFilterChange = (features: AccessibilityFeature[]) => {
    setAccessibilityFilters(features);
    // In a real implementation, this would filter the places
  };

  const startNavigation = (place: any) => {
    if (userLocation && place) {
      const route = findAccessibleRoute(
        userLocation,
        [place.longitude, place.latitude],
        accessibilityFilters
      );
      setRoute(route);
      setShowNavigation(true);
    }
  };

  const NearbyPlacesContent = () => (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Nearby Places</h2>
        <Button variant="link" onClick={() => navigate("/nearby")}>
          See all
        </Button>
      </div>
      
      <AccessibilityFilter onFilterChange={handleFilterChange} />
      
      <div className="space-y-4 mt-4">
        {nearbyPlaces.map((place) => (
          <PlaceCard 
            key={place.id} 
            place={place} 
            onClick={handlePlaceSelect}
          />
        ))}
      </div>
    </div>
  );

  return (
    <main className="w-full min-h-screen flex flex-col relative bg-background">
      {/* Fixed Search Bar */}
      <div className="absolute top-4 left-0 right-0 z-10 px-4">
        <SearchBar 
          onSearch={handleSearch} 
          onVoiceSearch={handleVoiceSearch}
        />
      </div>
      
      {/* Map */}
      <div className="flex-1 w-full">
        <Map 
          center={userLocation || [80.2707, 13.0827]}
          onLocationSelect={(location) => setSelectedLocation(location)}
          markers={nearbyPlaces.map(place => ({
            id: place.id,
            position: [place.longitude, place.latitude],
            color: "#FF4136"
          }))}
          onMarkerClick={handlePlaceSelect}
          route={route.map(point => [point.lng, point.lat])}
        />
      </div>
      
      {/* Voice Control Modal */}
      {showVoiceControl && (
        <div className="absolute bottom-20 left-4 right-4 z-20">
          <VoiceControl 
            onCommand={handleVoiceCommand}
            onClose={() => setShowVoiceControl(false)}
          />
        </div>
      )}
      
      {/* Navigation Panel */}
      {showNavigation && selectedPlace && (
        <div className="absolute bottom-20 left-4 right-4 z-20">
          <NavigationPanel 
            route={route}
            destination={selectedPlace.name}
            distance={selectedPlace.distance || 1.5}
            duration={Math.ceil((selectedPlace.distance || 1.5) * 10)}
            onClose={() => setShowNavigation(false)}
          />
        </div>
      )}
      
      {/* Nearby Places Sheet/Drawer */}
      {isMobile ? (
        <Drawer>
          <DrawerTrigger asChild>
            <Button 
              variant="secondary" 
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 rounded-full shadow-lg flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              <span>Nearby Places</span>
              <ChevronUp className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Nearby Places</DrawerTitle>
            </DrawerHeader>
            <NearbyPlacesContent />
          </DrawerContent>
        </Drawer>
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="secondary" 
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 rounded-full shadow-lg flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              <span>Nearby Places</span>
              <ChevronUp className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[60vh]">
            <SheetHeader>
              <SheetTitle>Nearby Places</SheetTitle>
            </SheetHeader>
            <NearbyPlacesContent />
          </SheetContent>
        </Sheet>
      )}
      
      {/* Voice Search Button */}
      <Button 
        variant="secondary" 
        size="icon"
        className="absolute bottom-20 right-4 z-10 rounded-full shadow-lg"
        onClick={handleVoiceSearch}
      >
        <Mic className="h-5 w-5" />
      </Button>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
};

export default Index;