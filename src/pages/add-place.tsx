import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fine } from "@/lib/fine";
import { ProtectedRoute } from "@/components/auth/route-components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNavigation } from "@/components/BottomNavigation";
import { AccessibilityFeature } from "@/lib/map-utils";
import { AccessibilityFeatures } from "@/components/AccessibilityFeatures";
import { Map } from "@/components/Map";
import { ArrowLeft, Camera, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function AddPlaceContent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    website: "",
    description: ""
  });
  const [selectedFeatures, setSelectedFeatures] = useState<AccessibilityFeature[]>([]);
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleFeature = (feature: AccessibilityFeature) => {
    setSelectedFeatures(prev => {
      if (prev.includes(feature)) {
        return prev.filter(f => f !== feature);
      } else {
        return [...prev, feature];
      }
    });
  };

  const handleLocationSelect = (coords: [number, number]) => {
    setLocation(coords);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location) {
      toast({
        title: "Error",
        description: "Please select a location on the map",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.name || !formData.address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data: session } = fine.auth.useSession();
      
      if (!session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to add a place",
          variant: "destructive"
        });
        return;
      }
      
      const newPlace = {
        name: formData.name,
        latitude: location[1],
        longitude: location[0],
        address: formData.address,
        phone: formData.phone || null,
        website: formData.website || null,
        accessibilityFeatures: JSON.stringify(selectedFeatures),
        rating: null,
        reviewCount: 0
      };
      
      await fine.table("places").insert(newPlace);
      
      toast({
        title: "Success",
        description: "Place added successfully"
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error adding place:", error);
      toast({
        title: "Error",
        description: "Failed to add place. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen pb-16 bg-background">
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold ml-2">Add Place</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full mb-4 rounded-md overflow-hidden">
              <Map 
                onLocationSelect={handleLocationSelect}
                markers={location ? [{ id: "selected", position: location, color: "#0066FF" }] : []}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {location 
                ? `Selected location: ${location[1].toFixed(6)}, ${location[0].toFixed(6)}` 
                : "Tap on the map to select a location"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input 
                id="address" 
                name="address" 
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website" 
                name="website" 
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Accessibility Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select all accessibility features available at this location
            </p>
            
            <AccessibilityFeatures 
              features={[
                "ramp", "elevator", "handrails", "braille", 
                "accessibleParking", "accessibleRestroom", "automaticDoors",
                "alternativeEntrance", "spacious", "quiet", "brightLighting",
                "stopGapRamp", "outdoorAccessOnly", "signLanguage", "digitalMenu",
                "animalFriendly", "scentFree", "genderNeutralWashroom", "largePrint"
              ]}
              selectedFeatures={selectedFeatures}
              onToggleFeature={handleToggleFeature}
              interactive={true}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                type="button" 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center"
              >
                <Camera className="h-6 w-6 mb-1" />
                <span className="text-xs">Take Photo</span>
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center"
              >
                <Upload className="h-6 w-6 mb-1" />
                <span className="text-xs">Upload Photo</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? "Adding Place..." : "Add Place"}
        </Button>
      </form>
      
      <BottomNavigation />
    </main>
  );
}

export default function AddPlace() {
  return <ProtectedRoute Component={AddPlaceContent} />;
}