import { Button } from '@/components/ui/button';

interface TripActionsProps {
  tripStatus: string;
  onStartTrip: () => void;
  onEndTrip: () => void;
}

const TripActions = ({ tripStatus, onStartTrip, onEndTrip }: TripActionsProps) => {
  if (tripStatus === 'yettostart') {
    return (
      <Button 
        className="w-full bg-green-500 hover:bg-green-600" 
        onClick={onStartTrip}
      >
        Start Trip
      </Button>
    );
  }

  if (tripStatus === 'ongoing') {
    return (
      <Button 
        className="w-full bg-red-500 hover:bg-red-600" 
        onClick={onEndTrip}
      >
        End Trip
      </Button>
    );
  }

  return null;
};

export default TripActions;