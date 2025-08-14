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
import SecuritySettings from "@/components/security/SecuritySettings";
import DigitalRuble from "@/components/economy/DigitalRuble";
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
    <div className="min-h-screen bg-gray-50 relative overflow-x-hidden">
      
      <Header />

      <main className="relative z-10 min-h-screen">
        {activeSection === 'home' && (
          <div className="w-full max-w-md mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-20 sm:pb-24 space-y-4 sm:space-y-6">
            <StoriesContainer />
            <Home onOpenPhotoCarousel={openPhotoCarousel} />
          </div>
        )}
        {activeSection === 'weather' && (
          <div className="w-full max-w-md mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-20 sm:pb-24 space-y-4 sm:space-y-6">
            <WeatherSourcesPanel />
            <WeatherSection />
          </div>
        )}
        {activeSection === 'news' && (
          <div className="w-full max-w-md mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-20 sm:pb-24 space-y-4 sm:space-y-6">
            <News />
          </div>
        )}
        {activeSection === 'profile' && (
          <div className="w-full max-w-md mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-20 sm:pb-24">
            <PersonalAccount onSectionChange={handleSectionChange} />
          </div>
        )}
        {activeSection === 'digital_ruble' && (
          <div className="w-full max-w-md mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-20 sm:pb-24 space-y-4 sm:space-y-6">
            <DigitalRuble />
          </div>
        )}
        {activeSection === 'security' && (
          <div className="w-full max-w-md mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-20 sm:pb-24 space-y-4 sm:space-y-6">
            <SecuritySettings />
          </div>
        )}
        {activeSection === 'support' && (
          <div className="max-w-md mx-auto px-4 py-6 pb-24 space-y-6">
            <Support />
          </div>
        )}
      </main>

      <PhotoCarousel 
        selectedImageIndex={selectedImageIndex}
        selectedPvzPhotos={selectedPvzPhotos}
        onClose={closePhotoCarousel}
        onNext={nextPhoto}
        onPrev={prevPhoto}
      />

      <BottomNavigation activeSection={activeSection} onSectionChange={handleSectionChange} />
    </div>
  );
};

export default Index;