import { useEffect } from 'react';
import Icon from '@/components/ui/icon';

declare global {
  interface Window {
    VK: any;
  }
}

const News = () => {
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
        width: "100%", 
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
      </div>

      {/* VK Widget Container */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="ExternalLink" size={20} className="text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">Официальная группа ВКонтакте</h3>
        </div>
        
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
    </div>
  );
};

export default News;