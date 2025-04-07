import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { parseAccessibilityFeatures } from "@/lib/map-utils";
import { Accessibility } from "lucide-react";

interface PlaceCardProps {
  place: {
    id: number;
    name: string;
    address: string;
    accessibilityFeatures?: string | null;
    rating?: number;
    distance?: number;
    price?: string;
  };
  onClick?: (id: number) => void;
}

export function PlaceCard({ place, onClick }: PlaceCardProps) {
  const features = parseAccessibilityFeatures(place.accessibilityFeatures);
  const isAccessible = features.length > 0;

  return (
    <Card 
      className="mb-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick && onClick(place.id)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium text-lg">{place.name}</h3>
            <p className="text-sm text-muted-foreground">{place.address}</p>
            
            <div className="flex items-center gap-2 mt-1">
              {place.distance && (
                <span className="text-xs text-muted-foreground">
                  {place.distance.toFixed(1)} km away
                </span>
              )}
              
              {place.rating && (
                <div className="flex items-center">
                  <span className="text-xs font-medium bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                    {place.rating.toFixed(1)}
                  </span>
                </div>
              )}
              
              {place.price && (
                <span className="text-xs text-muted-foreground">
                  {place.price}
                </span>
              )}
            </div>
          </div>
          
          {isAccessible && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
              <Accessibility className="h-3 w-3" />
              <span>Accessible</span>
            </Badge>
          )}
        </div>
        
        {features.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {features.slice(0, 3).map((feature) => (
              <Badge key={feature} variant="secondary" className="text-xs">
                {feature.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </Badge>
            ))}
            {features.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{features.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}