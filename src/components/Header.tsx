import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const Header = () => {
  return (
    <div className="bg-gorkhon-pink text-white px-4 py-6 relative overflow-hidden rounded-b-3xl">

      
      <div className="max-w-md mx-auto text-center relative z-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <img 
            src="https://cdn.poehali.dev/files/0ca339b4-243b-452e-a71d-b8405f228c6e.png" 
            alt="Логотип Горхон Online" 
            className="w-12 h-12 rounded-2xl shadow-lg"
          />
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Горхон.Online</h1>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium">beta</span>
          </div>
        </div>
        <p className="text-white/90">Вся нужная информация под рукой</p>
      </div>
      

    </div>
  );
};

export default Header;