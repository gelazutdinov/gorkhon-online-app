import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowUpdate(true);
              }
            });
          }
        });

        reg.update();
      });

      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    setIsUpdating(true);
    
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="fixed top-20 left-4 right-4 z-50 animate-in slide-in-from-top duration-500">
      <Card className="bg-gradient-to-r from-gorkhon-blue via-gorkhon-pink to-purple-600 text-white shadow-2xl border-0 overflow-hidden">
        <div className="absolute top-0 right-0 text-4xl opacity-20 animate-bounce">✨</div>
        <CardContent className="p-4 relative">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm flex-shrink-0 animate-pulse">
              <Icon name="Sparkles" size={24} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base mb-1 flex items-center gap-2">
                Доступно обновление
              </h3>
              <p className="text-sm text-white/90 mb-3">
                Новая версия приложения готова к установке. Обновитесь, чтобы получить последние улучшения!
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="bg-white text-gorkhon-blue hover:bg-white/90 font-semibold shadow-lg flex-1"
                >
                  {isUpdating ? (
                    <>
                      <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Обновление...
                    </>
                  ) : (
                    <>
                      <Icon name="RefreshCw" size={16} className="mr-2" />
                      Обновить
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  className="border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  Позже
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}