import { useState, useCallback, memo, useEffect } from "react";
import PhotoCarousel from "@/components/PhotoCarousel";
import NotificationsBanner from "@/components/NotificationsBanner";
import InstallPrompt from "@/components/InstallPrompt";
import UpdateNotification from "@/components/UpdateNotification";
import SplashScreen from "@/components/SplashScreen";
import RecommendationNotice from "@/components/RecommendationNotice";
import Home from "@/components/sections/Home";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ChatModal from "@/components/chat/ChatModal";
import DocumentModal from "@/components/documents/DocumentModal";


interface Photo {
  url: string;
  caption: string;
}

const Index = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedPvzPhotos, setSelectedPvzPhotos] = useState<Photo[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSystemChatOpen, setIsSystemChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState<'privacy' | 'terms' | 'security' | null>(null);
  const [hasNewSystemMessage, setHasNewSystemMessage] = useState(false);

  useEffect(() => {
    const checkNewMessages = () => {
      const savedMessages = localStorage.getItem('systemMessages');
      const lastReadTime = localStorage.getItem('lastReadSystemMessageTime');
      
      if (savedMessages) {
        const messages = JSON.parse(savedMessages);
        if (messages && messages.length > 0) {
          const latestMessageTime = new Date(messages[messages.length - 1].timestamp || 0).getTime();
          const lastRead = lastReadTime ? parseInt(lastReadTime) : 0;
          
          if (latestMessageTime > lastRead) {
            setHasNewSystemMessage(true);
            
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Горхон.Online', {
                body: messages[messages.length - 1].text.substring(0, 100) + '...',
                icon: 'https://cdn.poehali.dev/files/538a3c94-c9c4-4488-9214-dc9493fadb43.png',
                badge: 'https://cdn.poehali.dev/files/538a3c94-c9c4-4488-9214-dc9493fadb43.png',
                tag: 'system-message'
              });
            }
          }
        }
      }
    };

    checkNewMessages();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'systemMessages') {
        checkNewMessages();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSystemChatOpen = () => {
    setIsSystemChatOpen(true);
    setHasNewSystemMessage(false);
    localStorage.setItem('lastReadSystemMessageTime', Date.now().toString());
  };



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

  return (
    <>
      <SplashScreen />
      <div className="min-h-screen bg-white relative overflow-x-hidden w-full max-w-full">
        
        <Header 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          hasNewSystemMessage={hasNewSystemMessage}
        />

        <NotificationsBanner />

        <div className="flex pt-28 md:pt-24">
          <main className="flex-1 bg-gray-50 min-h-screen relative z-10 overflow-x-hidden">
            <div className="max-w-full md:max-w-2xl mx-auto px-4 py-4 md:p-4 space-y-4 md:space-y-4 pb-4">
              <Home onOpenPhotoCarousel={openPhotoCarousel} />
              
              <div className="text-center pt-4 pb-2">
                <a 
                  href="/recommendations-policy.html" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Применяются рекомендательные технологии
                </a>
              </div>
            </div>
          </main>
        </div>

        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onChatOpen={() => setIsChatOpen(true)}
          onSystemChatOpen={handleSystemChatOpen}
          onDocumentOpen={(doc) => setActiveDocument(doc)}
          hasNewSystemMessage={hasNewSystemMessage}
        />

        <ChatModal 
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />

        <ChatModal 
          isOpen={isSystemChatOpen}
          onClose={() => setIsSystemChatOpen(false)}
          isSystemChat={true}
        />

        <DocumentModal 
          activeDocument={activeDocument}
          onClose={() => setActiveDocument(null)}
        />

        <PhotoCarousel 
          selectedImageIndex={selectedImageIndex}
          selectedPvzPhotos={selectedPvzPhotos}
          onClose={closePhotoCarousel}
          onNext={nextPhoto}
          onPrev={prevPhoto}
        />
        
        <InstallPrompt />
        <UpdateNotification />
        <RecommendationNotice />
      </div>
    </>
  );
};

export default memo(Index);