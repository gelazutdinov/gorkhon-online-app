import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const Header = () => {
  return (
    <div data-tutorial="header" className="bg-gorkhon-pink text-white px-3 sm:px-4 py-6 sm:py-8 relative overflow-hidden rounded-b-[2rem] sm:rounded-b-[2rem]" style={{backgroundColor: '#F1117E'}}>

      
      <div className="w-full max-w-md mx-auto text-center relative z-10">
        <div className="flex flex-col items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Горхон.Online
          </h1>
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