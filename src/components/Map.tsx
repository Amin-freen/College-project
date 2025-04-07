import { useEffect, useRef, useState } from "react";
import { Map as MapLibre, NavigationControl, Marker, LngLatLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "@/components/ui/button";
import { Compass, Locate, Plus, Minus } from "lucide-react";
import { getNearbyPlaces } from "@/lib/map-utils";

interface MapProps {
  center?: [number, number];
  zoom?: number;
  onLocationSelect?: (location: [number, number]) => void;
  markers?: Array<{
    id: number | string;
    position: [number, number];
    color?: string;
  }>;
  route?: Array<[number, number]>;
  onMarkerClick?: (id: number | string) => void;
}

export function Map({
  center = [80.2707, 13.0827], // Chennai coordinates (longitude, latitude)
  zoom = 13,
  onLocationSelect,
  markers = [],
  route,
  onMarkerClick,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibre | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new MapLibre({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json", // Free and open style that doesn't require an API key
      center: center,
      zoom: zoom,
    });

    map.current.addControl(new NavigationControl(), "bottom-right");

    map.current.on("load", () => {
      setMapLoaded(true);
      
      // Add route layer if we have a route
      if (route && map.current) {
        map.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: route,
            },
          },
        });
        
        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#0066FF",
            "line-width": 6,
          },
        });
      }
      
      // Load nearby places
      if (center) {
        getNearbyPlaces(center[1], center[0]).then((places) => {
          places.forEach((place) => {
            if (map.current) {
              const el = document.createElement("div");
              el.className = "marker";
              el.style.backgroundColor = "#FF4136";
              el.style.width = "24px";
              el.style.height = "24px";
              el.style.borderRadius = "50%";
              el.style.cursor = "pointer";
              
              new Marker(el)
                .setLngLat([place.longitude, place.latitude])
                .addTo(map.current);
                
              el.addEventListener("click", () => {
                if (onMarkerClick) onMarkerClick(place.id);
              });
            }
          });
        });
      }
    });

    map.current.on("click", (e) => {
      if (onLocationSelect) {
        onLocationSelect([e.lngLat.lng, e.lngLat.lat]);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Update markers when they change
    markers.forEach((marker) => {
      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundColor = marker.color || "#FF4136";
      el.style.width = "24px";
      el.style.height = "24px";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";
      
      new Marker(el)
        .setLngLat(marker.position as LngLatLike)
        .addTo(map.current!);
        
      el.addEventListener("click", () => {
        if (onMarkerClick) onMarkerClick(marker.id);
      });
    });
  }, [markers, mapLoaded]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          
          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 15,
            });
            
            // Add user location marker
            const el = document.createElement("div");
            el.className = "user-marker";
            el.style.backgroundColor = "#0066FF";
            el.style.width = "16px";
            el.style.height = "16px";
            el.style.borderRadius = "50%";
            el.style.border = "3px solid white";
            
            new Marker(el)
              .setLngLat([longitude, latitude])
              .addTo(map.current);
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  };

  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      <div className="absolute bottom-24 right-4 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full shadow-md"
          onClick={getUserLocation}
        >
          <Locate className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full shadow-md"
          onClick={handleZoomIn}
        >
          <Plus className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full shadow-md"
          onClick={handleZoomOut}
        >
          <Minus className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full shadow-md"
        >
          <Compass className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}