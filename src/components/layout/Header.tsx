import Icon from "@/components/ui/icon";

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

const Header = ({ onMenuClick, isSidebarOpen }: HeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 shadow-md md:rounded-none rounded-b-xl" style={{backgroundColor: '#F1117E', paddingTop: 'max(env(safe-area-inset-top, 0px), 8px)'}}>
      <div className="px-3 py-3 md:py-4 flex items-center justify-between">
        <div className="md:hidden flex items-center justify-center w-full relative">
          <img 
            src="https://cdn.poehali.dev/files/412f3baa-4662-472a-9072-a6d85f527a4e.png" 
            alt="Горхон.Online" 
            className="h-10 w-auto object-contain"
          />
          <button 
            onClick={onMenuClick}
            className="absolute right-0 text-white p-3 -m-2 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
            aria-label="Открыть меню"
          >
            <Icon name="Menu" size={28} />
          </button>
        </div>
        
        <div className="hidden md:flex items-center justify-between max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <img 
              src="https://cdn.poehali.dev/files/1a1a192c-75b6-4f34-a536-33e715eec24e.png" 
              alt="Горхон.Online" 
              className="h-14 w-auto object-contain"
            />
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