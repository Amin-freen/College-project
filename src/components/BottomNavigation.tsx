import { Link, useLocation } from "react-router-dom";
import { Map, PlusCircle, User, MoreHorizontal } from "lucide-react";

export function BottomNavigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around items-center h-16 z-50">
      <Link
        to="/"
        className={`flex flex-col items-center justify-center w-1/4 ${
          isActive("/") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Map className="h-5 w-5" />
        <span className="text-xs mt-1">Map</span>
      </Link>
      
      <Link
        to="/add-place"
        className={`flex flex-col items-center justify-center w-1/4 ${
          isActive("/add-place") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <PlusCircle className="h-5 w-5" />
        <span className="text-xs mt-1">Add</span>
      </Link>
      
      <Link
        to="/profile"
        className={`flex flex-col items-center justify-center w-1/4 ${
          isActive("/profile") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <User className="h-5 w-5" />
        <span className="text-xs mt-1">Profile</span>
      </Link>
      
      <Link
        to="/more"
        className={`flex flex-col items-center justify-center w-1/4 ${
          isActive("/more") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <MoreHorizontal className="h-5 w-5" />
        <span className="text-xs mt-1">More</span>
      </Link>
    </div>
  );
}