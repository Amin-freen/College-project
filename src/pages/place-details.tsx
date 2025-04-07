import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BottomNavigation } from "@/components/BottomNavigation";
import { AccessibilityFeatures } from "@/components/AccessibilityFeatures";
import { getPlaceDetails, parseAccessibilityFeatures } from "@/lib/map-utils";
import { 
  ArrowLeft, 
  Share2, 
  MapPin, 
  Phone, 
  Globe, 
  Star, 
  ThumbsUp, 
  AlertTriangle,
  Navigation2
} from "lucide-react";

export default function PlaceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [place, setPlace] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlaceDetails = async () => {
      try {
        if (id) {
          const placeData = await getPlaceDetails(parseInt(id));
          setPlace(placeData);
        }
      } catch (error) {
        console.error("Error loading place details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlaceDetails();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    if (navigator.share && place) {
      navigator.share({
        title: place.name,
        text: `Check out ${place.name} on AccessMap`,
        url: window.location.href
      });
    }
  };

  const handleShowDirections = () => {
    if (place) {
      navigate(`/navigation/${id}`);
    }
  };

  const handleAddReview = () => {
    navigate(`/rate-place/${id}`);
  };

  const handleReportProblem = () => {
    navigate(`/report-problem/${id}`);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p>Place not found</p>
      </div>
    );
  }

  const accessibilityFeatures = parseAccessibilityFeatures(place.accessibilityFeatures);

  return (
    <main className="w-full min-h-screen pb-16 bg-background">
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold ml-2">Details</h1>
          <div className="ml-auto">
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 rounded-full p-3">
                <ThumbsUp className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl">{place.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <p className="text-sm">{place.address}</p>
              </div>
              
              {place.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <a href={`tel:${place.phone}`} className="text-sm text-primary">
                    {place.phone}
                  </a>
                </div>
              )}
              
              {place.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <a 
                    href={place.website.startsWith('http') ? place.website : `http://${place.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary"
                  >
                    {place.website}
                  </a>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                <span className="text-sm">
                  <span className="font-medium">{place.rating}</span>
                  <span className="text-muted-foreground"> ({place.reviewCount} reviews)</span>
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-green-600" />
                <span className="text-sm">
                  <span className="font-medium">Accessible From Home</span>
                </span>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">Accessibility Features</h3>
              <AccessibilityFeatures features={accessibilityFeatures} />
            </div>
            
            <Button 
              className="w-full bg-primary"
              onClick={handleShowDirections}
            >
              <Navigation2 className="h-5 w-5 mr-2" />
              Show Directions
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleAddReview}
            >
              Add Review
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full text-amber-600 hover:text-amber-700"
              onClick={handleReportProblem}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report A Problem
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <BottomNavigation />
    </main>
  );
}