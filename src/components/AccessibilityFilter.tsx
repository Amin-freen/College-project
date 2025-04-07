import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Accessibility, Eye, Ear, Brain, MessageSquare } from "lucide-react";
import { AccessibilityFeature } from "@/lib/map-utils";
import { AccessibilityFeatures } from "./AccessibilityFeatures";

interface AccessibilityFilterProps {
  onFilterChange: (features: AccessibilityFeature[]) => void;
}

export function AccessibilityFilter({ onFilterChange }: AccessibilityFilterProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<AccessibilityFeature[]>([]);
  
  const allFeatures: Record<string, AccessibilityFeature[]> = {
    mobility: ["ramp", "elevator", "handrails", "accessibleParking", "automaticDoors", "alternativeEntrance", "spacious", "stopGapRamp"],
    visual: ["braille", "brightLighting", "largePrint"],
    hearing: ["signLanguage"],
    cognitive: ["quiet", "simpleLayout", "clearSignage"],
    other: ["accessibleRestroom", "genderNeutralWashroom", "scentFree", "animalFriendly", "outdoorAccessOnly"]
  };
  
  const handleToggleFeature = (feature: AccessibilityFeature) => {
    setSelectedFeatures((prev) => {
      if (prev.includes(feature)) {
        return prev.filter(f => f !== feature);
      } else {
        return [...prev, feature];
      }
    });
  };
  
  const applyFilters = () => {
    onFilterChange(selectedFeatures);
  };
  
  const clearFilters = () => {
    setSelectedFeatures([]);
    onFilterChange([]);
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Accessibility Filters</span>
          {selectedFeatures.length > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
              {selectedFeatures.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Filter by Accessibility Features</SheetTitle>
        </SheetHeader>
        
        <Tabs defaultValue="mobility" className="mt-4">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="mobility" className="flex flex-col items-center gap-1">
              <Accessibility className="h-4 w-4" />
              <span className="text-xs">Mobility</span>
            </TabsTrigger>
            <TabsTrigger value="visual" className="flex flex-col items-center gap-1">
              <Eye className="h-4 w-4" />
              <span className="text-xs">Visual</span>
            </TabsTrigger>
            <TabsTrigger value="hearing" className="flex flex-col items-center gap-1">
              <Ear className="h-4 w-4" />
              <span className="text-xs">Hearing</span>
            </TabsTrigger>
            <TabsTrigger value="cognitive" className="flex flex-col items-center gap-1">
              <Brain className="h-4 w-4" />
              <span className="text-xs">Cognitive</span>
            </TabsTrigger>
            <TabsTrigger value="other" className="flex flex-col items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">Other</span>
            </TabsTrigger>
          </TabsList>
          
          {Object.entries(allFeatures).map(([category, features]) => (
            <TabsContent key={category} value={category} className="mt-4">
              <AccessibilityFeatures 
                features={features}
                selectedFeatures={selectedFeatures}
                onToggleFeature={handleToggleFeature}
                interactive={true}
              />
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="flex gap-2 mt-8">
          <Button variant="outline" className="flex-1" onClick={clearFilters}>
            Clear All
          </Button>
          <Button className="flex-1" onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}