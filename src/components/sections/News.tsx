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
      // Определяем ширину на основе размера экрана
      const isMobile = window.innerWidth < 768;
      const width = isMobile ? Math.min(window.innerWidth - 40, 400) : 500;
      const height = isMobile ? 600 : 800;
      
      window.VK.Widgets.Group("vk_groups", {
        mode: 4, 
        wide: isMobile ? 0 : 1, 
        width: width, 
        height: height, 
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
    <div className="space-y-4 md:space-y-6">
      {/* VK Widget Container */}
      <div className="bg-white rounded-lg md:rounded-2xl lg:rounded-3xl p-3 md:p-4 lg:p-6 shadow-sm md:shadow-lg border border-gray-200 md:border-gray-100">
        <div className="flex items-center justify-end mb-3 md:mb-4">
          <a 
            href="https://vk.com/club214224996" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs md:text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
          >
            <Icon name="ExternalLink" size={14} />
            <span className="hidden sm:inline">Открыть в ВК</span>
            <span className="sm:hidden">ВК</span>
          </a>
        </div>
        
        <div className="w-full overflow-hidden rounded-lg md:rounded-xl bg-gray-50 min-h-[300px] md:min-h-[350px] lg:min-h-[400px] relative">
          {isVKLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-gorkhon-pink mx-auto mb-2"></div>
                <p className="text-xs md:text-sm text-gray-600">Загрузка новостей...</p>
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