import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const Header = () => {
  return (
    <div className="bg-gorkhon-pink text-white px-4 py-8 relative overflow-hidden rounded-b-3xl" style={{backgroundColor: '#F1117E'}}>
      {/* Animated ribbons */}
      <div className="absolute inset-0 pointer-events-none">
        {/* First ribbon */}
        <div className="absolute -top-2 -left-32 w-96 h-8 transform rotate-12 animate-pulse" style={{backgroundColor: '#005BFF'}}>
          <div className="flex items-center justify-center h-full">
            <span className="text-xs font-medium animate-pulse" style={{color: '#F1117E'}}>
              Для жителей. С заботой. Всегда рядом.
            </span>
          </div>
        </div>
        
        {/* Second ribbon */}
        <div className="absolute top-16 -right-32 w-96 h-8 transform -rotate-12 animate-pulse delay-1000" style={{backgroundColor: '#005BFF'}}>
          <div className="flex items-center justify-center h-full">
            <span className="text-xs font-medium animate-pulse" style={{color: '#F1117E'}}>
              Для жителей. С заботой. Всегда рядом.
            </span>
          </div>
        </div>
        
        {/* Third ribbon */}
        <div className="absolute bottom-4 -left-24 w-80 h-6 transform rotate-6 animate-pulse delay-500" style={{backgroundColor: '#005BFF'}}>
          <div className="flex items-center justify-center h-full">
            <span className="text-xs font-medium animate-pulse" style={{color: '#F1117E'}}>
              Для жителей. С заботой. Всегда рядом.
            </span>
          </div>
        </div>
        
        {/* Fourth ribbon */}
        <div className="absolute bottom-12 -right-28 w-72 h-6 transform -rotate-8 animate-pulse delay-1500" style={{backgroundColor: '#005BFF'}}>
          <div className="flex items-center justify-center h-full">
            <span className="text-xs font-medium animate-pulse" style={{color: '#F1117E'}}>
              Для жителей. С заботой. Всегда рядом.
            </span>
          </div>
        </div>
      </div>
      
      <div className="max-w-md mx-auto text-center relative z-10">
        <div className="flex items-center justify-center gap-4 mb-4 group">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300"></div>
            <img 
              src="https://cdn.poehali.dev/files/0ca339b4-243b-452e-a71d-b8405f228c6e.png" 
              alt="Логотип Горхон Online" 
              className="w-14 h-14 rounded-2xl shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                Горхон.Online
              </h1>
              <span className="text-xs bg-gorkhon-green/90 px-2 py-1 rounded-full font-medium shadow-lg">
                360°
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-white/80">
              <Icon name="Users" size={12} />
              <span>Платформа для жителей</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-white/95 font-medium">Вся нужная информация под рукой</p>
          <p className="text-white/80 text-sm">Добро пожаловать в цифровое сердце нашего поселка</p>
        </div>

        {/* Community stats */}
        <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-white/20">
          <div className="text-center">
            <div className="text-lg font-bold text-white">360°</div>
            <div className="text-xs text-white/70">Охват</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">24/7</div>
            <div className="text-xs text-white/70">Доступ</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">∞</div>
            <div className="text-xs text-white/70">Возможности</div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Header;