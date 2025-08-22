import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const Header = () => {
  return (
    <div data-tutorial="header" className="bg-gorkhon-pink text-white px-3 sm:px-4 py-6 sm:py-8 relative overflow-hidden rounded-b-[2rem] sm:rounded-b-[2rem]" style={{backgroundColor: '#F1117E'}}>

      
      <div className="w-full max-w-md mx-auto text-center relative z-10">
        <div className="flex flex-col items-center gap-3 sm:gap-4 mb-3 sm:mb-4 group">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-2xl sm:rounded-2xl blur-md group-hover:blur-lg transition-all duration-300"></div>
            <img 
              src="https://cdn.poehali.dev/files/0ca339b4-243b-452e-a71d-b8405f228c6e.png" 
              alt="Логотип Горхон Online" 
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl sm:rounded-2xl shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                Горхон.Online
              </h1>
              <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-white/90 font-medium">
                360°
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 text-xs text-white/80">
              <Icon name="Users" size={12} />
              <span>Платформа для жителей Горхона</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-1 sm:space-y-2">
          <p className="text-white/95 font-medium text-sm sm:text-base">Вся нужная информация под рукой</p>
          <p className="text-white/80 text-xs sm:text-sm">Добро пожаловать в цифровое сердце нашего поселка</p>
        </div>


      </div>
      

    </div>
  );
};

export default Header;