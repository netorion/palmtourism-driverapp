import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

interface TripStats {
  pending: number;
  completed: number;
  canceled: number;
}

const Dashboard = () => {
  const { driver } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['tripStats', driver?.driver_id],
    queryFn: async () => {
      const response = await fetch(`https://www.palmtourism-uae.net/api/trips/stats/${driver?.driver_id}`);
      return response.json() as Promise<TripStats>;
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
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6">Welcome, {driver?.driver_name}</h1>
      
      <div className="grid grid-cols-2 gap-4">
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
        
        <Card className="bg-destructive/10 col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Canceled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.canceled || 0}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;