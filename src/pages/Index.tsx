import { useState, useCallback, memo, useEffect } from "react";







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
  const [theme, setTheme] = useState<'system' | 'dark' | 'winter' | 'autumn'>(() => {
    return (localStorage.getItem('gorkhon-theme') as any) || 'system';
  });
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('gorkhon-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
        <main className="flex-1 md:mr-64 bg-gray-50 min-h-screen relative z-10 overflow-x-hidden">
          <div className="max-w-full md:max-w-2xl mx-auto px-4 py-4 md:p-4 space-y-4 md:space-y-4 pb-4">
            <Home onOpenPhotoCarousel={openPhotoCarousel} />
          </div>
        </main>

        {/* Right Sidebar */}
        <div className="hidden md:block w-64 bg-white border-l border-gray-200 fixed right-0 top-24 bottom-0 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Chat with Support */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Поддержка</h3>
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm"
              >
                <Icon name="MessageCircle" size={20} />
                <span className="font-medium">Чат с поддержкой</span>
              </button>
            </div>

            {/* Theme Selector */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Темы оформления</h3>
              <div className="space-y-2">
                {[
                  { key: 'system', label: 'Системная', icon: 'Monitor', gradient: 'from-gray-500 to-gray-600' },
                  { key: 'dark', label: 'Тёмная', icon: 'Moon', gradient: 'from-slate-700 to-slate-900' },
                  { key: 'winter', label: 'Зима ❄️', icon: 'Snowflake', gradient: 'from-blue-400 to-cyan-500' },
                  { key: 'autumn', label: 'Осень 🍂', icon: 'Leaf', gradient: 'from-orange-500 to-amber-600' }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setTheme(item.key as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                      theme === item.key
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-md scale-105`
                        : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Icon name={item.icon as any} size={18} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="md:hidden fixed bottom-20 right-4 z-50 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <Icon name="MessageCircle" size={24} />
      </button>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50" onClick={() => setIsChatOpen(false)}>
          <div 
            className="bg-white rounded-t-2xl md:rounded-2xl w-full md:w-96 md:max-w-md max-h-[80vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{backgroundColor: '#F1117E'}}>
              <div className="flex items-center gap-3">
                <Icon name="MessageCircle" size={24} className="text-white" />
                <h3 className="font-semibold text-white">Чат с поддержкой</h3>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <p className="text-sm text-gray-800">Здравствуйте! Чем могу помочь?</p>
                <span className="text-xs text-gray-500 mt-1 block">Поддержка • сейчас</span>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Напишите сообщение..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors">
                  <Icon name="Send" size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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