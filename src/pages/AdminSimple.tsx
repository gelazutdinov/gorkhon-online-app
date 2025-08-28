import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserManagement from '@/components/admin/UserManagement';
import AdminLogout from '@/components/admin/AdminLogout';
import ContentEditor from '@/components/admin/ContentEditor';
import Icon from '@/components/ui/icon';

const AdminSimple = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'content'>('content');
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем аутентификацию при загрузке
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Проверяем учетные данные
    if (email === 'smm@gelazutdinov.ru' && password === 'admin123') {
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_email', email);
      setIsAuthenticated(true);
    } else {
      setError('Неверные учетные данные');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Переходим на главную страницу после выхода
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8">
            {/* Заголовок */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="Shield" className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Админ-панель</h1>
              <p className="text-gray-600">Введите учетные данные для доступа</p>
            </div>

            {/* Форма входа */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Icon name="Mail" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Пароль
                </label>
                <div className="relative">
                  <Icon name="Lock" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                Войти в панель
              </button>
            </form>

            {/* Подсказка для входа */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-blue-700 text-sm text-center">
                <strong>Тестовые данные:</strong><br />
                Email: smm@gelazutdinov.ru<br />
                Пароль: admin123
              </p>
            </div>

            {/* Кнопка возврата */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                ← Вернуться на главную
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Админ-панель после входа
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Хедер с кнопкой выхода */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm p-4 sm:p-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <AdminLogout onLogout={handleLogout} />
        </div>
      </div>

      {/* Табы навигации */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'content'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon name="Edit" size={16} />
                <span>Редактор контента</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon name="Users" size={16} />
                <span>Пользователи</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'content' && <ContentEditor />}
        {activeTab === 'users' && <UserManagement />}
      </div>
    </div>
  );
};

export default AdminSimple;