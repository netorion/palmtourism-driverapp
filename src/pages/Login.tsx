import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requestNotificationPermission } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const driverData = await login(mobile, password);
      
      // Request notification permission and get FCM token
      try {
        const fcmToken = await requestNotificationPermission();
        if (fcmToken) {
          // Send FCM token to backend with driver ID
          const formData = new FormData();
          formData.append('token', fcmToken);
          formData.append('user_id', driverData.driver_id);

          console.log(formData);
          
          await fetch('https://www.palmtourism-uae.net/api/notifications/register-device', {
            method: 'POST',
            body: formData,
          });
          
          toast({
            title: "Notifications Enabled",
            description: "You will now receive push notifications",
          });
        }
      } catch (error) {
        console.error('Failed to setup notifications:', error);
        toast({
          variant: "destructive",
          title: "Notification Setup Failed",
          description: "You may not receive push notifications",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/75ad82f9-04a0-49b7-bf5f-9d4d934ee936.png" 
              alt="Palm Tourism Logo" 
              className="h-24 w-auto mb-4"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Driver Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="tel"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;