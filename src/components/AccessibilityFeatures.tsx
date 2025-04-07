import { Badge } from "@/components/ui/badge";
import { 
  Check,
  Footprints,
  ParkingSquare,
  Bath,
  DoorOpen,
  Maximize,
  VolumeX,
  SunMedium,
  ArrowUpDown,
  TreePine,
  Hand,
  Smartphone,
  Dog,
  Wind,
  Users,
  ZoomIn
} from "lucide-react";
import { AccessibilityFeature } from "@/lib/map-utils";

interface AccessibilityFeaturesProps {
  features: AccessibilityFeature[];
  selectedFeatures?: AccessibilityFeature[];
  onToggleFeature?: (feature: AccessibilityFeature) => void;
  interactive?: boolean;
}

export function AccessibilityFeatures({ 
  features, 
  selectedFeatures = [], 
  onToggleFeature,
  interactive = false
}: AccessibilityFeaturesProps) {
  const getIcon = (feature: AccessibilityFeature) => {
    switch (feature) {
      case "ramp": return <Footprints className="h-3 w-3" />;
      case "elevator": return <ArrowUpDown className="h-3 w-3" />;
      case "handrails": return <Footprints className="h-3 w-3" />;
      case "braille": return <Hand className="h-3 w-3" />;
      case "accessibleParking": return <ParkingSquare className="h-3 w-3" />;
      case "accessibleRestroom": return <Bath className="h-3 w-3" />;
      case "automaticDoors": return <DoorOpen className="h-3 w-3" />;
      case "alternativeEntrance": return <DoorOpen className="h-3 w-3" />;
      case "spacious": return <Maximize className="h-3 w-3" />;
      case "quiet": return <VolumeX className="h-3 w-3" />;
      case "brightLighting": return <SunMedium className="h-3 w-3" />;
      case "stopGapRamp": return <ArrowUpDown className="h-3 w-3" />;
      case "outdoorAccessOnly": return <TreePine className="h-3 w-3" />;
      case "signLanguage": return <Hand className="h-3 w-3" />;
      case "digitalMenu": return <Smartphone className="h-3 w-3" />;
      case "animalFriendly": return <Dog className="h-3 w-3" />;
      case "scentFree": return <Wind className="h-3 w-3" />;
      case "genderNeutralWashroom": return <Users className="h-3 w-3" />;
      case "largePrint": return <ZoomIn className="h-3 w-3" />;
      default: return <Check className="h-3 w-3" />;
    }
  };

  const formatFeatureName = (feature: string) => {
    return feature
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="flex flex-wrap gap-2">
      {features.map((feature) => {
        const isSelected = selectedFeatures.includes(feature);
        
        return (
          <Badge
            key={feature}
            variant={isSelected ? "default" : "outline"}
            className={`
              flex items-center gap-1
              ${interactive ? "cursor-pointer" : ""}
              ${isSelected ? "bg-primary" : ""}
            `}
            onClick={() => {
              if (interactive && onToggleFeature) {
                onToggleFeature(feature);
              }
            }}
          >
            {getIcon(feature)}
            <span>{formatFeatureName(feature)}</span>
          </Badge>
        );
      })}
    </div>
  );
}