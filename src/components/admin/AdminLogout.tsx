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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
          <Icon name="Shield" className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Админ-панель</h2>
          <p className="text-sm text-gray-600">{adminEmail}</p>
        </div>
      </div>
      
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-105 font-medium"
      >
        <Icon name="LogOut" className="w-4 h-4" />
        <span>Выйти</span>
      </button>
    </div>
  );
};

export default AdminLogout;