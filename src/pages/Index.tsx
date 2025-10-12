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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{text: string, sender: 'user' | 'support', showAgentButton?: boolean}[]>([
    {text: 'Привет! Я Лина — ИИ-помощник Горхон.Online 👋\n\nПомогу с техническими вопросами:\n• Как найти нужную информацию\n• Как пользоваться платформой\n• Ответы на частые вопросы\n\nЗадайте свой вопрос!', sender: 'support'}
  ]);
  const [chatInput, setChatInput] = useState('');

  const getAIResponse = (userMessage: string): {text: string, showAgentButton?: boolean} => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('контакт') || msg.includes('номер') || msg.includes('телефон') || msg.includes('позвонить')) {
      return {
        text: 'Все важные контакты размещены на главной странице:\n\n• ФАП Горхон\n• Участковый\n• Скорая помощь (112)\n• Диспетчер РЭС\n• МФЦ Заиграево\n• Почта Горхон\n• ЕДДС района\n\nПрокрутите страницу вниз, чтобы увидеть полный список с номерами!'
      };
    }
    
    if (msg.includes('работ') || msg.includes('как пользовать') || msg.includes('как найти') || msg.includes('где найти')) {
      return {
        text: 'На платформе Горхон.Online вы можете:\n\n📞 Найти важные номера\n📍 Посмотреть контакты служб\n💬 Связаться с поддержкой\n\nВсё находится на главной странице. Прокрутите вниз для просмотра всех контактов.'
      };
    }
    
    if (msg.includes('проблем') || msg.includes('не работает') || msg.includes('ошибка') || msg.includes('баг')) {
      return {
        text: 'Понимаю, возникла техническая проблема. Попробуйте:\n\n1. Обновить страницу (F5)\n2. Очистить кеш браузера\n3. Проверить интернет-соединение\n\nЕсли проблема не решилась, обратитесь к нашему агенту — он поможет!',
        showAgentButton: true
      };
    }
    
    if (msg.includes('агент') || msg.includes('человек') || msg.includes('оператор') || msg.includes('живой')) {
      return {
        text: 'Хотите связаться с живым оператором? Наш агент готов помочь вам лично!',
        showAgentButton: true
      };
    }
    
    return {
      text: 'Спасибо за вопрос! Могу помочь с:\n\n• Поиском контактов на платформе\n• Техническими вопросами\n• Навигацией по сайту\n\nУточните, пожалуйста, что именно вас интересует?\n\nИли напишите нашему агенту для детальной консультации.',
      showAgentButton: true
    };
  };

  const sendMessage = () => {
    if (chatInput.trim()) {
      const userMsg = chatInput;
      setChatMessages(prev => [...prev, {text: userMsg, sender: 'user'}]);
      setChatInput('');
      
      setTimeout(() => {
        const aiResponse = getAIResponse(userMsg);
        setChatMessages(prev => [...prev, {
          text: aiResponse.text,
          sender: 'support',
          showAgentButton: aiResponse.showAgentButton
        }]);
      }, 800);
    }
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
          <div className="md:hidden flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.poehali.dev/files/09336db0-43b6-49a2-8f46-7faa33fce4f7.png" 
                alt="Горхон.Online" 
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-white font-medium text-lg">Горхон.Online</h1>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Icon name="Menu" size={24} />
            </button>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between max-w-6xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.poehali.dev/files/09336db0-43b6-49a2-8f46-7faa33fce4f7.png" 
                alt="Горхон.Online" 
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-white font-medium text-lg">Горхон.Online</h1>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Icon name="Menu" size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Баннер уведомлений */}
      <NotificationsBanner />

      {/* VK-style Layout */}
      <div className="flex pt-28 md:pt-24">
        {/* Main Content */}
        <main className="flex-1 bg-gray-50 min-h-screen relative z-10 overflow-x-hidden">
          <div className="max-w-full md:max-w-2xl mx-auto px-4 py-4 md:p-4 space-y-4 md:space-y-4 pb-4">
            <Home onOpenPhotoCarousel={openPhotoCarousel} />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setIsSidebarOpen(false)}>
          <div className="flex-1 bg-black/50" />
          <div 
            className="w-80 bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b flex items-center justify-between" style={{backgroundColor: '#F1117E'}}>
              <h3 className="font-semibold text-white">Меню</h3>
              <button onClick={() => setIsSidebarOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Chat with Support */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Поддержка</h3>
                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    setIsChatOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm"
                >
                  <Icon name="Bot" size={20} />
                  <div className="flex-1">
                    <div className="font-medium">Лина (ИИ-помощник)</div>
                    <div className="text-xs opacity-90">Помощь по платформе</div>
                  </div>
                </button>
              </div>


            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50" onClick={() => setIsChatOpen(false)}>
          <div 
            className="bg-white rounded-t-2xl md:rounded-2xl w-full md:w-96 md:max-w-md h-[90vh] md:max-h-[80vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{backgroundColor: '#F1117E'}}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon name="Bot" size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Лина</h3>
                  <p className="text-xs text-white/80">ИИ-помощник</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg, idx) => (
                <div key={idx}>
                  <div 
                    className={`rounded-lg p-3 max-w-[80%] ${
                      msg.sender === 'user' 
                        ? 'ml-auto bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{msg.text}</p>
                    <span className="text-xs mt-1 block opacity-70">
                      {msg.sender === 'user' ? 'Вы' : 'Лина (ИИ)'} • сейчас
                    </span>
                  </div>
                  {msg.showAgentButton && (
                    <a
                      href="https://forms.yandex.ru/u/687f5b9a84227c08790f3222/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors shadow-sm"
                    >
                      <Icon name="UserCircle" size={18} />
                      <span className="text-sm font-medium">Написать агенту</span>
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Напишите сообщение..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={sendMessage}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
                >
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