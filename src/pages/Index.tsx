import { useState, useCallback, memo } from "react";







import PhotoCarousel from "@/components/PhotoCarousel";
import PersonalAccount from "@/components/sections/PersonalAccount";
import News from "@/components/sections/News";
import AdminQuickAccess from "@/components/AdminQuickAccess";
import NotificationsBanner from "@/components/NotificationsBanner";
import InstallPrompt from "@/components/InstallPrompt";
import UpdateNotification from "@/components/UpdateNotification";

import Home from "@/components/sections/Home";
import WeatherSection from "@/components/weather/WeatherSection";









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
    setSelectedPvzPhotos(photos);
    setSelectedImageIndex(startIndex);
  }, []);

  const closePhotoCarousel = useCallback(() => {
    setSelectedImageIndex(null);
    setSelectedPvzPhotos([]);
  }, []);

  const nextPhoto = useCallback(() => {
    if (selectedImageIndex !== null && selectedPvzPhotos.length > 0) {
      setSelectedImageIndex((prev) => prev !== null ? (prev + 1) % selectedPvzPhotos.length : 0);
    }
  }, [selectedImageIndex, selectedPvzPhotos.length]);

  const prevPhoto = useCallback(() => {
    if (selectedImageIndex !== null && selectedPvzPhotos.length > 0) {
      setSelectedImageIndex((prev) => prev !== null ? (prev === 0 ? selectedPvzPhotos.length - 1 : prev - 1) : 0);
    }
  }, [selectedImageIndex, selectedPvzPhotos.length]);

  // Отслеживание переходов между разделами
  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
    trackSectionVisit(section as any);
  }, [trackSectionVisit]);



  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden w-full max-w-full">
      
      {/* VK-style Header - Mobile First */}
      <div className="fixed top-0 left-0 right-0 z-50 shadow-md md:rounded-none rounded-b-xl" style={{backgroundColor: '#F1117E'}}>
        <div className="px-4 py-4 flex items-center justify-between">
          {/* Mobile Layout */}
          <div className="md:hidden flex items-center justify-center gap-3 w-full">
            <img 
              src="https://cdn.poehali.dev/files/09336db0-43b6-49a2-8f46-7faa33fce4f7.png" 
              alt="Горхон.Online" 
              className="w-8 h-8 object-contain"
            />
            <div className="flex flex-col">
              <h1 className="text-white font-medium text-lg">Горхон.Online</h1>
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center gap-3 max-w-6xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.poehali.dev/files/09336db0-43b6-49a2-8f46-7faa33fce4f7.png" 
                alt="Горхон.Online" 
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-white font-medium text-lg">Горхон.Online</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Баннер уведомлений */}
      <NotificationsBanner />

      {/* VK-style Layout */}
      <div className="flex pt-24 md:pt-20">
        {/* Left Sidebar */}
        <div className="hidden md:block w-64 bg-white border-r border-gray-200 fixed left-0 top-20 bottom-0 overflow-y-auto">
          <div className="p-4 space-y-2">
            {[
              { key: 'profile', label: 'Профиль', icon: 'User' },
              { key: 'home', label: 'Главная', icon: 'Home' },
              { key: 'news', label: 'Новости', icon: 'Newspaper' },
              { key: 'weather', label: 'Погода', icon: 'Cloud' }
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
        <main className="flex-1 md:ml-64 bg-gray-50 min-h-screen relative z-10 overflow-x-hidden">
          <div className="max-w-full md:max-w-2xl mx-auto px-4 py-4 md:p-4 space-y-4 md:space-y-4 pb-20 sm:pb-24 md:pb-4">
            {activeSection === 'home' && (
              <>
                <Home onOpenPhotoCarousel={openPhotoCarousel} />
              </>
            )}
            {activeSection === 'weather' && (
              <>
                <WeatherSection />
              </>
            )}
            {activeSection === 'profile' && <PersonalAccount onSectionChange={handleSectionChange} />}
            {activeSection === 'news' && <News />}
          </div>
        </main>
      </div>

      {/* VK-style Bottom Navigation for mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg rounded-t-xl" 
           style={{paddingBottom: 'env(safe-area-inset-bottom)'}}>
        <div className="flex items-stretch">
          {[
            { key: 'home', label: 'Главная', icon: 'Home' },
            { key: 'news', label: 'Новости', icon: 'Newspaper' },
            { key: 'weather', label: 'Погода', icon: 'Cloud' },
            { key: 'profile', label: 'Профиль', icon: 'User' }
          ].map(item => (
            <button
              key={item.key}
              onClick={() => handleSectionChange(item.key)}
              className={`flex-1 flex flex-col items-center py-2 px-1 transition-all duration-200 ${
                activeSection === item.key 
                  ? 'text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-all ${
                activeSection === item.key ? 'bg-blue-50' : ''
              }`}>
                <Icon name={item.icon as any} size={20} />
              </div>
            </button>
          ))}
        </div>
      </div>

      <PhotoCarousel 
        selectedImageIndex={selectedImageIndex}
        selectedPvzPhotos={selectedPvzPhotos}
        onClose={closePhotoCarousel}
        onNext={nextPhoto}
        onPrev={prevPhoto}
      />
      
      {/* Кнопка быстрого доступа к админ-панели */}
      <AdminQuickAccess />
      
      {/* Промпт установки приложения */}
      <InstallPrompt />
      
      {/* Уведомление об обновлениях */}
      <UpdateNotification />
    </div>
  );
};

export default memo(Index);