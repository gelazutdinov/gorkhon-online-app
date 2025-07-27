import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useUser';

interface StatisticsModalProps {
  user: UserProfile;
  daysWithUs: number;
  formattedTimeSpent: string;
  getMostVisitedSection: () => string;
  getMostUsedFeature: () => string;
  getRegistrationDate: () => string;
  onClose: () => void;
}

const StatisticsModal = ({
  user,
  daysWithUs,
  formattedTimeSpent,
  getMostVisitedSection,
  getMostUsedFeature,
  getRegistrationDate,
  onClose
}: StatisticsModalProps) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Жидкое стекло iOS фон */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl w-full max-w-md max-h-[75vh] overflow-y-auto border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Статистика активности</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="X" size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Основная статистика */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30 text-center">
              <Icon name="Calendar" size={24} className="text-gorkhon-pink mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{daysWithUs}</div>
              <div className="text-sm text-gray-600">дней с нами</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30 text-center">
              <Icon name="Clock" size={24} className="text-gorkhon-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{formattedTimeSpent}</div>
              <div className="text-sm text-gray-600">времени в сервисе</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30 text-center">
              <Icon name="BarChart3" size={24} className="text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{user.stats?.totalSessions || 0}</div>
              <div className="text-sm text-gray-600">сессий</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30 text-center">
              <Icon name="Target" size={24} className="text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{user.stats?.daysActive || 0}</div>
              <div className="text-sm text-gray-600">активных дней</div>
            </div>
          </div>

          {/* Детальная статистика */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Icon name="TrendingUp" size={20} className="text-gorkhon-pink" />
              Ваша активность
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Любимый раздел:</span>
                <span className="font-medium text-gray-800">{getMostVisitedSection()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Часто используете:</span>
                <span className="font-medium text-gray-800">{getMostUsedFeature()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Дата регистрации:</span>
                <span className="font-medium text-gray-800">{getRegistrationDate()}</span>
              </div>
            </div>
          </div>

          {/* Использование функций */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Icon name="Activity" size={20} className="text-gorkhon-green" />
              Использование функций
            </h3>
            
            <div className="space-y-3">
              {Object.entries(user.stats?.featuresUsed || {}).map(([feature, count]) => {
                const featureNames: Record<string, string> = {
                  importantNumbers: 'Важные номера',
                  schedule: 'Расписание транспорта',
                  donation: 'Помощь поселку',
                  workSchedule: 'Режим работы',
                  pvz: 'Пункты выдачи',
                  notifications: 'Уведомления'
                };
                
                const allCounts = Object.values(user.stats?.featuresUsed || {});
                const maxCount = allCounts.length > 0 ? Math.max(...allCounts) : 0;
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                
                return (
                  <div key={feature}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{featureNames[feature]}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-gorkhon-pink to-gorkhon-green h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsModal;