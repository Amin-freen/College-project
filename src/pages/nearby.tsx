import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaceCard } from "@/components/PlaceCard";
import { BottomNavigation } from "@/components/BottomNavigation";
import { AccessibilityFilter } from "@/components/AccessibilityFilter";
import { getNearbyPlaces, AccessibilityFeature } from "@/lib/map-utils";
import { ArrowLeft, Search, Filter } from "lucide-react";

export default function Nearby() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState<any[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [accessibilityFilters, setAccessibilityFilters] = useState<AccessibilityFeature[]>([]);

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        // Get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const nearbyPlaces = await getNearbyPlaces(latitude, longitude);
              setPlaces(nearbyPlaces);
              setFilteredPlaces(nearbyPlaces);
              setLoading(false);
            },
            (error) => {
              console.error("Error getting user location:", error);
              // Default to Chennai coordinates if location access is denied
              getNearbyPlaces(13.0827, 80.2707).then((places) => {
                setPlaces(places);
                setFilteredPlaces(places);
                setLoading(false);
              });
            }
          );
        }
      } catch (error) {
        console.error("Error loading nearby places:", error);
        setLoading(false);
      }
    };

    loadPlaces();
  }, []);

  useEffect(() => {
    // Filter places based on search query and accessibility filters
    let filtered = places;
    
    if (searchQuery) {
      filtered = filtered.filter(place => 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (accessibilityFilters.length > 0) {
      filtered = filtered.filter(place => {
        const features = place.accessibilityFeatures 
          ? JSON.parse(place.accessibilityFeatures) 
          : [];
        
        return accessibilityFilters.some(filter => features.includes(filter));
      });
    }
    
    setFilteredPlaces(filtered);
  }, [searchQuery, accessibilityFilters, places]);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePlaceSelect = (placeId: number) => {
    navigate(`/place-details/${placeId}`);
  };

  const handleFilterChange = (features: AccessibilityFeature[]) => {
    setAccessibilityFilters(features);
  };

  return (
    <main className="w-full min-h-screen pb-16 bg-background">
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold ml-2">Nearby Places</h1>
        </div>
        
        <div className="px-4 pb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search places" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <AccessibilityFilter onFilterChange={handleFilterChange} />
          </div>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p>Loading nearby places...</p>
          </div>
        ) : filteredPlaces.length > 0 ? (
          <div className="space-y-4">
            {filteredPlaces.map((place) => (
              <PlaceCard 
                key={place.id} 
                place={place} 
                onClick={handlePlaceSelect}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Filter className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No places found matching your criteria</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearchQuery("");
                setAccessibilityFilters([]);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </main>
  );
}