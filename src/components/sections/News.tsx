import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import NotificationPanel from '@/components/NotificationPanel';
import { useVkNewsTracker } from '@/hooks/useVkNewsTracker';
import { useUser } from '@/hooks/useUser';

declare global {
  interface Window {
    VK: any;
  }
}

const News = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { isTracking, notifications, startTracking, stopTracking, hasNewNotifications } = useVkNewsTracker();
  const { trackFeatureUse } = useUser();
  useEffect(() => {
    // Загружаем VK API если еще не загружен
    if (!window.VK) {
      const script = document.createElement('script');
      script.src = 'https://vk.com/js/api/openapi.js?168';
      script.onload = () => {
        initVKWidget();
      };
      document.head.appendChild(script);
    } else {
      initVKWidget();
    }
  }, []);

  const initVKWidget = () => {
    if (window.VK && window.VK.Widgets) {
      window.VK.Widgets.Group("vk_groups", {
        mode: 4, 
        wide: 1, 
        width: 500, 
        height: 800, 
        color1: "FFFFFF", 
        color2: "000000", 
        color3: "005BFF"
      }, 214224996);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Icon name="Newspaper" size={28} className="text-gorkhon-pink" />
          <h2 className="text-2xl font-bold text-gray-800">Новости поселка</h2>
        </div>
        <p className="text-gray-600">Следите за последними событиями в Горхоне</p>
        
        {/* Кнопка уведомлений */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => {
              setShowNotifications(true);
              trackFeatureUse('notifications');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gorkhon-pink text-white rounded-full hover:bg-gorkhon-pink/90 transition-all duration-200 relative"
          >
            <Icon name="Bell" size={16} />
            <span>Уведомления</span>
            {hasNewNotifications && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {notifications.length > 9 ? '9+' : notifications.length}
                </span>
              </div>
            )}
          </button>
          
          <button
            onClick={isTracking ? stopTracking : startTracking}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
              isTracking 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Icon name={isTracking ? "BellRing" : "BellOff"} size={16} />
            <span>{isTracking ? 'Отслеживание ВКЛ' : 'Включить отслеживание'}</span>
          </button>
        </div>
      </div>

      {/* VK Widget Container */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="w-full overflow-hidden rounded-xl bg-gray-50 min-h-[400px]">
          <div id="vk_groups" className="w-full"></div>
        </div>
        
        {/* Fallback если VK не загрузился */}
        <noscript>
          <div className="text-center py-8 text-gray-500">
            <Icon name="AlertCircle" size={24} className="mx-auto mb-2" />
            <p>Для просмотра новостей включите JavaScript</p>
            <a 
              href="https://vk.com/club214224996" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline mt-2 inline-block"
            >
              Перейти в группу ВКонтакте
            </a>
          </div>
        </noscript>
      </div>

      {/* Дополнительная информация */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center gap-3 mb-3">
          <Icon name="Info" size={20} className="text-blue-600" />
          <h4 className="font-semibold text-blue-900">Не пропустите важное!</h4>
        </div>
        <p className="text-blue-700 text-sm leading-relaxed">
          Подпишитесь на нашу группу ВКонтакте, чтобы быть в курсе всех событий, 
          объявлений и изменений в работе служб поселка.
        </p>
      </div>
      
      {/* Панель уведомлений */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
};

export default News;