import ImportantNumbers from "@/components/ImportantNumbers";
import Schedule from "@/components/Schedule";
import DonationSection from "@/components/DonationSection";
import WorkSchedule from "@/components/WorkSchedule";
import PvzSection from "@/components/PvzSection";
import ActionButtons from "@/components/ActionButtons";
import TrackableComponent from "@/components/TrackableComponent";
import WeatherWidget from "@/components/features/WeatherWidget";
import HoroscopeWidget from "@/components/features/HoroscopeWidget";
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
    <>
      {/* Погода и гороскоп */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <WeatherWidget />
        <HoroscopeWidget />
      </div>

      {/* Быстрый доступ */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="Zap" size={20} className="text-gorkhon-pink" />
          <h3 className="text-lg font-semibold text-gray-800">Быстрый доступ</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
            <Icon name="Phone" size={18} className="text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-gray-800 text-sm">Экстренные службы</div>
              <div className="text-xs text-blue-600">112, 01, 02, 03</div>
            </div>
          </button>
          <button className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors">
            <Icon name="Bus" size={18} className="text-green-600" />
            <div className="text-left">
              <div className="font-medium text-gray-800 text-sm">Транспорт</div>
              <div className="text-xs text-green-600">Расписание</div>
            </div>
          </button>
        </div>
      </div>
      
      <TrackableComponent feature="importantNumbers">
        <ImportantNumbers data-tutorial="search-input" />
      </TrackableComponent>
      
      <TrackableComponent feature="schedule">
        <Schedule data-tutorial="categories" />
      </TrackableComponent>
      
      <TrackableComponent feature="donation">
        <DonationSection />
      </TrackableComponent>
      
      <TrackableComponent feature="workSchedule">
        <WorkSchedule />
      </TrackableComponent>
      
      <TrackableComponent feature="pvz">
        <PvzSection onOpenPhotoCarousel={onOpenPhotoCarousel} />
      </TrackableComponent>
      
      <ActionButtons />
    </>
  );
};

export default Home;