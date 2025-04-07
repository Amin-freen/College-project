import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Map } from "@/components/Map";
import { NavigationPanel } from "@/components/NavigationPanel";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/BottomNavigation";
import { getPlaceDetails, findAccessibleRoute, RoutePoint } from "@/lib/map-utils";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";

export default function Navigation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [place, setPlace] = useState<any | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<RoutePoint[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { longitude, latitude } = position.coords;
              setUserLocation([longitude, latitude]);
              
              // Load place details
              if (id) {
                getPlaceDetails(parseInt(id)).then((placeData) => {
                  setPlace(placeData);
                  
                  // Generate route
                  const calculatedRoute = findAccessibleRoute(
                    [longitude, latitude],
                    [placeData.longitude, placeData.latitude],
                    []
                  );
                  setRoute(calculatedRoute);
                  setLoading(false);
                });
              }
            },
            (error) => {
              console.error("Error getting user location:", error);
              setLoading(false);
            }
          );
        }
      } catch (error) {
        console.error("Error loading navigation data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p>Loading route...</p>
      </div>
    );
  }

  if (!place || !userLocation) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p>Could not load navigation data</p>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen flex flex-col relative bg-background">
      <div className="sticky top-0 z-10 bg-primary text-primary-foreground">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="icon" className="text-primary-foreground" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium ml-2">
            Navigating to {place.name}
          </h1>
          <div className="ml-auto">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground"
              onClick={toggleVoice}
            >
              {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Map */}
      <div className="flex-1 w-full">
        <Map 
          center={userLocation}
          zoom={15}
          markers={[
            {
              id: "user",
              position: userLocation,
              color: "#0066FF"
            },
            {
              id: place.id,
              position: [place.longitude, place.latitude],
              color: "#FF4136"
            }
          ]}
          route={route.map(point => [point.lng, point.lat])}
        />
      </div>
      
      {/* Navigation Panel */}
      <div className="absolute bottom-20 left-4 right-4 z-10">
        <NavigationPanel 
          route={route}
          destination={place.name}
          distance={1.5} // In a real app, this would be calculated
          duration={15} // In a real app, this would be calculated
          onClose={handleBack}
        />
      </div>
      
      <BottomNavigation />
    </main>
  );
}