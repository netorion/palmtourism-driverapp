import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import TripCard from '@/components/TripCard';
import { toast } from '@/hooks/use-toast';

interface TripStats {
  pending: number;
  completed: number;
  canceled: number;
}

interface Trip {
  id: string;
  title: string;
  pickup: string;
  dropoff: string;
  hotel: string;
  total_persons: number;
  booking_type: string;
  type: string;
  trip_status: string;
}

const fetchWithCORS = async (url: string) => {
  console.log('Fetching:', url);
  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetch successful:', url, data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to fetch data. Please try again later.",
    });
    throw error;
  }
};

const Dashboard = () => {
  const { driver } = useAuth();

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['tripStats', driver?.driver_id],
    queryFn: async () => {
      return fetchWithCORS(`https://www.palmtourism-uae.net/api/trips/stats/${driver?.driver_id}`);
    },
    enabled: !!driver?.driver_id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: todaysTrips, isLoading: tripsLoading, error: tripsError } = useQuery({
    queryKey: ['todaysTrips', driver?.driver_id],
    queryFn: async () => {
      return fetchWithCORS(`https://www.palmtourism-uae.net/api/trips/assigned/${driver?.driver_id}`);
    },
    enabled: !!driver?.driver_id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  useEffect(() => {
    if (statsError || tripsError) {
      console.error('Query error:', { statsError, tripsError });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load data. Please check your connection and try again.",
      });
    }
  }, [statsError, tripsError]);

  if (statsLoading || tripsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 pt-16">
      <h1 className="text-2xl font-bold mb-6">Welcome, {driver?.driver_name}</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="bg-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.pending || 0}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.completed || 0}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-destructive/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Canceled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.canceled || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">Today's Trips</h2>
        <div className="space-y-4">
          {todaysTrips && todaysTrips.length > 0 ? (
            todaysTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))
          ) : (
            <p className="text-center text-muted-foreground">No trips scheduled for today</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;