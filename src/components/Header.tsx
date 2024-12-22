import { Car } from 'lucide-react';

const Header = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Car className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-primary">DriverHub</span>
        </div>
      </div>
    </div>
  );
};

export default Header;