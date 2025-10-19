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
    // Автоматическое обновление номеров у всех пользователей
    const updatePhoneNumbers = () => {
      const currentVersion = '2.0'; // Версия обновления
      const lastUpdate = localStorage.getItem('phoneNumbersVersion');
      
      if (lastUpdate !== currentVersion) {
        const updatedNumbers = {
          importantNumbers: [
            { name: "ФАП Горхон", person: "Медпункт поселка", phone: "+7 (301-36) 9-46-25", icon: "Phone" },
            { name: "Участковый", person: "Бадмаев Баир Баторович", phone: "+7 (924) 754-32-18", icon: "Shield" },
            { name: "Экстренные службы", person: "Полиция, скорая, пожарная", phone: "112", icon: "Ambulance" },
            { name: "Диспетчер РЭС", person: "Электроснабжение 24/7", phone: "8-800-100-75-40", icon: "Zap" },
            { name: "МФЦ Заиграево", person: "Многофункциональный центр", phone: "+7 (301-36) 4-15-15", icon: "Building" },
            { name: "Почта Горхон", person: "Почтовое отделение", phone: "+7 (301-36) 9-42-31", icon: "Mail" },
            { name: "Регистратура поликлиники", person: "Заиграево", phone: "+7 (924) 555-90-03", icon: "Stethoscope" },
            { name: "Соц.защита Заиграево", person: "Социальная защита населения", phone: "+7 (301-36) 4-12-20", icon: "Heart" },
            { name: "Нотариус Заиграево", person: "Нотариальные услуги", phone: "+7 (301-36) 4-16-14", icon: "FileText" },
            { name: "Судебные приставы", person: "Заиграевский район", phone: "8 (301-36) 4-10-10", icon: "Scale" },
            { name: "Вакуумная машина", person: "Кондаков К.Ю., Горхон", phone: "+7 (983) 453-99-02", icon: "Truck" },
            { name: "Миграционная служба", person: "ГАИ Заиграево", phone: "8 (301-36) 4-15-70", icon: "Car" },
            { name: "ЕДДС района", person: "Диспетчерская служба 24/7", phone: "+7 (301-36) 4-51-03", icon: "AlertCircle" }
          ],
          transitNumbers: [
            { name: "Диспетчер Город", person: "Заиграевский транзит", phone: "8-983-420-04-03", icon: "Bus" },
            { name: "Диспетчер Заиграево", person: "Заиграевский транзит", phone: "8-983-420-04-90", icon: "Bus" }
          ]
        };
        
        const existingContent = localStorage.getItem('homePageContent');
        const content = existingContent ? JSON.parse(existingContent) : {};
        
        content.importantNumbers = updatedNumbers.importantNumbers;
        content.transitNumbers = updatedNumbers.transitNumbers;
        
        localStorage.setItem('homePageContent', JSON.stringify(content));
        localStorage.setItem('phoneNumbersVersion', currentVersion);
        
        // Добавляем системное сообщение об обновлении
        const systemMessages = JSON.parse(localStorage.getItem('systemMessages') || '[]');
        const updateMessage = {
          text: `📞 ВАЖНЫЕ НОМЕРА ОБНОВЛЕНЫ!

Актуальные контакты служб Горхона:

🏥 ФАП (медпункт)
📞 +7 (301-36) 9-46-25
⏰ Пн-Пт: 8:00-16:00

👮 Участковый уполномоченный
📞 +7 (924) 754-32-18
👤 Бадмаев Баир Баторович

⚡ Диспетчер РЭС (электричество)
📞 8-800-100-75-40
⏰ Круглосуточно

🏛️ МФЦ Заиграево
📞 +7 (301-36) 4-15-15
⏰ Пн-Пт: 9:00-18:00, Сб: 9:00-13:00

📮 Почта Горхон
📞 +7 (301-36) 9-42-31
⏰ Пн-Пт: 9:00-17:00

🚨 ЭКСТРЕННЫЕ СЛУЖБЫ
📞 112 — Единый номер

📞 ЕДДС района
📞 +7 (301-36) 4-51-03
⏰ Диспетчерская служба 24/7

Сохраните эти номера! 💾`,
          timestamp: new Date().toISOString()
        };
        
        // Проверяем, не добавляли ли уже это сообщение
        const hasUpdateMessage = systemMessages.some((msg: any) => 
          msg.text.includes('ВАЖНЫЕ НОМЕРА ОБНОВЛЕНЫ')
        );
        
        if (!hasUpdateMessage) {
          systemMessages.push(updateMessage);
          localStorage.setItem('systemMessages', JSON.stringify(systemMessages));
        }
        
        window.dispatchEvent(new Event('storage'));
      }
    };
    
    updatePhoneNumbers();
    
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