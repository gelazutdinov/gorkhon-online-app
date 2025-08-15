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
    <div className="space-y-4">
      <TrackableComponent feature="importantNumbers">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <ImportantNumbers data-tutorial="search-input" />
        </div>
      </TrackableComponent>
      
      <TrackableComponent feature="schedule">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Schedule data-tutorial="categories" />
        </div>
      </TrackableComponent>
      
      <TrackableComponent feature="donation">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <DonationSection />
        </div>
      </TrackableComponent>
      
      <TrackableComponent feature="workSchedule">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <WorkSchedule />
        </div>
      </TrackableComponent>
      
      <TrackableComponent feature="weather">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <WeatherWidget />
        </div>
      </TrackableComponent>

      <TrackableComponent feature="pvz">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <PvzSection onOpenPhotoCarousel={onOpenPhotoCarousel} />
        </div>
      </TrackableComponent>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <ActionButtons />
      </div>
    </div>
  );
};

export default Home;