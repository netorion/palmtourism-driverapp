import { useEffect, useState, useCallback } from 'react';
import { useLoadScript, GoogleMap, DirectionsRenderer, Marker } from '@react-google-maps/api';

interface TripMapProps {
  fromLat: string;
  fromLng: string;
  toLat: string;
  toLng: string;
}

interface Location {
  lat: number;
  lng: number;
  bearing?: number;
}

const TripMap = ({ fromLat, fromLng, toLat, toLng }: TripMapProps) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [previousLocation, setPreviousLocation] = useState<Location | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCcMW-QSYDMrT58sMJBxO1mhaeKYBNLMEc",
    libraries: ["places", "geometry"],
  });

  const calculateBearing = useCallback((start: Location, end: Location): number => {
    const toRad = (deg: number) => deg * (Math.PI / 180);
    const toDeg = (rad: number) => rad * (180 / Math.PI);

    const startLat = toRad(start.lat);
    const startLng = toRad(start.lng);
    const endLat = toRad(end.lat);
    const endLng = toRad(end.lng);

    const dLng = endLng - startLng;

    const y = Math.sin(dLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) -
             Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

    let bearing = toDeg(Math.atan2(y, x));
    bearing = (bearing + 360) % 360;

    return bearing;
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          if (previousLocation) {
            const bearing = calculateBearing(previousLocation, newLocation);
            setCurrentLocation({ ...newLocation, bearing });
          } else {
            setCurrentLocation(newLocation);
          }

          setPreviousLocation(newLocation);
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        { 
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [previousLocation, calculateBearing]);

  useEffect(() => {
    if (!isLoaded || !currentLocation) return;

    const directionsService = new google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: { lat: parseFloat(fromLat), lng: parseFloat(fromLng) },
        destination: { lat: parseFloat(toLat), lng: parseFloat(toLng) },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error('Directions request failed:', status);
        }
      }
    );
  }, [isLoaded, currentLocation, fromLat, fromLng, toLat, toLng]);

  if (loadError) {
    return <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-lg">
      Error loading maps
    </div>;
  }

  if (!isLoaded) {
    return <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-lg">
      Loading maps...
    </div>;
  }

  return (
    <div className="h-[300px] mb-4 rounded-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={currentLocation || { 
          lat: parseFloat(fromLat), 
          lng: parseFloat(fromLng) 
        }}
        zoom={13}
      >
        {directions && <DirectionsRenderer directions={directions} />}
        {currentLocation && (
          <Marker
            position={currentLocation}
            icon={{
              url: '/car-marker.png',
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 16),
              rotation: currentLocation.bearing,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default TripMap;