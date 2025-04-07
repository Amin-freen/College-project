import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface VoiceControlProps {
  onCommand: (command: string) => void;
  onClose: () => void;
}

export function VoiceControl({ onCommand, onClose }: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  
  // In a real implementation, this would use the Web Speech API
  useEffect(() => {
    if (isListening) {
      const timer = setTimeout(() => {
        setIsListening(false);
        setTranscript("Navigate to nearest accessible restaurant");
        onCommand("Navigate to nearest accessible restaurant");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isListening]);
  
  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTranscript("");
    }
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Voice Control</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="bg-muted p-4 rounded-md min-h-[100px] flex items-center justify-center mb-4">
          {transcript ? (
            <p className="text-center">{transcript}</p>
          ) : (
            <p className="text-center text-muted-foreground">
              {isListening ? "Listening..." : "Tap the microphone to speak"}
            </p>
          )}
        </div>
        
        <Button
          className={`w-full ${isListening ? "bg-destructive hover:bg-destructive/90" : ""}`}
          onClick={toggleListening}
        >
          {isListening ? (
            <>
              <MicOff className="h-4 w-4 mr-2" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Start Listening
            </>
          )}
        </Button>
        
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">Try saying:</p>
          <ul className="text-sm text-muted-foreground list-disc pl-5 mt-1">
            <li>Navigate to nearest accessible restaurant</li>
            <li>Find wheelchair accessible places nearby</li>
            <li>Show places with elevators</li>
            <li>Emergency share my location</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}