import ImportantNumbers from "@/components/ImportantNumbers";
import Schedule from "@/components/Schedule";
import DonationSection from "@/components/DonationSection";
import WorkSchedule from "@/components/WorkSchedule";
import PvzSection from "@/components/PvzSection";
import ActionButtons from "@/components/ActionButtons";
import TrackableComponent from "@/components/TrackableComponent";

import Icon from "@/components/ui/icon";
import { useUser } from "@/hooks/useUser";

interface Photo {
  url: string;
  caption: string;
}

interface HomeProps {
  onOpenPhotoCarousel: (photos: Photo[], startIndex: number) => void;
}

const Home = ({ onOpenPhotoCarousel }: HomeProps) => {
  const { user } = useUser();
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Добро пожаловать секция */}
      <div className="bg-gradient-brand rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Добро пожаловать!</h1>
            <p className="text-white/80">Управляйте своим домом с комфортом</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-float">
            <Icon name="Home" size={28} />
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
            <Icon name="Phone" size={20} className="text-gorkhon-blue" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Диспетчерская</h3>
          <p className="text-sm text-gray-600">Экстренная связь</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
            <Icon name="Calendar" size={20} className="text-gorkhon-green" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Расписание</h3>
          <p className="text-sm text-gray-600">График работ</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
            <Icon name="Heart" size={20} className="text-gorkhon-pink" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Пожертвования</h3>
          <p className="text-sm text-gray-600">Помочь проекту</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
            <Icon name="Package" size={20} className="text-gorkhon-orange" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">ПВЗ</h3>
          <p className="text-sm text-gray-600">Пункты выдачи</p>
        </div>
      </div>
      
      <TrackableComponent feature="importantNumbers">
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <ImportantNumbers data-tutorial="search-input" />
        </div>
      </TrackableComponent>
      
      <TrackableComponent feature="schedule">
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <Schedule data-tutorial="categories" />
        </div>
      </TrackableComponent>
      
      <TrackableComponent feature="donation">
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <DonationSection />
        </div>
      </TrackableComponent>
      
      <TrackableComponent feature="workSchedule">
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <WorkSchedule />
        </div>
      </TrackableComponent>
      
      <TrackableComponent feature="pvz">
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <PvzSection onOpenPhotoCarousel={onOpenPhotoCarousel} />
        </div>
      </TrackableComponent>
      
      <div className="transform transition-all duration-300 hover:scale-[1.02]">
        <ActionButtons />
      </div>
    </div>
  );
};

export default Home;