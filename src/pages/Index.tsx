import { useState } from "react";
import Header from "@/components/Header";
import ImportantNumbers from "@/components/ImportantNumbers";
import Schedule from "@/components/Schedule";
import DonationSection from "@/components/DonationSection";
import WorkSchedule from "@/components/WorkSchedule";
import PvzSection from "@/components/PvzSection";
import ActionButtons from "@/components/ActionButtons";
import PhotoCarousel from "@/components/PhotoCarousel";

const Index = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedPvzPhotos, setSelectedPvzPhotos] = useState<{url: string; caption: string}[]>([]);

  const openPhotoCarousel = (photos: {url: string; caption: string}[], startIndex: number) => {
    setSelectedPvzPhotos(photos);
    setSelectedImageIndex(startIndex);
  };

  const closePhotoCarousel = () => {
    setSelectedImageIndex(null);
    setSelectedPvzPhotos([]);
  };

  const nextPhoto = () => {
    if (selectedImageIndex !== null && selectedPvzPhotos.length > 0) {
      setSelectedImageIndex((selectedImageIndex + 1) % selectedPvzPhotos.length);
    }
  };

  const prevPhoto = () => {
    if (selectedImageIndex !== null && selectedPvzPhotos.length > 0) {
      setSelectedImageIndex(selectedImageIndex === 0 ? selectedPvzPhotos.length - 1 : selectedImageIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <ImportantNumbers />
        <Schedule />
        <DonationSection />
        <WorkSchedule />
        <PvzSection onOpenPhotoCarousel={openPhotoCarousel} />
        <ActionButtons />
      </div>

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