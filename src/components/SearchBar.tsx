import { useState } from "react";
import { Search, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onVoiceSearch?: () => void;
  className?: string;
}

export function SearchBar({ onSearch, onVoiceSearch, className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleVoiceSearch = () => {
    if (onVoiceSearch) {
      setIsListening(true);
      onVoiceSearch();
      
      // In a real implementation, this would be handled by the speech recognition API
      setTimeout(() => {
        setIsListening(false);
      }, 3000);
    }
  };

  return (
    <Card className={`p-2 shadow-lg ${className}`}>
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <Search className="h-5 w-5 text-muted-foreground ml-2" />
        <Input
          type="text"
          placeholder="Search location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-none focus-visible:ring-0 flex-1"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleVoiceSearch}
          className={isListening ? "text-primary animate-pulse" : ""}
        >
          <Mic className="h-5 w-5" />
        </Button>
      </form>
    </Card>
  );
}