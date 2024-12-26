import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface Driver {
  driver_id: string;
  driver_name: string;
  driver_mobile: string;
}

interface AuthContextType {
  driver: Driver | null;
  login: (mobile: string, password: string) => Promise<Driver>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedDriver = localStorage.getItem('driver');
    if (storedDriver) {
      setDriver(JSON.parse(storedDriver));
    }
    setIsLoading(false);
  }, []);

  const login = async (mobile: string, password: string) => {
    try {
      console.log('Preparing login request with mobile:', mobile);
      
      const formData = new FormData();
      formData.append('mobile', mobile);
      formData.append('password', password);

      console.log('Sending login request...');
      
      const response = await fetch('https://www.palmtourism-uae.net/api/auth/login', {
        method: 'POST',
        body: formData,
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);

      if (data.status === 'success') {
        const driverData = data.driver;
        setDriver(driverData);
        localStorage.setItem('driver', JSON.stringify(driverData));
        navigate('/dashboard');
        toast({
          title: "Success",
          description: "Welcome back!",
        });
        return driverData;
      } else {
        console.error('Login failed:', data);
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid credentials. Please try again.",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('https://www.palmtourism-uae.net/api/auth/logout');
      setDriver(null);
      localStorage.removeItem('driver');
      navigate('/login');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ driver, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}