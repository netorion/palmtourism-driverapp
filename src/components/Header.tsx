const Header = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/916bca56-d2c7-43fb-bca6-5885d648e11e.png" 
            alt="Palm Tourism Logo" 
            className="h-6 w-auto"
          />
          <span className="text-lg font-semibold text-primary">Palm Tourism LLC - Drivers App</span>
        </div>
      </div>
    </div>
  );
};

export default Header;