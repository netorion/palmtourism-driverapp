import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import TripCard from "@/components/TripCard";

interface Trip {
  id: string;
  title: string;
  pickup: string;
  dropoff: string;
  hotel: string;
  customer: string;
  total_persons: number;
  booking_type: string;
  type: string;
  trip_status: string;
  trip_status_text: string;
  service: string;
  start: string;
}

const MyTrips = () => {
  const { driver } = useAuth();

  const { data: pendingTrips, isLoading: pendingLoading } = useQuery({
    queryKey: ['pendingTrips', driver?.driver_id],
    queryFn: async () => {
      const response = await fetch(`https://www.palmtourism-uae.net/api/trips/pending/${driver?.driver_id}`);
      return response.json() as Promise<Trip[]>;
    },
    enabled: !!driver?.driver_id,
  });

  const { data: completedTrips, isLoading: completedLoading } = useQuery({
    queryKey: ['completedTrips', driver?.driver_id],
    queryFn: async () => {
      const response = await fetch(`https://www.palmtourism-uae.net/api/trips/completed/${driver?.driver_id}`);
      return response.json() as Promise<Trip[]>;
    },
    enabled: !!driver?.driver_id,
  });

  const { data: canceledTrips, isLoading: canceledLoading } = useQuery({
    queryKey: ['canceledTrips', driver?.driver_id],
    queryFn: async () => {
      const response = await fetch(`https://www.palmtourism-uae.net/api/trips/cancelled/${driver?.driver_id}`);
      return response.json() as Promise<Trip[]>;
    },
    enabled: !!driver?.driver_id,
  });

  if (pendingLoading || completedLoading || canceledLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 pt-16">
      <h1 className="text-2xl font-bold mb-6">Trips for {driver?.driver_name}</h1>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="canceled">Canceled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <div className="space-y-4">
            {pendingTrips && pendingTrips.length > 0 ? (
              pendingTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))
            ) : (
              <p className="text-center text-muted-foreground">No pending trips</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="space-y-4">
            {completedTrips && completedTrips.length > 0 ? (
              completedTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} showViewDetails={false} />
              ))
            ) : (
              <p className="text-center text-muted-foreground">No completed trips</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="canceled">
          <div className="space-y-4">
            {canceledTrips && canceledTrips.length > 0 ? (
              canceledTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} showViewDetails={false} />
              ))
            ) : (
              <p className="text-center text-muted-foreground">No canceled trips</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyTrips;