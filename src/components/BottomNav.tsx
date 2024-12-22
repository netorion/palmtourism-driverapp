import { Home, Car, Map, Bell, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout. Please try again.",
      });
    }
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Car, label: 'My Trips', path: '/my-trips' },
    { icon: Map, label: 'All Trips', path: '/all-trips' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center p-2 rounded-lg",
              location.pathname === item.path
                ? "text-primary"
                : "text-gray-500 hover:text-primary"
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center p-2 rounded-lg text-gray-500 hover:text-destructive"
        >
          <LogOut className="h-6 w-6" />
          <span className="text-xs mt-1">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;