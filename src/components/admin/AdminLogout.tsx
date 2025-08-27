import Icon from '@/components/ui/icon';

interface AdminLogoutProps {
  onLogout: () => void;
}

const AdminLogout = ({ onLogout }: AdminLogoutProps) => {
  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_email');
    onLogout();
  };

  const adminEmail = localStorage.getItem('admin_email');

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
          <Icon name="Shield" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Админ-панель</h2>
          <p className="text-xs sm:text-sm text-gray-600 truncate">{adminEmail}</p>
        </div>
      </div>
      
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 font-medium text-sm flex-shrink-0"
      >
        <Icon name="LogOut" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Выйти</span>
        <span className="sm:hidden">Exit</span>
      </button>
    </div>
  );
};

export default AdminLogout;