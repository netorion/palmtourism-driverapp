import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import TripCardOthers from "@/components/TripCardOthers";

interface Trip {
  id: string;
  title: string;
  pickup: string;
  dropoff: string;
  hotel: string;
  driver: string;
  total_persons: number;
  booking_type: string;
  type: string;
  trip_status: string;
  service: string;
  start: string;
  customer: string;
}

const AllTrips = () => {
  const { driver } = useAuth();

  const { data: otherTrips, isLoading } = useQuery({
    queryKey: ['otherTrips', driver?.driver_id],
    queryFn: async () => {
      const response = await fetch(`https://www.palmtourism-uae.net/api/trips/others/${driver?.driver_id}`);
      return response.json() as Promise<Trip[]>;
    },
    enabled: !!driver?.driver_id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 pt-16">
      <h1 className="text-2xl font-bold mb-6">All Trips (Other Drivers)</h1>
      
      <div className="space-y-4">
        {otherTrips && otherTrips.length > 0 ? (
          otherTrips.map((trip) => (
            <TripCardOthers key={trip.id} trip={trip} showViewDetails={false} />
          ))
        ) : (
          <p className="text-center text-muted-foreground">No trips assigned to other drivers</p>
        )}
      </div>
    </div>
  );
};

export default AllTrips;