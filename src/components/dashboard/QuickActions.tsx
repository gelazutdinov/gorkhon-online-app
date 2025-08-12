import Icon from '@/components/ui/icon';

interface QuickActionsProps {
  onShowStatistics: () => void;
  onShowLina: () => void;
  onShowBackup: () => void;
  onShowAccessibility: () => void;
}

const QuickActions = ({ onShowStatistics, onShowLina, onShowBackup, onShowAccessibility }: QuickActionsProps) => {
  const stats = [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2 lg:p-3 ${stat.color} rounded-xl`}>
              <Icon name={stat.icon as any} size={20} className={stat.iconColor} />
            </div>
            {stat.change && (
              <span className={`text-xs font-medium ${stat.changeColor} flex items-center gap-1`}>
                <span>📈</span> {stat.change}
              </span>
            )}
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stat.title}</div>
            <div className="text-sm text-gray-600 leading-tight">
              {index === 3 ? (
                <>
                  <span className="font-semibold">{stat.subtitle}</span>
                  <br />
                  <span className="text-xs">{stat.description}</span>
                </>
              ) : (
                <>
                  {stat.subtitle}
                  {stat.description && (
                    <>
                      <br />
                      <span className="text-xs">{stat.description}</span>
                    </>
                  )}
                </>
              )}
            </div>
            {index === 2 && (
              <div className="mt-2 h-1 bg-purple-200 rounded-full">
                <div className="h-full bg-purple-500 rounded-full" style={{width: '70%'}}></div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickActions;