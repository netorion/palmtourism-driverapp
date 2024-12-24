import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MessageSquareText } from 'lucide-react';

interface TripHeaderProps {
  displayTripId: string;
  customerMobile: string;
  onWhatsAppClick: () => void;
  onPhoneClick: () => void;
}

const TripHeader = ({ displayTripId, customerMobile, onWhatsAppClick, onPhoneClick }: TripHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        <span>Transfer #{displayTripId}</span>
        {customerMobile && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPhoneClick}
              className="text-blue-500"
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onWhatsAppClick}
              className="text-green-500"
            >
              <MessageSquareText className="h-5 w-5" />
            </Button>
          </div>
        )}
      </CardTitle>
    </CardHeader>
  );
};

export default TripHeader;