import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const Header = () => {
  return (
    <div data-tutorial="header" className="bg-gorkhon-pink text-white px-3 sm:px-4 pb-6 sm:pb-8 pt-[calc(env(safe-area-inset-top)+1.5rem)] sm:pt-[calc(env(safe-area-inset-top)+2rem)] rounded-b-[2rem] sm:rounded-b-[2.5rem]" style={{backgroundColor: '#F1117E'}}>
      <div className="w-full max-w-md mx-auto text-center">
        <div className="flex flex-col items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Горхон.Online
          </h1>
        </div>
        
        <div className="space-y-0.5 sm:space-y-1">
          <p className="text-white/95 font-medium text-sm sm:text-base">Вся нужная информация под рукой</p>
          <p className="text-white/85 text-xs sm:text-sm">Добро пожаловать в цифровое сердце нашего поселка</p>
        </div>
      </div>
    </div>
  );
};

export default Header;