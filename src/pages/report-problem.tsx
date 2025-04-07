import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fine } from "@/lib/fine";
import { ProtectedRoute } from "@/components/auth/route-components";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ArrowLeft, Camera, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function ReportProblemContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [problemType, setProblemType] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    if (!problemType) {
      toast({
        title: "Error",
        description: "Please select a problem type",
        variant: "destructive"
      });
      return;
    }
    
    if (!description) {
      toast({
        title: "Error",
        description: "Please provide a description of the problem",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real implementation, this would submit the problem report to the database
      
      toast({
        title: "Success",
        description: "Problem reported successfully. Thank you for helping improve accessibility information."
      });
      
      navigate(`/place-details/${id}`);
    } catch (error) {
      console.error("Error reporting problem:", error);
      toast({
        title: "Error",
        description: "Failed to report problem. Please try again.",
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
          <h1 className="text-xl font-bold ml-2">Report A Problem</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card className="p-4">
          <h3 className="font-medium mb-4">What's the issue?</h3>
          <RadioGroup value={problemType || ""} onValueChange={setProblemType}>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="incorrect-info" id="incorrect-info" />
              <Label htmlFor="incorrect-info">Incorrect information</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="accessibility-changed" id="accessibility-changed" />
              <Label htmlFor="accessibility-changed">Accessibility features changed</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="temporary-issue" id="temporary-issue" />
              <Label htmlFor="temporary-issue">Temporary accessibility issue</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="place-closed" id="place-closed" />
              <Label htmlFor="place-closed">Place permanently closed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other issue</Label>
            </div>
          </RadioGroup>
        </Card>
        
        <div className="space-y-2">
          <h3 className="font-medium">Describe the problem</h3>
          <Textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please provide details about the issue..."
            rows={5}
          />
          <p className="text-xs text-muted-foreground text-right">
            {1000 - description.length} characters remaining
          </p>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Add photos (optional)</h3>
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
        </div>
        
        <Button 
          className="w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Report"}
        </Button>
      </div>
      
      <BottomNavigation />
    </main>
  );
}

export default function ReportProblem() {
  return <ProtectedRoute Component={ReportProblemContent} />;
}