import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const Header = () => {
  return (
    <div className="bg-gradient-to-br from-gorkhon-pink via-gorkhon-pink/90 to-gorkhon-blue/20 text-white px-4 py-8 relative overflow-hidden rounded-b-3xl">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 right-8 w-20 h-20 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-6 left-6 w-16 h-16 bg-gorkhon-blue/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-4 w-8 h-8 bg-gorkhon-green/30 rounded-full animate-bounce delay-500"></div>
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
              <span className="text-xs bg-gorkhon-green/90 px-2 py-1 rounded-full font-medium shadow-lg animate-pulse">
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
          <p className="text-white/95 font-medium">🏘️ Вся нужная информация под рукой</p>
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