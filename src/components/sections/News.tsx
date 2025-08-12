import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

declare global {
  interface Window {
    VK: any;
  }
}

interface NewsItem {
  id: string;
  title: string;
  preview: string;
  date: string;
  category: string;
  urgent?: boolean;
}

const News = () => {
  const [isVKLoading, setIsVKLoading] = useState(true);
  
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
      setIsVKLoading(false);
    }
  };

  // Убираем локальные новости
  const localNews: NewsItem[] = [];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Транспорт': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Благоустройство': return 'bg-green-50 text-green-700 border-green-200';
      case 'Здравоохранение': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">


      {/* VK Widget Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-end mb-4">
          <a 
            href="https://vk.com/club214224996" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
          >
            <Icon name="ExternalLink" size={14} />
            <span>Открыть в ВК</span>
          </a>
        </div>
        
        <div className="w-full overflow-hidden rounded-xl bg-gray-50 min-h-[350px] sm:min-h-[400px] relative">
          {isVKLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gorkhon-pink mx-auto mb-2"></div>
                <p className="text-xs sm:text-sm text-gray-600">Загрузка новостей...</p>
              </div>
            </div>
          )}
          <div id="vk_groups" className="w-full h-full"></div>
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