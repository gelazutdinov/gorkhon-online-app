import ImportantNumbers from "@/components/ImportantNumbers";
import Schedule from "@/components/Schedule";
import DonationSection from "@/components/DonationSection";
import WorkSchedule from "@/components/WorkSchedule";
import PvzSection from "@/components/PvzSection";
import ActionButtons from "@/components/ActionButtons";
import TrackableComponent from "@/components/TrackableComponent";
import WeatherWidget from "@/components/features/WeatherWidget";

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
  
  return (
    <div className="space-y-8">
      <TrackableComponent feature="importantNumbers">
        <div className="transform hover:scale-[1.02] transition-transform duration-300">
          <ImportantNumbers data-tutorial="search-input" />
        </div>
      </TrackableComponent>
      
      <TrackableComponent feature="schedule">
        <div className="transform hover:scale-[1.02] transition-transform duration-300">
          <Schedule data-tutorial="categories" />
        </div>
      </TrackableComponent>
      
      <TrackableComponent feature="donation">
        <div className="transform hover:scale-[1.02] transition-transform duration-300">
          <DonationSection />
        </div>
      </TrackableComponent>
      
      <TrackableComponent feature="workSchedule">
        <div className="transform hover:scale-[1.02] transition-transform duration-300">
          <WorkSchedule />
        </div>
      </TrackableComponent>
      
      <TrackableComponent feature="weather">
        <div className="transform hover:scale-[1.02] transition-transform duration-300">
          <WeatherWidget />
        </div>
      </TrackableComponent>

      <TrackableComponent feature="pvz">
        <div className="transform hover:scale-[1.02] transition-transform duration-300">
          <PvzSection onOpenPhotoCarousel={onOpenPhotoCarousel} />
        </div>
      </TrackableComponent>
      
      <div className="transform hover:scale-[1.02] transition-transform duration-300">
        <ActionButtons />
      </div>
    </div>
  );
};

export default Home;