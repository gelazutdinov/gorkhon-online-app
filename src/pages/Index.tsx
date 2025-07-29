import { useState, useCallback } from "react";
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
import SecuritySettings from "@/components/security/SecuritySettings";
import DigitalRuble from "@/components/economy/DigitalRuble";
import SmartHome from "@/components/smart/SmartHome";


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

  return (
    <div className="min-h-screen bg-gray-50 relative">
      
      <Header />

      <main className="max-w-md mx-auto px-4 py-6 pb-24 space-y-6 relative z-10">
        {activeSection === 'home' && (
          <Home onOpenPhotoCarousel={openPhotoCarousel} />
        )}
        {activeSection === 'profile' && <PersonalAccount onSectionChange={handleSectionChange} />}
        {activeSection === 'smart' && <SmartHome />}
        {activeSection === 'digital_ruble' && <DigitalRuble />}
        {activeSection === 'security' && <SecuritySettings />}
        {activeSection === 'news' && <News />}
        {activeSection === 'support' && <Support />}
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