import { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import ImportantNumbers from "@/components/ImportantNumbers";
import Schedule from "@/components/Schedule";
import DonationSection from "@/components/DonationSection";
import WorkSchedule from "@/components/WorkSchedule";
import PvzSection from "@/components/PvzSection";
import ActionButtons from "@/components/ActionButtons";
import PhotoCarousel from "@/components/PhotoCarousel";
import PersonalAccount from "@/components/sections/PersonalAccount";
import News from "@/components/sections/News";
import Support from "@/components/sections/Support";
import Home from "@/components/sections/Home";
import WeatherSection from "@/components/weather/WeatherSection";
import WeatherSourcesPanel from "@/components/features/WeatherSourcesPanel";


import StoriesContainer from "@/components/stories/StoriesContainer";




import BottomNavigation from "@/components/BottomNavigation";
import Icon from "@/components/ui/icon";
import { useUser } from "@/hooks/useUser";

interface Photo {
  url: string;
  caption: string;
}

const Index = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedPvzPhotos, setSelectedPvzPhotos] = useState<Photo[]>([]);
  const [activeSection, setActiveSection] = useState('home');
  const { trackSectionVisit } = useUser();

  const openPhotoCarousel = useCallback((photos: Photo[], startIndex: number) => {
    console.log('openPhotoCarousel called:', photos, startIndex);
    setSelectedPvzPhotos(photos);
    setSelectedImageIndex(startIndex);
  }, []);

  const closePhotoCarousel = useCallback(() => {
    setSelectedImageIndex(null);
    setSelectedPvzPhotos([]);
  }, []);

  const nextPhoto = useCallback(() => {
    if (selectedImageIndex !== null && selectedPvzPhotos.length > 0) {
      setSelectedImageIndex((selectedImageIndex + 1) % selectedPvzPhotos.length);
    }
  }, [selectedImageIndex, selectedPvzPhotos.length]);

  const prevPhoto = useCallback(() => {
    if (selectedImageIndex !== null && selectedPvzPhotos.length > 0) {
      setSelectedImageIndex(selectedImageIndex === 0 ? selectedPvzPhotos.length - 1 : selectedImageIndex - 1);
    }
  }, [selectedImageIndex, selectedPvzPhotos.length]);

  // Отслеживание переходов между разделами
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    trackSectionVisit(section as any);
  };

  // Обработчик перехода к погоде из Stories
  useEffect(() => {
    const handleNavigateToWeather = () => {
      setActiveSection('weather');
    };

    window.addEventListener('navigate-to-weather', handleNavigateToWeather);
    return () => window.removeEventListener('navigate-to-weather', handleNavigateToWeather);
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      
      {/* VK-style Header - Mobile First */}
      <div className="fixed top-0 left-0 right-0 z-50 shadow-md" style={{backgroundColor: '#F1117E'}}>
        <div className="px-4 py-4 flex items-center justify-between">
          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col w-full">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src="/img/88b128b0-40d4-4d3c-b30d-05ff44053cff.jpg" 
                  alt="Горхон.Online" 
                  className="w-6 h-6 object-cover rounded-full"
                />
              </div>
              <h1 className="text-white font-medium text-lg">Горхон.Online</h1>
            </div>
            <div className="mt-2">
              <p className="text-white/90 text-sm font-medium">Платформа для жителей Горхона</p>
              <p className="text-white/70 text-xs">Вся нужная информация под рукой</p>
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden md:flex flex-col max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src="/img/88b128b0-40d4-4d3c-b30d-05ff44053cff.jpg" 
                    alt="Горхон.Online" 
                    className="w-6 h-6 object-cover rounded-full"
                  />
                </div>
                <h1 className="text-white font-medium text-lg">Горхон.Online</h1>
              </div>
              <div className="text-right">
                <p className="text-white/90 text-sm font-medium">Добро пожаловать в цифровое сердце нашего поселка</p>
              </div>
            </div>
            <div className="mt-1">
              <p className="text-white/80 text-sm">Платформа для жителей Горхона • Вся нужная информация под рукой</p>
            </div>
          </div>
        </div>
      </div>

      {/* VK-style Layout */}
      <div className="flex pt-20 md:pt-24">
        {/* Left Sidebar */}
        <div className="hidden md:block w-64 bg-white border-r border-gray-200 fixed left-0 top-24 bottom-0 overflow-y-auto">
          <div className="p-4 space-y-2">
            {[
              { key: 'profile', label: 'Профиль', icon: 'User' },
              { key: 'home', label: 'Главная', icon: 'Home' },
              { key: 'news', label: 'Новости', icon: 'Newspaper' },
              { key: 'weather', label: 'Погода', icon: 'Cloud' },
              { key: 'support', label: 'Поддержка', icon: 'HelpCircle' }
            ].map(item => (
              <button
                key={item.key}
                onClick={() => handleSectionChange(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === item.key 
                    ? 'text-white' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                style={activeSection === item.key ? {backgroundColor: '#F1117E'} : {}}
              >
                <Icon name={item.icon as any} size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 bg-gray-50 min-h-screen relative z-10">
          <div className="max-w-2xl mx-auto p-3 md:p-4 space-y-3 md:space-y-4 pb-20 md:pb-4">
            {activeSection === 'home' && (
              <>
                <StoriesContainer />
                <Home onOpenPhotoCarousel={openPhotoCarousel} />
              </>
            )}
            {activeSection === 'weather' && (
              <>
                <WeatherSourcesPanel />
                <WeatherSection />
              </>
            )}
            {activeSection === 'profile' && <PersonalAccount onSectionChange={handleSectionChange} />}
            {activeSection === 'news' && <News />}
            {activeSection === 'support' && <Support />}
          </div>
        </main>

      <PhotoCarousel 
        selectedImageIndex={selectedImageIndex}
        selectedPvzPhotos={selectedPvzPhotos}
        onClose={closePhotoCarousel}
        onNext={nextPhoto}
        onPrev={prevPhoto}
      />

      {/* VK-style Bottom Navigation for mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
        <div className="flex items-stretch" style={{paddingBottom: 'env(safe-area-inset-bottom)'}}>
          {[
            { key: 'profile', label: 'Профиль', icon: 'User' },
            { key: 'home', label: 'Главная', icon: 'Home' },
            { key: 'news', label: 'Новости', icon: 'Newspaper' },
            { key: 'weather', label: 'Погода', icon: 'Cloud' },
            { key: 'support', label: 'Чат', icon: 'MessageSquare' }
          ].map(item => (
            <button
              key={item.key}
              onClick={() => handleSectionChange(item.key)}
              className={`flex-1 flex flex-col items-center py-2 px-1 transition-all duration-200 ${
                activeSection === item.key 
                  ? 'transform scale-105' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              style={activeSection === item.key ? {color: '#F1117E'} : {}}
            >
              <div className={`p-1 rounded-full transition-all ${
                activeSection === item.key ? 'bg-pink-50' : ''
              }`}>
                <Icon name={item.icon as any} size={22} />
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Index;