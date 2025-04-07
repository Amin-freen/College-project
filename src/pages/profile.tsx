import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fine } from "@/lib/fine";
import { ProtectedRoute } from "@/components/auth/route-components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BottomNavigation } from "@/components/BottomNavigation";
import { AccessibilityFeature } from "@/lib/map-utils";
import { AccessibilityFeatures } from "@/components/AccessibilityFeatures";
import { 
  User, 
  Settings, 
  LogOut, 
  Heart, 
  Clock, 
  Accessibility, 
  Eye, 
  Ear, 
  Brain 
} from "lucide-react";

function ProfileContent() {
  const navigate = useNavigate();
  const { data: session } = fine.auth.useSession();
  const [preferences, setPreferences] = useState<{
    mobilityNeeds: boolean;
    visualNeeds: boolean;
    hearingNeeds: boolean;
    cognitiveNeeds: boolean;
    selectedFeatures: AccessibilityFeature[];
  }>({
    mobilityNeeds: false,
    visualNeeds: false,
    hearingNeeds: false,
    cognitiveNeeds: false,
    selectedFeatures: []
  });

  useEffect(() => {
    // In a real implementation, this would load user preferences from the database
    const loadPreferences = async () => {
      if (session?.user) {
        try {
          const userPrefs = await fine.table("user_preferences")
            .select()
            .eq("userId", session.user.id);
          
          if (userPrefs && userPrefs.length > 0) {
            const prefs = JSON.parse(userPrefs[0].accessibilityPreferences);
            setPreferences(prefs);
          }
        } catch (error) {
          console.error("Error loading user preferences:", error);
        }
      }
    };

    loadPreferences();
  }, [session]);

  const handleLogout = async () => {
    await fine.auth.signOut();
    navigate("/");
  };

  const handleTogglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleToggleFeature = (feature: AccessibilityFeature) => {
    setPreferences(prev => {
      const features = [...prev.selectedFeatures];
      const index = features.indexOf(feature);
      
      if (index >= 0) {
        features.splice(index, 1);
      } else {
        features.push(feature);
      }
      
      return {
        ...prev,
        selectedFeatures: features
      };
    });
  };

  const savePreferences = async () => {
    if (session?.user) {
      try {
        await fine.table("user_preferences").update({
          accessibilityPreferences: JSON.stringify(preferences)
        }).eq("userId", session.user.id);
      } catch (error) {
        console.error("Error saving user preferences:", error);
      }
    }
  };

  return (
    <main className="w-full min-h-screen pb-16 bg-background">
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center p-4">
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-full p-2">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium">{session?.user?.name}</p>
                <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate("/settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Accessibility Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Accessibility className="h-5 w-5 text-primary" />
                  <Label htmlFor="mobility-needs">Mobility Needs</Label>
                </div>
                <Switch 
                  id="mobility-needs" 
                  checked={preferences.mobilityNeeds}
                  onCheckedChange={() => handleTogglePreference('mobilityNeeds')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  <Label htmlFor="visual-needs">Visual Needs</Label>
                </div>
                <Switch 
                  id="visual-needs" 
                  checked={preferences.visualNeeds}
                  onCheckedChange={() => handleTogglePreference('visualNeeds')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ear className="h-5 w-5 text-primary" />
                  <Label htmlFor="hearing-needs">Hearing Needs</Label>
                </div>
                <Switch 
                  id="hearing-needs" 
                  checked={preferences.hearingNeeds}
                  onCheckedChange={() => handleTogglePreference('hearingNeeds')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <Label htmlFor="cognitive-needs">Cognitive Needs</Label>
                </div>
                <Switch 
                  id="cognitive-needs" 
                  checked={preferences.cognitiveNeeds}
                  onCheckedChange={() => handleTogglePreference('cognitiveNeeds')}
                />
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">Preferred Accessibility Features</h3>
              <AccessibilityFeatures 
                features={[
                  "ramp", "elevator", "handrails", "braille", 
                  "accessibleParking", "accessibleRestroom", "automaticDoors"
                ]}
                selectedFeatures={preferences.selectedFeatures}
                onToggleFeature={handleToggleFeature}
                interactive={true}
              />
            </div>
            
            <Button 
              className="w-full"
              onClick={savePreferences}
            >
              Save Preferences
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Saved Places</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Heart className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">You haven't saved any places yet</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => navigate("/")}
              >
                Explore places to save
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <BottomNavigation />
    </main>
  );
}

export default function Profile() {
  return <ProtectedRoute Component={ProfileContent} />;
}