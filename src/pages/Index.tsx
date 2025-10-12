import { useState, useCallback, memo } from "react";







import PhotoCarousel from "@/components/PhotoCarousel";
import News from "@/components/sections/News";

import NotificationsBanner from "@/components/NotificationsBanner";
import InstallPrompt from "@/components/InstallPrompt";
import UpdateNotification from "@/components/UpdateNotification";
import SplashScreen from "@/components/SplashScreen";

import Home from "@/components/sections/Home";
import WeatherSection from "@/components/weather/WeatherSection";









import Icon from "@/components/ui/icon";

interface Photo {
  url: string;
  caption: string;
}

const Index = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedPvzPhotos, setSelectedPvzPhotos] = useState<Photo[]>([]);
  const [activeSection, setActiveSection] = useState('home');

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
  }, []);



  return (
    <>
      <SplashScreen />
      <div className="min-h-screen bg-white relative overflow-x-hidden w-full max-w-full">
      
      {/* VK-style Header - Mobile First */}
      <div className="fixed top-0 left-0 right-0 z-50 shadow-md md:rounded-none rounded-b-xl" style={{backgroundColor: '#F1117E'}}>
        <div className="px-4 py-8 md:py-6 flex items-center justify-between">
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
      <div className="flex pt-28 md:pt-24">
        {/* Main Content */}
        <main className="flex-1 bg-gray-50 min-h-screen relative z-10 overflow-x-hidden">
          <div className="max-w-full md:max-w-2xl mx-auto px-4 py-4 md:p-4 space-y-4 md:space-y-4 pb-4">
            <Home onOpenPhotoCarousel={openPhotoCarousel} />
          </div>
        </main>
      </div>

      <PhotoCarousel 
        selectedImageIndex={selectedImageIndex}
        selectedPvzPhotos={selectedPvzPhotos}
        onClose={closePhotoCarousel}
        onNext={nextPhoto}
        onPrev={prevPhoto}
      />
      
      {/* Промпт установки приложения */}
      <InstallPrompt />
      
      {/* Уведомление об обновлениях */}
      <UpdateNotification />
    </div>
    </>
  );
};

export default memo(Index);