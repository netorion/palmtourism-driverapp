import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: string;
  created_at: string;
}

export const useNotifications = () => {
  const { driver } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3');
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  const { data: notifications } = useQuery({
    queryKey: ['notifications', driver?.driver_id],
    queryFn: async () => {
      if (!driver?.driver_id) return null;
      const response = await fetch(`https://www.palmtourism-uae.net/api/notifications/driver/${driver.driver_id}`);
      const data = await response.json();
      return data.notifications as Notification[];
    },
    enabled: !!driver?.driver_id,
    refetchInterval: 30000, // Poll every 30 seconds
  });

  // Check for new notifications
  useEffect(() => {
    if (!notifications?.length) return;

    const latestNotification = notifications[0];
    console.log('Latest notification:', latestNotification);

    // If this is a new notification
    if (lastNotificationId !== latestNotification.id) {
      console.log('New notification detected');
      setLastNotificationId(latestNotification.id);

      // Play sound
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
      }

      // Show toast
      toast(latestNotification.title, {
        description: latestNotification.message,
        duration: 5000,
      });

      // Show browser notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(latestNotification.title, {
          body: latestNotification.message,
          icon: '/favicon.ico',
        });
      }
    }
  }, [notifications, lastNotificationId]);

  return { notifications };
};