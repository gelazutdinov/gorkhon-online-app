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
  const [vkLoadError, setVkLoadError] = useState(false);
  
  useEffect(() => {
    // Устанавливаем таймаут для загрузки
    const timeout = setTimeout(() => {
      setIsVKLoading(false);
      setVkLoadError(true);
    }, 10000); // 10 секунд на загрузку
    
    // Загружаем VK API если еще не загружен
    if (!window.VK) {
      const script = document.createElement('script');
      script.src = 'https://vk.com/js/api/openapi.js?168';
      script.onload = () => {
        clearTimeout(timeout);
        initVKWidget();
      };
      script.onerror = () => {
        clearTimeout(timeout);
        setIsVKLoading(false);
        setVkLoadError(true);
      };
      document.head.appendChild(script);
    } else {
      clearTimeout(timeout);
      initVKWidget();
    }
    
    return () => clearTimeout(timeout);
  }, []);

  const initVKWidget = () => {
    if (window.VK && window.VK.Widgets) {
      // Очищаем контейнер перед вставкой нового виджета
      const container = document.getElementById("vk_groups");
      if (container) {
        container.innerHTML = '';
      }
      
      // Определяем ширину на основе размера экрана
      const isMobile = window.innerWidth < 768;
      const width = isMobile ? Math.min(window.innerWidth - 32, 350) : 500;
      const height = isMobile ? 500 : 800;
      
      window.VK.Widgets.Group("vk_groups", {
        mode: 3, 
        wide: isMobile ? 0 : 1, 
        width: width, 
        height: height, 
        color1: "FFFFFF", 
        color2: "000000", 
        color3: "005BFF",
        no_cover: 1
      }, 214224996);
      setIsVKLoading(false);
    }
  };

  // Резервные новости если VK не загрузился
  const fallbackNews: NewsItem[] = [
    {
      id: '1',
      title: 'Обновление расписания автобусов',
      preview: 'С понедельника изменяется расписание движения городских автобусов. Подробности в группе ВКонтакте.',
      date: '2024-08-20',
      category: 'Транспорт'
    },
    {
      id: '2', 
      title: 'Благоустройство городского парка',
      preview: 'Завершены работы по благоустройству центрального парка. Установлены новые скамейки и детские площадки.',
      date: '2024-08-19',
      category: 'Благоустройство'
    },
    {
      id: '3',
      title: 'График работы поликлиники',
      preview: 'Обновлен график работы городской поликлиники. Теперь прием ведется до 20:00.',
      date: '2024-08-18', 
      category: 'Здравоохранение'
    }
  ];

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
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-xs md:text-sm text-gray-600">Загрузка новостей...</p>
              </div>
            </div>
          )}
          
          {vkLoadError ? (
            <div className="p-4 space-y-4">
              <div className="text-center text-gray-500 mb-4">
                <Icon name="AlertCircle" size={24} className="mx-auto mb-2" />
                <p className="text-sm">VK виджет недоступен. Показываем актуальные новости:</p>
              </div>
              
              {fallbackNews.map((news) => (
                <div key={news.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(news.category)}`}>
                      {news.category}
                    </span>
                    <span className="text-xs text-gray-500">{news.date}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{news.title}</h3>
                  <p className="text-sm text-gray-600">{news.preview}</p>
                </div>
              ))}
            </div>
          ) : (
            <div id="vk_groups" className="w-full h-full overflow-auto"></div>
          )}
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