import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import BaseMap from '@/components/TripMap';

interface TripMapProps {
  fromLat: string;
  fromLng: string;
  toLat: string;
  toLng: string;
  onNavigationClick: () => void;
}

const TripMap = ({ fromLat, fromLng, toLat, toLng, onNavigationClick }: TripMapProps) => {
  return (
    <div className="relative">
      <BaseMap
        fromLat={fromLat}
        fromLng={fromLng}
        toLat={toLat}
        toLng={toLng}
      />
      <Button
        variant="default"
        size="icon"
        className="absolute bottom-4 right-4 bg-primary"
        onClick={onNavigationClick}
      >
        <Navigation className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TripMap;