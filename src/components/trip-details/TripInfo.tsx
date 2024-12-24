import { Users, MapPinHouse, CircleArrowDown, MapPin, Clock, NotepadTextDashed } from 'lucide-react';

interface TripInfoProps {
  customer: string;
  hotel: string;
  fromLocation: string;
  toLocation: string;
  pickup: string;
  totalPersons: number;
  tripNote: string;
}

const TripInfo = ({ customer, hotel, fromLocation, toLocation, pickup, totalPersons, tripNote }: TripInfoProps) => {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" />
        <span>Guest Name: {customer}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPinHouse className="h-4 w-4 text-primary" />
        <span>Hotel: {hotel}</span>
      </div>
      <div className="flex items-center gap-2">
        <CircleArrowDown className="h-4 w-4 text-secondary" />
        <span>Pick-up: {fromLocation}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-green-500" />
        <span>Drop-off: {toLocation}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        <span>Start Time: {pickup}</span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" />
        <span>PAX: {totalPersons} Persons</span>
      </div>
      {tripNote && (
      <div className="flex items-center gap-2 bg-yellow-100 text-red-500 p-2 rounded">
        <NotepadTextDashed className="h-4 w-4 text-secondary" />
        <span>Note: {tripNote} </span>
        </div>
        )}
    </div>
  );
};

export default TripInfo;