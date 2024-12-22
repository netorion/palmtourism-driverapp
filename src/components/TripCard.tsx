import { CalendarClock, MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface TripCardProps {
  trip: {
    id: string;
    title: string;
    pickup: string;
    dropoff: string;
    hotel: string;
    total_persons: number;
    booking_type: string;
    type: string;
    trip_status: string;
  };
  showViewDetails?: boolean;
}

const TripCard = ({ trip, showViewDetails = true }: TripCardProps) => {
  const navigate = useNavigate();
  const tripId = trip.title.split(': ')[1];

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Trip #{tripId}</span>
          <span className="text-sm font-normal text-muted-foreground">{trip.booking_type}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{trip.hotel}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CalendarClock className="h-4 w-4 text-primary" />
          <span>{trip.pickup} - {trip.dropoff}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-primary" />
          <span>{trip.total_persons} Persons</span>
        </div>
        {showViewDetails && (
          <Button 
            className="w-full mt-4"
            onClick={() => navigate(`/trip/${trip.id}`)}
          >
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TripCard;