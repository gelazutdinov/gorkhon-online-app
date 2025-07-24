import { useState, useCallback } from "react";
import Header from "@/components/Header";
import ImportantNumbers from "@/components/ImportantNumbers";
import Schedule from "@/components/Schedule";
import DonationSection from "@/components/DonationSection";
import WorkSchedule from "@/components/WorkSchedule";
import PvzSection from "@/components/PvzSection";
import ActionButtons from "@/components/ActionButtons";
import PhotoCarousel from "@/components/PhotoCarousel";

interface Photo {
  url: string;
  caption: string;
}

const Index = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedPvzPhotos, setSelectedPvzPhotos] = useState<Photo[]>([]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-green-50/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gorkhon-blue/5 rounded-full blur-2xl"></div>
        <div className="absolute top-40 right-8 w-24 h-24 bg-gorkhon-pink/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 left-8 w-28 h-28 bg-gorkhon-green/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-12 w-20 h-20 bg-gorkhon-orange/5 rounded-full blur-lg"></div>
      </div>
      
      <Header />

      <main className="max-w-md mx-auto px-4 py-6 space-y-6 relative z-10">
        <ImportantNumbers />
        <Schedule />
        <DonationSection />
        <WorkSchedule />
        <PvzSection onOpenPhotoCarousel={openPhotoCarousel} />
        <ActionButtons />
      </main>

      <PhotoCarousel 
        selectedImageIndex={selectedImageIndex}
        selectedPvzPhotos={selectedPvzPhotos}
        onClose={closePhotoCarousel}
        onNext={nextPhoto}
        onPrev={prevPhoto}
      />
    </div>
  );
};

export default Index;