import Icon from '@/components/ui/icon';

interface DashboardActionsProps {
  unreadNotifications: number;
  onShowSocialProfile: () => void;
  onShowResidentsFeed: () => void;
  onShowStatistics: () => void;
  onShowNotifications: () => void;
  onShowProfileSettings: () => void;
  onShowThemeSelector: () => void;
  onShowDataManager: () => void;
  onLogout: () => void;
}

const DashboardActions = ({
  unreadNotifications,
  onShowSocialProfile,
  onShowResidentsFeed,
  onShowStatistics,
  onShowNotifications,
  onShowProfileSettings,
  onShowThemeSelector,
  onShowDataManager,
  onLogout
}: DashboardActionsProps) => {
  return (
    <>
      {/* Кнопки действий */}
      <div className="grid grid-cols-3 gap-2 mt-4 max-w-xs mx-auto">
        <button
          onClick={onShowSocialProfile}
          className="flex flex-col items-center gap-1 px-3 py-2 bg-gorkhon-pink text-white rounded-lg hover:bg-gorkhon-pink/90 transition-colors"
        >
          <Icon name="User" size={16} />
          <span className="text-xs">Профиль</span>
        </button>
        <button
          onClick={onShowResidentsFeed}
          className="flex flex-col items-center gap-1 px-3 py-2 bg-gorkhon-green text-white rounded-lg hover:bg-gorkhon-green/90 transition-colors"
        >
          <Icon name="Users" size={16} />
          <span className="text-xs">Жители</span>
        </button>
        <button
          onClick={onShowStatistics}
          className="flex flex-col items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Icon name="BarChart3" size={16} />
          <span className="text-xs">Статистика</span>
        </button>
      </div>

      {/* Дополнительные функции */}
      <div className="grid grid-cols-2 gap-2 mt-3 max-w-xs mx-auto">
        <button
          onClick={onShowNotifications}
          className="relative flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          <Icon name="Bell" size={16} className="text-gray-600" />
          <span className="text-gray-700">Уведомления</span>
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </button>
        <button
          onClick={onShowProfileSettings}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          <Icon name="Settings" size={16} className="text-gray-600" />
          <span className="text-gray-700">Настройки</span>
        </button>
      </div>

      {/* Управление данными */}
      <div className="grid grid-cols-2 gap-2 mt-3 max-w-xs mx-auto">
        <button
          onClick={onShowThemeSelector}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          <Icon name="Palette" size={16} className="text-gray-600" />
          <span className="text-gray-700">Темы</span>
        </button>
        <button
          onClick={onShowDataManager}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          <Icon name="Database" size={16} className="text-gray-600" />
          <span className="text-gray-700">Данные</span>
        </button>
      </div>

      {/* Кнопка выхода */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors mt-6"
      >
        <Icon name="LogOut" size={18} />
        <span>Выйти из аккаунта</span>
      </button>
    </>
  );
};

export default DashboardActions;