import ImportantNumbers from "@/components/ImportantNumbers";
import Schedule from "@/components/Schedule";
import DonationSection from "@/components/DonationSection";
import WorkSchedule from "@/components/WorkSchedule";
import PvzSection from "@/components/PvzSection";
import ActionButtons from "@/components/ActionButtons";
import DoctorAppointment from "@/components/DoctorAppointment";

interface Photo {
  url: string;
  caption: string;
}

interface HomeProps {
  onOpenPhotoCarousel: (photos: Photo[], startIndex: number) => void;
}

const Home = ({ onOpenPhotoCarousel }: HomeProps) => {
  return (
    <>
      <ImportantNumbers data-tutorial="search-input" />
      <Schedule data-tutorial="categories" />
      <DonationSection />
      <WorkSchedule />
      <PvzSection onOpenPhotoCarousel={onOpenPhotoCarousel} />
      <DoctorAppointment />
      <ActionButtons />
    </>
  );
};

export default Home;