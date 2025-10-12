import { useState } from "react";
import Icon from "@/components/ui/icon";

interface FloatingChatButtonProps {
  onClick: () => void;
}

const FloatingChatButton = ({ onClick }: FloatingChatButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-40 group"
      aria-label="Открыть чат с Линой"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
        
        <div className="relative bg-gradient-to-r from-pink-500 to-pink-600 text-white px-5 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 group-hover:scale-105 active:scale-95">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Icon name="Bot" size={20} />
          </div>
          
          <div className={`overflow-hidden transition-all duration-300 ${isHovered ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0 md:max-w-xs md:opacity-100'}`}>
            <div className="font-semibold text-sm whitespace-nowrap">Лина онлайн</div>
            <div className="text-xs text-white/80 whitespace-nowrap">Готова помочь!</div>
          </div>
          
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
        </div>
      </div>
    </button>
  );
};

export default FloatingChatButton;
