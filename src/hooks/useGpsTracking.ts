import { useState, useEffect, useCallback } from 'react';

interface GpsTrackingOptions {
  carId: string;
  enabled: boolean;
  onError?: (error: string) => void;
}

export const useGpsTracking = ({ carId, enabled, onError }: GpsTrackingOptions) => {
  const [watchId, setWatchId] = useState<number | null>(null);

  const sendLocationToServer = useCallback(async (position: GeolocationPosition) => {
    try {
      const payload = {
        v_id: carId,
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        timestamp: Math.floor(position.timestamp / 1000), // Convert to Unix timestamp
        altitude: position.coords.altitude || 0,
        speed: position.coords.speed || 0,
        bearing: position.coords.heading || 0,
        accuracy: position.coords.accuracy,
        comment: "GPS update from mobile app"
      };

      console.log('Sending GPS data to server:', payload);

      const response = await fetch('https://www.palmtourism-uae.net/api/location_post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to send GPS data');
      }

      const data = await response.json();
      console.log('GPS data sent successfully:', data);
    } catch (error) {
      console.error('Error sending GPS data:', error);
      onError?.('Failed to send GPS data to server');
    }
  }, [carId, onError]);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      onError?.('Geolocation is not supported by your browser');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        sendLocationToServer(position);
      },
      (error) => {
        console.error('Geolocation error:', error);
        onError?.(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    setWatchId(id);
    console.log('GPS tracking started with watch ID:', id);
  }, [sendLocationToServer, onError]);

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      console.log('GPS tracking stopped');
    }
  }, [watchId]);

  useEffect(() => {
    if (enabled && carId && !watchId) {
      startTracking();
    } else if (!enabled && watchId) {
      stopTracking();
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [enabled, carId, watchId, startTracking, stopTracking]);

  return {
    isTracking: watchId !== null,
    stopTracking,
  };
};