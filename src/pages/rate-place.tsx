import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fine } from "@/lib/fine";
import { ProtectedRoute } from "@/components/auth/route-components";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BottomNavigation } from "@/components/BottomNavigation";
import { AccessibilityFeature } from "@/lib/map-utils";
import { AccessibilityFeatures } from "@/components/AccessibilityFeatures";
import { ArrowLeft, ThumbsUp, Construction, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function RatePlaceContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rating, setRating] = useState<"accessible" | "partially" | "not" | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<AccessibilityFeature[]>([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigate(-1);
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

  const handleSubmit = async () => {
    if (!rating) {
      toast({
        title: "Error",
        description: "Please select an accessibility rating",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data: session } = fine.auth.useSession();
      
      if (!session?.user || !id) {
        toast({
          title: "Error",
          description: "You must be logged in to add a review",
          variant: "destructive"
        });
        return;
      }
      
      const ratingValue = rating === "accessible" ? 5 : rating === "partially" ? 3 : 1;
      
      const review = {
        placeId: parseInt(id),
        userId: session.user.id,
        rating: ratingValue,
        features: JSON.stringify(selectedFeatures),
        comment: comment || null
      };
      
      await fine.table("accessibility_reviews").insert(review);
      
      toast({
        title: "Success",
        description: "Review added successfully"
      });
      
      navigate(`/review-success/${id}`);
    } catch (error) {
      console.error("Error adding review:", error);
      toast({
        title: "Error",
        description: "Failed to add review. Please try again.",
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
          <h1 className="text-xl font-bold ml-2">Rate this place</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex justify-between">
          <Button
            variant={rating === "accessible" ? "default" : "outline"}
            className={`flex-1 flex flex-col items-center py-6 ${
              rating === "accessible" ? "bg-green-600 hover:bg-green-700" : ""
            }`}
            onClick={() => setRating("accessible")}
          >
            <ThumbsUp className="h-8 w-8 mb-2" />
            <span className={rating === "accessible" ? "text-white" : "text-blue-600"}>Accessible</span>
          </Button>
          
          <Button
            variant={rating === "partially" ? "default" : "outline"}
            className={`flex-1 mx-2 flex flex-col items-center py-6 ${
              rating === "partially" ? "bg-amber-500 hover:bg-amber-600" : ""
            }`}
            onClick={() => setRating("partially")}
          >
            <Construction className="h-8 w-8 mb-2" />
            <span className={rating === "partially" ? "text-white" : "text-amber-600"}>Partially Accessible</span>
          </Button>
          
          <Button
            variant={rating === "not" ? "default" : "outline"}
            className={`flex-1 flex flex-col items-center py-6 ${
              rating === "not" ? "bg-red-600 hover:bg-red-700" : ""
            }`}
            onClick={() => setRating("not")}
          >
            <ThumbsDown className="h-8 w-8 mb-2" />
            <span className={rating === "not" ? "text-white" : "text-red-600"}>Not Accessible</span>
          </Button>
        </div>
        
        <Card className="p-4">
          <h3 className="font-medium mb-2">Select Available Features</h3>
          <AccessibilityFeatures 
            features={[
              "accessibleParking", "elevator", "handrails", "alternativeEntrance",
              "ramp", "braille", "scentFree", "brightLighting", "spacious",
              "genderNeutralWashroom", "quiet", "accessibleRestroom", "outdoorAccessOnly",
              "largePrint", "stopGapRamp"
            ]}
            selectedFeatures={selectedFeatures}
            onToggleFeature={handleToggleFeature}
            interactive={true}
          />
        </Card>
        
        <div className="space-y-2">
          <h3 className="font-medium">Describe about your experience</h3>
          <Textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details about the accessibility of this place..."
            rows={5}
          />
          <p className="text-xs text-muted-foreground text-right">
            {1000 - comment.length} characters remaining
          </p>
        </div>
        
        <Button 
          className="w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Done"}
        </Button>
      </div>
      
      <BottomNavigation />
    </main>
  );
}

export default function RatePlace() {
  return <ProtectedRoute Component={RatePlaceContent} />;
}