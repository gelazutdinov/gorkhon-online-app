import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const Header = () => {
  return (
    <div data-tutorial="header" className="bg-white px-3 sm:px-4 py-6 sm:py-8 border-b border-gray-200">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="flex flex-col items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Горхон.Online
          </h1>
        </div>
        
        <div className="space-y-0.5 sm:space-y-1">
          <p className="text-gray-600 font-medium text-sm sm:text-base">Вся нужная информация под рукой</p>
          <p className="text-gray-500 text-xs sm:text-sm">Добро пожаловать в цифровое сердце нашего поселка</p>
        </div>
      </div>
    </div>
  );
};

export default Header;