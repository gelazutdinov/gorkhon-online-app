import { useEffect, useState, memo } from 'react';
import { getRecommendations, getReasonText, type RecommendationScore } from '@/utils/recommendations';
import Icon from '@/components/ui/icon';

interface SectionConfig {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  description: string;
}

interface RecommendationsBannerProps {
  availableSections: string[];
  sections: SectionConfig[];
  onSectionClick: (sectionId: string) => void;
}

const RecommendationsBanner = ({ availableSections, sections, onSectionClick }: RecommendationsBannerProps) => {
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const recs = getRecommendations(availableSections, 3);
    setRecommendations(recs);
    
    const hasInteractions = localStorage.getItem('gorkhon_user_interactions');
    if (!hasInteractions) {
      setIsVisible(false);
    }
  }, [availableSections]);

  if (!isVisible || recommendations.length === 0) {
    return null;
  }

  const getRecommendationIcon = (reason: RecommendationScore['reason']) => {
    switch (reason) {
      case 'recent':
        return 'Clock';
      case 'frequent':
        return 'TrendingUp';
      case 'trending':
        return 'Flame';
      case 'related':
        return 'Sparkles';
      default:
        return 'Star';
    }
  };

  const getRecommendationColor = (reason: RecommendationScore['reason']) => {
    switch (reason) {
      case 'recent':
        return 'from-blue-500 to-blue-600';
      case 'frequent':
        return 'from-purple-500 to-purple-600';
      case 'trending':
        return 'from-orange-500 to-orange-600';
      case 'related':
        return 'from-pink-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-4 border border-indigo-100 shadow-sm relative overflow-hidden">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-white/50"
        aria-label="Скрыть рекомендации"
      >
        <Icon name="X" size={16} />
      </button>

      <div className="flex items-center gap-2 mb-3">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-1.5">
          <Icon name="Sparkles" size={16} className="text-white" />
        </div>
        <h3 className="font-semibold text-gray-800 text-sm">
          Для вас
        </h3>
        <span className="text-xs text-gray-500 ml-auto">
          На основе ваших предпочтений
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
        {recommendations.map((rec) => {
          const section = sections.find(s => s.id === rec.sectionId);
          if (!section) return null;

          return (
            <button
              key={rec.sectionId}
              onClick={() => onSectionClick(rec.sectionId)}
              className="flex-shrink-0 group relative overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-md transition-all duration-200 p-3 min-w-[140px]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${getRecommendationColor(rec.reason)} opacity-0 group-hover:opacity-5 transition-opacity`} />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`bg-gradient-to-r ${getRecommendationColor(rec.reason)} rounded-full p-1`}>
                    <Icon 
                      name={getRecommendationIcon(rec.reason)} 
                      size={12} 
                      className="text-white" 
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {getReasonText(rec.reason)}
                  </span>
                </div>
                
                <div className="text-sm font-medium text-gray-800 line-clamp-2">
                  {section.name}
                </div>
                
                {section.description && (
                  <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {section.description}
                  </div>
                )}
              </div>
              
              <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name="ArrowRight" size={14} className="text-gray-400" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-indigo-100/50">
        <p className="text-xs text-gray-500 flex items-center gap-1.5">
          <Icon name="Info" size={12} className="text-indigo-400" />
          Рекомендации обновляются автоматически на основе того, что вы смотрите чаще всего
        </p>
      </div>
    </div>
  );
};

export default memo(RecommendationsBanner);
