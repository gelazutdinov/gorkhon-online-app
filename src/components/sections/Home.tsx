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
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return 'Доброй ночи';
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };
  
  return (
    <>
      {/* Приветственная карточка */}
      {user && (
        <div className="bg-gradient-to-r from-gorkhon-pink/10 to-gorkhon-green/10 rounded-2xl p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {getGreeting()}, {user.name}!
              </h2>
              <p className="text-gray-600 flex items-center gap-2">
                <Icon name="Calendar" size={16} />
                {getCurrentDate()}
              </p>
            </div>
            <div className="text-4xl">👋</div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gorkhon-pink">
                <Icon name="MapPin" size={14} />
                <span>Горхон</span>
              </div>
              <div className="flex items-center gap-1 text-gorkhon-green">
                <Icon name="Users" size={14} />
                <span>Активный житель</span>
              </div>
            </div>
          </div>
        </div>
      )}

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