import { useState, useEffect, memo, useMemo, useCallback } from 'react';
import ImportantNumbers from "@/components/ImportantNumbers";
import Schedule from "@/components/Schedule";
import DonationSection from "@/components/DonationSection";
import WorkSchedule from "@/components/WorkSchedule";
import PvzSection from "@/components/PvzSection";
import ActionButtons from "@/components/ActionButtons";
import WeatherWidget from "@/components/features/WeatherWidget";

import Icon from "@/components/ui/icon";

interface Photo {
  url: string;
  caption: string;
}

interface SectionConfig {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  description: string;
}

interface HomeProps {
  onOpenPhotoCarousel: (photos: Photo[], startIndex: number) => void;
}

const getDefaultSections = (): SectionConfig[] => [
  { id: 'importantNumbers', name: 'Важные номера', enabled: true, order: 1, description: 'Контакты экстренных служб и организаций' },
  { id: 'schedule', name: 'Расписание транспорта', enabled: true, order: 2, description: 'Автобусы и транспорт' },
  { id: 'donation', name: 'Сбор средств', enabled: true, order: 3, description: 'Благотворительные сборы' },
  { id: 'workSchedule', name: 'Режим работы', enabled: true, order: 4, description: 'График работы организаций' },
  { id: 'weather', name: 'Погода', enabled: true, order: 5, description: 'Прогноз погоды' },
  { id: 'pvz', name: 'ПВЗ и фото', enabled: true, order: 6, description: 'Пункты выдачи заказов и фотогалерея' },
  { id: 'actionButtons', name: 'Быстрые действия', enabled: true, order: 7, description: 'Кнопки быстрого доступа' }
];

const Home = ({ onOpenPhotoCarousel }: HomeProps) => {
  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('homePageContent');
      if (savedContent) {
        const content = JSON.parse(savedContent);
        setSections(content.sections || getDefaultSections());
      } else {
        setSections(getDefaultSections());
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек секций:', error);
      setSections(getDefaultSections());
    }
    setLoading(false);
  }, []);

  const renderSection = useCallback((sectionId: string) => {
    switch (sectionId) {
      case 'importantNumbers':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <ImportantNumbers data-tutorial="search-input" />
          </div>
        );
      case 'schedule':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <Schedule data-tutorial="categories" />
          </div>
        );
      case 'donation':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <DonationSection />
          </div>
        );
      case 'workSchedule':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <WorkSchedule />
          </div>
        );
      case 'weather':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <WeatherWidget />
          </div>
        );
      case 'pvz':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <PvzSection onOpenPhotoCarousel={onOpenPhotoCarousel} />
          </div>
        );
      case 'actionButtons':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <ActionButtons />
          </div>
        );
      default:
        return null;
    }
  }, [onOpenPhotoCarousel]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-4 relative">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-autumn-leaf opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          >
            {['🍂', '🍁', '🍃'][i % 3]}
          </div>
        ))}
      </div>
      
      {sections
        .filter(section => section.enabled)
        .sort((a, b) => a.order - b.order)
        .map(section => (
          <div key={section.id}>
            {renderSection(section.id)}
          </div>
        ))
      }
    </div>
  );
};

export default memo(Home);