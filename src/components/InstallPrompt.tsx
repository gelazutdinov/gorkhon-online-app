import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    
    if (isStandalone || isIOSStandalone) {
      setIsInstalled(true);
      return;
    }

    const dismissed = localStorage.getItem('installPromptDismissed');
    if (dismissed) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if ((isIOS && isSafari) || !('BeforeInstallPromptEvent' in window)) {
      setTimeout(() => setShowInstallButton(true), 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowInstallButton(false);
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
    } else {
      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  if (isInstalled || (!showInstallButton && !showInstructions)) {
    return null;
  }

  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
        <Card className="max-w-md w-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 border-2 border-gorkhon-pink/40 shadow-2xl">
          <CardHeader className="relative pb-4">
            <button
              onClick={() => setShowInstructions(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gorkhon-blue/10 transition-colors"
            >
              <Icon name="X" size={20} className="text-gray-600" />
            </button>
            <CardTitle className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-gorkhon-blue/15 to-gorkhon-pink/15">
                <Icon name="Download" size={24} className="text-gorkhon-blue" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-gorkhon-blue via-gorkhon-pink to-purple-600 bg-clip-text text-transparent">
                  Установить приложение
                </span>
                <p className="text-sm text-gray-600 font-normal mt-1">
                  Быстрый доступ с главного экрана
                </p>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {isIOS && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-gorkhon-pink/30">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gorkhon-blue to-gorkhon-pink text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gorkhon-blue mb-1">
                      Откройте меню Safari
                    </p>
                    <p className="text-xs text-gray-600">
                      Нажмите кнопку <Icon name="Share" size={14} className="inline mx-1" /> "Поделиться" внизу экрана
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-gorkhon-pink/30">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gorkhon-blue to-gorkhon-pink text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gorkhon-blue mb-1">
                      Выберите действие
                    </p>
                    <p className="text-xs text-gray-600">
                      Найдите и нажмите "На экран «Домой»" или "Add to Home Screen"
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-gorkhon-pink/30">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gorkhon-blue to-gorkhon-pink text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gorkhon-blue mb-1">
                      Готово!
                    </p>
                    <p className="text-xs text-gray-600">
                      Иконка Горхон.Online появится на главном экране
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isAndroid && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-gorkhon-pink/30">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gorkhon-blue to-gorkhon-pink text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gorkhon-blue mb-1">
                      Откройте меню браузера
                    </p>
                    <p className="text-xs text-gray-600">
                      Нажмите три точки <Icon name="MoreVertical" size={14} className="inline mx-1" /> в правом верхнем углу
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-gorkhon-pink/30">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gorkhon-blue to-gorkhon-pink text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gorkhon-blue mb-1">
                      Добавьте на главный экран
                    </p>
                    <p className="text-xs text-gray-600">
                      Выберите "Добавить на главный экран" или "Install app"
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-gorkhon-pink/30">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gorkhon-blue to-gorkhon-pink text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gorkhon-blue mb-1">
                      Готово!
                    </p>
                    <p className="text-xs text-gray-600">
                      Приложение установлено и доступно с главного экрана
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isIOS && !isAndroid && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-gorkhon-pink/30">
                  <Icon name="Smartphone" size={20} className="text-gorkhon-blue flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gorkhon-blue mb-1">
                      Откройте на мобильном устройстве
                    </p>
                    <p className="text-xs text-gray-600">
                      Для установки приложения откройте этот сайт в браузере на вашем телефоне (iOS или Android)
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => setShowInstructions(false)}
                variant="outline"
                className="flex-1 border-gorkhon-pink/40 hover:bg-gorkhon-blue/5"
              >
                Закрыть
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 animate-in slide-in-from-bottom duration-500">
      <Card className="bg-gradient-to-r from-gorkhon-blue via-gorkhon-pink to-purple-600 text-white shadow-2xl border-0 overflow-hidden">
        <CardContent className="p-4 relative">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <Icon name="X" size={16} className="text-white" />
          </button>
          
          <div className="flex items-start gap-3 pr-6">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm flex-shrink-0">
              <Icon name="Download" size={24} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base mb-1">Установите приложение</h3>
              <p className="text-sm text-white/90 mb-3">
                Получите быстрый доступ к порталу с главного экрана вашего телефона
              </p>
              <Button
                onClick={handleInstallClick}
                className="bg-white text-gorkhon-blue hover:bg-white/90 font-semibold shadow-lg w-full"
              >
                <Icon name="Smartphone" size={16} className="mr-2" />
                Установить
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}