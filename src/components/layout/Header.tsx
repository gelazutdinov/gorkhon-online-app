import Icon from "@/components/ui/icon";

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

const Header = ({ onMenuClick, isSidebarOpen }: HeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-gradient-to-r from-pink-500 to-pink-600 shadow-lg">
      <div className="px-4 py-3 md:py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <img 
              src="https://cdn.poehali.dev/files/09336db0-43b6-49a2-8f46-7faa33fce4f7.png" 
              alt="Горхон.Online" 
              className="w-6 h-6 md:w-8 md:h-8 object-contain"
            />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg md:text-xl tracking-tight">Горхон.Online</h1>
            <p className="text-white/80 text-xs hidden md:block">Информационный портал посёлка</p>
          </div>
        </div>
        <button 
          onClick={onMenuClick}
          className="text-white p-2.5 hover:bg-white/20 rounded-xl transition-all active:scale-95 relative"
          aria-label="Открыть меню"
        >
          <Icon name="Menu" size={24} />
        </button>
      </div>
    </div>
  );
};

export default Header;