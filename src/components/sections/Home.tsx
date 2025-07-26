import ImportantNumbers from "@/components/ImportantNumbers";
import Schedule from "@/components/Schedule";
import DonationSection from "@/components/DonationSection";
import WorkSchedule from "@/components/WorkSchedule";
import PvzSection from "@/components/PvzSection";
import ActionButtons from "@/components/ActionButtons";
import TrackableComponent from "@/components/TrackableComponent";
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