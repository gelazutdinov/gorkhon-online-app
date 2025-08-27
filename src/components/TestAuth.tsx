import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getAllUsers, getCurrentUser, logoutUser } from '@/utils/auth';

const TestAuth = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const refreshData = () => {
    setUsers(getAllUsers());
    setCurrentUser(getCurrentUser());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleLogout = () => {
    logoutUser();
    refreshData();
  };

  const clearAllData = () => {
    localStorage.removeItem('gorkhon_users');
    localStorage.removeItem('gorkhon_current_user');
    refreshData();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">🧪 Тест системы аутентификации</h1>
          
          {/* Current User */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">👤 Текущий пользователь:</h2>
            {currentUser ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-green-600 text-sm">{currentUser.email}</p>
                <Button 
                  onClick={handleLogout}
                  className="mt-3 bg-red-600 hover:bg-red-700"
                >
                  Выйти
                </Button>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600">Пользователь не авторизован</p>
                <a 
                  href="/auth" 
                  className="inline-block mt-2 text-blue-600 hover:underline"
                >
                  Войти или зарегистрироваться →
                </a>
              </div>
            )}
          </div>

          {/* All Users */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              📊 Зарегистрированные пользователи ({users.length}):
            </h2>
            {users.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">Пока нет зарегистрированных пользователей</p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Email:</strong> {user.email}
                      </div>
                      <div>
                        <strong>Пароль:</strong> {user.password}
                      </div>
                      <div>
                        <strong>Имя:</strong> {user.firstName}
                      </div>
                      <div>
                        <strong>Фамилия:</strong> {user.lastName}
                      </div>
                      <div>
                        <strong>Дата рождения:</strong> {user.birthDate}
                      </div>
                      <div>
                        <strong>Пол:</strong> {user.gender === 'male' ? 'Мужской' : user.gender === 'female' ? 'Женский' : 'Другой'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button onClick={refreshData} variant="outline">
              🔄 Обновить данные
            </Button>
            <Button onClick={clearAllData} variant="destructive">
              🗑️ Очистить все данные
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 Инструкция для тестирования:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Перейдите на <a href="/auth" className="text-blue-600 hover:underline">/auth</a> для регистрации</li>
            <li>Заполните форму со всеми полями (Email, Пароль, Имя, Фамилия, Дата рождения, Пол)</li>
            <li>Поставьте галочки "Я принимаю условия" и "Я согласен с политикой"</li>
            <li>Нажмите "Создать аккаунт"</li>
            <li>Вернитесь сюда и увидите, что пользователь сохранился</li>
            <li>Попробуйте войти с теми же данными</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestAuth;