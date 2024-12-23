import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Phone, MapPin, Users, Car, Calendar, Clock, MessageSquareText } from 'lucide-react';
import TripMap from '@/components/TripMap';

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
  trip_status_text: string;
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
  console.log('TripDetails - tripId:', tripId);
  console.log('TripDetails - driver:', driver);

  const { data: tripDetails, refetch } = useQuery({
    queryKey: ['tripDetails', tripId, driver?.driver_id],
    queryFn: async () => {
      if (!tripId || !driver?.driver_id) {
        throw new Error('Missing required parameters');
      }
      const response = await fetch(`https://www.palmtourism-uae.net/api/trip/${tripId}/${driver.driver_id}/${tripDetails?.type || 'individual'}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trip details');
      }
      const data = await response.json();
      console.log('TripDetails - API response:', data);
      return data as TripDetails;
    },
    enabled: !!tripId && !!driver?.driver_id,
  });

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

  // Safely extract trip ID from title
  const displayTripId = tripDetails.title?.split(': ')[1] || 'N/A';

  return (
    <div className="p-4 pb-20 pt-16">
      {tripDetails && (
        <TripMap
          fromLat={tripDetails.from_lat}
          fromLng={tripDetails.from_log}
          toLat={tripDetails.to_lat}
          toLng={tripDetails.to_log}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Trip #{displayTripId}</span>
            {tripDetails.customer_mobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleWhatsAppClick}
                className="text-green-500"
              >
                <MessageSquareText className="h-5 w-5" />
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
              <span>{tripDetails.start?.split('T')[0]}</span>
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
              className="w-full bg-green-500 hover:bg-green-600" 
              onClick={handleStartTrip}
            >
              Start Trip
            </Button>
          )}

          {tripDetails.trip_status === 'ongoing' && (
            <Button 
              className="w-full bg-red-500 hover:bg-red-600" 
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