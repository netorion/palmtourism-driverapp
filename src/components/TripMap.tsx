import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from '@react-google-maps/api';

interface TripMapProps {
  fromLat: string;
  fromLng: string;
  toLat: string;
  toLng: string;
}

const TripMap = ({ fromLat, fromLng, toLat, toLng }: TripMapProps) => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  useEffect(() => {
    if (!currentLocation) return;

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
  }, [currentLocation, fromLat, fromLng, toLat, toLng]);

  return (
    <div className="h-[300px] mb-4 rounded-lg overflow-hidden">
      <LoadScript googleMapsApiKey="AIzaSyCcMW-QSYDMrT58sMJBxO1mhaeKYBNLMEc">
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
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default TripMap;