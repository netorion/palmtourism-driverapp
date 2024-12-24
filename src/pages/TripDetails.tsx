import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import TripHeader from '@/components/trip-details/TripHeader';
import TripInfo from '@/components/trip-details/TripInfo';
import TripActions from '@/components/trip-details/TripActions';
import TripMap from '@/components/TripMap';
import { useGpsTracking } from '@/hooks/useGpsTracking';

interface TripDetails {
  id: string;
  title: string;
  pickup: string;
  dropoff: string;
  start: string;
  end: string;
  driver: string;
  car: string;
  carId: string;
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
  trip_note: string;
}

const TripDetails = () => {
  const { tripId, type } = useParams();
  const navigate = useNavigate();
  const { driver } = useAuth();
  console.log('TripDetails - tripId:', tripId);
  console.log('TripDetails - driver:', driver);
  console.log('TripDetails - type:', type);

  const { data: tripDetails, refetch } = useQuery({
    queryKey: ['tripDetails', tripId, driver?.driver_id, type],
    queryFn: async () => {
      if (!tripId || !driver?.driver_id || !type) {
        throw new Error('Missing required parameters');
      }
      const response = await fetch(`https://www.palmtourism-uae.net/api/trip/${tripId}/${driver.driver_id}/${type}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trip details');
      }
      const data = await response.json();
      console.log('TripDetails - API response:', data);
      return data as TripDetails;
    },
    enabled: !!tripId && !!driver?.driver_id && !!type,
  });

  const { isTracking } = useGpsTracking({
    carId: tripDetails?.carId || '',
    enabled: tripDetails?.trip_status === 'ongoing',
    onError: (error) => toast.error(error),
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

  const handlePhoneClick = () => {
    if (tripDetails?.customer_mobile) {
      window.location.href = `tel:${tripDetails.customer_mobile}`;
    }
  };

  const handleNavigationClick = () => {
    if (tripDetails?.to_lat && tripDetails?.to_log) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${tripDetails.to_lat},${tripDetails.to_log}`;
      window.open(url, '_blank');
    }
  };

  if (!tripDetails) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const displayTripId = tripDetails.title?.split(': ')[1] || 'N/A';

  return (
    <div className="p-4 pb-20 pt-16">
      <TripMap
        fromLat={tripDetails.from_lat}
        fromLng={tripDetails.from_log}
        toLat={tripDetails.to_lat}
        toLng={tripDetails.to_log}
      />

      <Card>
        <TripHeader
          displayTripId={displayTripId}
          customerMobile={tripDetails.customer_mobile}
          onWhatsAppClick={handleWhatsAppClick}
          onPhoneClick={handlePhoneClick}
        />
        <CardContent className="space-y-4">
          <TripInfo
            customer={tripDetails.customer}
            hotel={tripDetails.hotel}
            fromLocation={tripDetails.from_location}
            toLocation={tripDetails.to_location}
            pickup={tripDetails.pickup}
            totalPersons={tripDetails.total_persons}
            tripNote={tripDetails.trip_note}
          />
          <TripActions
            tripStatus={tripDetails.trip_status}
            onStartTrip={handleStartTrip}
            onEndTrip={handleEndTrip}
          />
          {isTracking && (
            <div className="text-sm text-green-600 font-medium">
              GPS tracking active
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TripDetails;