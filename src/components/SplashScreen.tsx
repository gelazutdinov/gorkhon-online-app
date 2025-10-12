import { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('splashShown');
    
    if (hasSeenSplash) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1500);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('splashShown', 'true');
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center transition-opacity duration-700 ${
        isLoaded ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #0046D5 0%, #0036A5 50%, #002680 100%)'
      }}
    >
      {/* Декоративные элементы фона */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      </div>

      {/* Контент */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        {/* Логотип */}
        <div className="mb-8 animate-in zoom-in duration-700 ease-out">
          <img 
            src="https://cdn.poehali.dev/files/20c170e1-2924-429a-af5e-9a37e452088a.png" 
            alt="Горхон.Online"
            className="w-32 h-32 md:w-40 md:h-40 rounded-3xl shadow-2xl"
          />
        </div>

        {/* Текст */}
        <div className="text-center animate-in slide-in-from-bottom duration-700 delay-200">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Горхон.Online
          </h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium">
            Информационный портал поселка
          </p>
        </div>

        {/* Загрузочный индикатор */}
        <div className="mt-12 animate-in fade-in duration-700 delay-500">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>

      {/* Нижний текст */}
      <div className="absolute bottom-8 left-0 right-0 text-center animate-in fade-in duration-700 delay-700">
        <p className="text-blue-200 text-sm font-medium">
          Всё под рукой в одном приложении
        </p>
      </div>
    </div>
  );
}