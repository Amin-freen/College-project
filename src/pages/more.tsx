import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BottomNavigation } from "@/components/BottomNavigation";
import { 
  Settings, 
  HelpCircle, 
  Info, 
  MessageSquare, 
  Share2, 
  Star, 
  Bell, 
  Shield, 
  Moon 
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function More() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real implementation, this would toggle the dark mode
    document.documentElement.classList.toggle("dark");
  };

  return (
    <main className="w-full min-h-screen pb-16 bg-background">
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center p-4">
          <h1 className="text-xl font-bold">More</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-0">
            <Button 
              variant="ghost" 
              className="w-full justify-start px-4 py-6 rounded-none border-b"
              onClick={() => navigate("/settings")}
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Button>
            
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <div className="flex items-center">
                <Moon className="h-5 w-5 mr-3" />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch 
                id="dark-mode" 
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start px-4 py-6 rounded-none border-b"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-5 w-5 mr-3" />
              Notifications
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start px-4 py-6 rounded-none"
              onClick={() => navigate("/privacy")}
            >
              <Shield className="h-5 w-5 mr-3" />
              Privacy & Security
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-0">
            <Button 
              variant="ghost" 
              className="w-full justify-start px-4 py-6 rounded-none border-b"
              onClick={() => navigate("/help")}
            >
              <HelpCircle className="h-5 w-5 mr-3" />
              Help & Support
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start px-4 py-6 rounded-none border-b"
              onClick={() => navigate("/about")}
            >
              <Info className="h-5 w-5 mr-3" />
              About AccessMap
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start px-4 py-6 rounded-none border-b"
              onClick={() => navigate("/feedback")}
            >
              <MessageSquare className="h-5 w-5 mr-3" />
              Send Feedback
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start px-4 py-6 rounded-none border-b"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'AccessMap',
                    text: 'Check out AccessMap - Navigation for everyone',
                    url: window.location.origin
                  });
                }
              }}
            >
              <Share2 className="h-5 w-5 mr-3" />
              Share AccessMap
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start px-4 py-6 rounded-none"
              onClick={() => window.open("https://example.com/rate", "_blank")}
            >
              <Star className="h-5 w-5 mr-3" />
              Rate the App
            </Button>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground mt-8">
          AccessMap v1.0.0
        </p>
      </div>
      
      <BottomNavigation />
    </main>
  );
}