import Icon from "@/components/ui/icon";

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

const Header = ({ onMenuClick, isSidebarOpen }: HeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 shadow-md md:rounded-none rounded-b-xl" style={{backgroundColor: '#F1117E'}}>
      <div className="px-4 py-8 md:py-6 flex items-center justify-between">
        <div className="md:hidden flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <img 
              src="https://cdn.poehali.dev/files/09336db0-43b6-49a2-8f46-7faa33fce4f7.png" 
              alt="Горхон.Online" 
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-white font-medium text-lg">Горхон.Online</h1>
          </div>
          <button 
            onClick={onMenuClick}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Icon name="Menu" size={24} />
          </button>
        </div>
        
        <div className="hidden md:flex items-center justify-between max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <img 
              src="https://cdn.poehali.dev/files/09336db0-43b6-49a2-8f46-7faa33fce4f7.png" 
              alt="Горхон.Online" 
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-white font-medium text-lg">Горхон.Online</h1>
          </div>
          <button 
            onClick={onMenuClick}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Icon name="Menu" size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
