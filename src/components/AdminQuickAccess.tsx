import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const AdminQuickAccess = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Показываем кнопку только для администраторов
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => navigate('/admin')}
        className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        title="Админ-панель"
      >
        <Icon name="Settings" size={20} />
      </button>
      
      {/* Уведомление для админа */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
        <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Админ-панель
        </div>
      </div>
    </div>
  );
};

export default AdminQuickAccess;