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

  // Фейковые новости для демонстрации
  const localNews: NewsItem[] = [
    {
      id: '1',
      title: 'Изменения в расписании автобусов',
      preview: 'С 1 февраля изменится расписание движения автобусов по маршруту Горхон-Улан-Удэ',
      date: '30 января 2025',
      category: 'Транспорт',
      urgent: true
    },
    {
      id: '2', 
      title: 'Работы по благоустройству территории',
      preview: 'Начинаются работы по установке новых детских площадок в микрорайоне',
      date: '28 января 2025',
      category: 'Благоустройство'
    },
    {
      id: '3',
      title: 'График работы поликлиники',
      preview: 'Уведомляем о работе поликлиники в праздничные дни февраля',
      date: '25 января 2025',
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
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Icon name="Newspaper" size={28} className="text-gorkhon-pink" />
          <h2 className="text-2xl font-bold text-gray-800">Новости поселка</h2>
        </div>
        <p className="text-gray-600">Следите за последними событиями в Горхоне</p>
      </div>

      {/* Срочные новости */}
      {localNews.filter(news => news.urgent).length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="AlertTriangle" size={20} className="text-red-600" />
            <h3 className="font-semibold text-red-800">Срочные новости</h3>
          </div>
          <div className="space-y-2">
            {localNews.filter(news => news.urgent).map((news) => (
              <div key={news.id} className="bg-white/70 rounded-lg p-3">
                <h4 className="font-medium text-gray-800 mb-1">{news.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{news.preview}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs rounded-full border ${getCategoryColor(news.category)}`}>
                    {news.category}
                  </span>
                  <span className="text-xs text-gray-500">{news.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Местные новости */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Icon name="MapPin" size={16} className="text-gorkhon-green" />
            Местные новости
          </h3>
          <div className="text-sm text-gray-500">Обновлено сегодня</div>
        </div>
        
        <div className="space-y-4">
          {localNews.filter(news => !news.urgent).map((news) => (
            <div key={news.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-800 hover:text-gorkhon-pink cursor-pointer transition-colors">
                  {news.title}
                </h4>
                <span className={`px-2 py-1 text-xs rounded-full border ml-3 ${getCategoryColor(news.category)}`}>
                  {news.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2 leading-relaxed">{news.preview}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Icon name="Calendar" size={12} />
                  {news.date}
                </span>
                <button className="text-xs text-gorkhon-pink hover:text-gorkhon-pink/80 transition-colors">
                  Читать далее →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VK Widget Container */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Icon name="MessageSquare" size={16} className="text-blue-600" />
            Лента ВКонтакте
          </h3>
          <a 
            href="https://vk.com/club214224996" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
          >
            <Icon name="ExternalLink" size={14} />
            Открыть в ВК
          </a>
        </div>
        
        <div className="w-full overflow-hidden rounded-xl bg-gray-50 min-h-[400px] relative">
          {isVKLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gorkhon-pink mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Загрузка новостей...</p>
              </div>
            </div>
          )}
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

      {/* Информационные блоки */}
      <div className="grid gap-4">
        <div className="bg-gradient-to-r from-gorkhon-pink/10 to-gorkhon-green/10 rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <Icon name="Info" size={20} className="text-gorkhon-pink" />
            <div>
              <h4 className="font-medium text-gray-800">Есть новость?</h4>
              <p className="text-sm text-gray-600">
                Поделитесь важной информацией с жителями поселка
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center gap-3">
            <Icon name="Bell" size={20} className="text-blue-600" />
            <div>
              <h4 className="font-medium text-blue-800">Уведомления</h4>
              <p className="text-sm text-blue-600">
                Включите уведомления, чтобы не пропустить важные новости
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;