import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Navigation, 
  Clock, 
  Share2 
} from "lucide-react";
import { RoutePoint } from "@/lib/map-utils";

interface NavigationPanelProps {
  route: RoutePoint[];
  destination: string;
  distance: number;
  duration: number;
  onClose: () => void;
}

export function NavigationPanel({ 
  route, 
  destination, 
  distance, 
  duration,
  onClose 
}: NavigationPanelProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (isNavigating && voiceEnabled) {
      // Simulate voice guidance
      const instruction = route[currentStep]?.instruction;
      if (instruction) {
        speakInstruction(instruction);
      }
    }
  }, [currentStep, isNavigating, voiceEnabled]);

  const speakInstruction = (text: string) => {
    // In a real implementation, this would use the Web Speech API
    console.log(`Speaking: ${text}`);
  };

  const startNavigation = () => {
    setIsNavigating(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < route.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  const shareLocation = () => {
    // In a real implementation, this would share the current location
    if (navigator.share) {
      navigator.share({
        title: 'My Current Location',
        text: `I'm currently at this location heading to ${destination}`,
        url: `https://maps.google.com/?q=${route[currentStep]?.lat},${route[currentStep]?.lng}`
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-primary text-primary-foreground pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            <span>{destination}</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground"
              onClick={toggleVoice}
            >
              {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground"
              onClick={shareLocation}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{distance.toFixed(1)} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration} min</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {!isNavigating ? (
          <Button 
            className="w-full bg-primary"
            onClick={startNavigation}
          >
            Start Navigation
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <p className="font-medium text-lg">{route[currentStep]?.instruction}</p>
              {route[currentStep]?.distance && (
                <p className="text-sm text-muted-foreground">
                  {route[currentStep]?.distance} meters
                </p>
              )}
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                onClick={nextStep}
                disabled={currentStep === route.length - 1}
              >
                Next
              </Button>
            </div>
            
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={onClose}
            >
              End Navigation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}