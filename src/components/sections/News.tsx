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


    </div>
  );
};

export default News;