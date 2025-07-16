import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const Header = () => {
  return (
    <div className="bg-gorkhon-pink text-white px-4 py-6 relative overflow-hidden rounded-b-3xl">
      {/* Abstract Background Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url('https://cdn.poehali.dev/files/8f138a31-25be-4bb8-b2a9-0f539909f82d.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: 'float 8s ease-in-out infinite'
        }}
      />
      
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
      
      {/* Quick Actions */}
      <div className="max-w-md mx-auto px-4 mt-6">
        <div className="grid grid-cols-2 gap-3">
          <Button className="h-16 bg-gorkhon-blue hover:bg-gorkhon-blue/90 text-white flex flex-col items-center gap-1 rounded-2xl">
            <Icon name="Phone" size={20} />
            <span className="text-sm">Экстренные службы</span>
          </Button>
          <Button className="h-16 bg-gorkhon-green hover:bg-gorkhon-green/90 text-white flex flex-col items-center gap-1 rounded-2xl">
            <Icon name="Bus" size={20} />
            <span className="text-sm">Расписание</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;