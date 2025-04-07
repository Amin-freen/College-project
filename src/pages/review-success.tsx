import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/BottomNavigation";
import { CheckCircle } from "lucide-react";

export default function ReviewSuccess() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    if (id) {
      navigate(`/place-details/${id}`);
    } else {
      navigate("/");
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Review Added Successfully!</h1>
        
        <p className="text-muted-foreground mb-8">
          Thank You for visiting this place and sharing your experience. Your review helps make navigation more accessible for everyone.
        </p>
        
        <Button className="w-full" onClick={handleBack}>
          Back to Place
        </Button>
      </div>
      
      <BottomNavigation />
    </main>
  );
}