import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Phone, MapPin, Users, Car, Calendar, Clock, WhatsappIcon } from 'lucide-react';

interface TripDetails {
  id: string;
  title: string;
  pickup: string;
  dropoff: string;
  start: string;
  end: string;
  driver: string;
  car: string;
  customer: string;
  customer_mobile: string;
  booking_type: string;
  hotel: string;
  total_persons: number;
  type: string;
  trip_status: string;
  from_location: string;
  to_location: string;
  from_lat: string;
  from_log: string;
  to_lat: string;
  to_log: string;
  total_distance: string;
}

const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { driver } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const { data: tripDetails, refetch } = useQuery({
    queryKey: ['tripDetails', tripId],
    queryFn: async () => {
      const response = await fetch(`https://www.palmtourism-uae.net/api/trip/${tripId}/${driver?.driver_id}/individual`);
      if (!response.ok) {
        throw new Error('Failed to fetch trip details');
      }
      return response.json() as Promise<TripDetails>;
    },
    enabled: !!tripId && !!driver?.driver_id,
  });

  useEffect(() => {
    // Get current location
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
          toast.error('Unable to get current location');
        },
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  useEffect(() => {
    if (tripDetails && currentLocation) {
      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: { lat: parseFloat(tripDetails.from_lat), lng: parseFloat(tripDetails.from_log) },
          destination: { lat: parseFloat(tripDetails.to_lat), lng: parseFloat(tripDetails.to_log) },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error('Directions request failed:', status);
            toast.error('Failed to load directions');
          }
        }
      );
    }
  }, [tripDetails, currentLocation]);

  const handleStartTrip = async () => {
    try {
      const response = await fetch(`https://www.palmtourism-uae.net/api/trips/start/${tripId}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to start trip');
      }
      
      toast.success('Trip started successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to start trip');
      console.error('Error starting trip:', error);
    }
  };

  const handleEndTrip = async () => {
    try {
      const response = await fetch(`https://www.palmtourism-uae.net/api/trips/end/${tripId}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to end trip');
      }
      
      toast.success('Trip completed successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to end trip');
      console.error('Error ending trip:', error);
    }
  };

  const handleWhatsAppClick = () => {
    if (tripDetails?.customer_mobile) {
      window.open(`https://wa.me/${tripDetails.customer_mobile}`, '_blank');
    }
  };

  if (!tripDetails) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-4 pb-20 pt-16">
      <div className="h-[300px] mb-4 rounded-lg overflow-hidden">
        <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY || ''}>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={currentLocation || { 
              lat: parseFloat(tripDetails.from_lat), 
              lng: parseFloat(tripDetails.from_log) 
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

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{tripDetails.title}</span>
            {tripDetails.customer_mobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleWhatsAppClick}
                className="text-green-500"
              >
                <WhatsappIcon className="h-5 w-5" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>{tripDetails.customer}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{tripDetails.hotel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-primary" />
              <span>{tripDetails.car}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{tripDetails.start.split('T')[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{tripDetails.pickup} - {tripDetails.dropoff}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>{tripDetails.total_persons} Persons</span>
            </div>
          </div>

          {tripDetails.trip_status === 'yettostart' && (
            <Button 
              className="w-full" 
              onClick={handleStartTrip}
            >
              Start Trip
            </Button>
          )}

          {tripDetails.trip_status === 'ongoing' && (
            <Button 
              className="w-full" 
              onClick={handleEndTrip}
            >
              End Trip
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TripDetails;