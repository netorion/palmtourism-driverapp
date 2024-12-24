import { Home, Car, Map, Bell, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/useNotifications';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { notifications } = useNotifications();

  const unreadCount = notifications?.filter(n => n.is_read === "0").length || 0;

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
    { icon: Map, label: 'Other Driver Trips', path: '/all-trips' },
    { icon: Bell, label: 'Notifications', path: '/notifications', count: unreadCount },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center p-2 rounded-lg relative",
              location.pathname === item.path
                ? "text-primary"
                : "text-gray-500 hover:text-primary"
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{item.label}</span>
            {item.count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {item.count}
              </span>
            )}
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