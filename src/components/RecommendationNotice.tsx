import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const RecommendationNotice = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenNotice = localStorage.getItem('hasSeenRecommendationNotice');
    
    if (!hasSeenNotice) {
      setTimeout(() => {
        setIsVisible(true);
      }, 2000);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenRecommendationNotice', 'true');
  };

  const handleLearnMore = () => {
    window.open('/recommendations-policy.html', '_blank');
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 animate-in fade-in duration-300">
      <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:w-96 md:max-w-md shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex-shrink-0">
              <Icon name="Info" size={24} className="text-blue-600" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Рекомендательные технологии
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Мы используем рекомендательные технологии для персонализации контента и улучшения вашего опыта использования платформы Горхон.Online.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-600">
                  📱 Умная сортировка контактов<br/>
                  🔔 Персонализированные уведомления<br/>
                  🤖 ИИ-помощник Лина с поиском
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleLearnMore}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors text-sm font-medium"
                >
                  Подробнее
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Понятно
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationNotice;
