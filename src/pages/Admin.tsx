import { useState } from 'react';
import UserManagement from '@/components/admin/UserManagement';
import ContactManagement from '@/components/admin/ContactManagement';
import SystemChatManagement from '@/components/admin/SystemChatManagement';
import AdminAuth from '@/components/admin/AdminAuth';
import AdminLogout from '@/components/admin/AdminLogout';
import Icon from '@/components/ui/icon';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'contacts' | 'news'>('contacts');

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Админ-панель Горхон.Online
              </h1>
              <p className="text-sm text-gray-600">Управление порталом посёлка</p>
            </div>
            <AdminLogout onLogout={() => setIsAuthenticated(false)} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('contacts')}
              className={`flex-1 min-w-fit px-6 py-4 font-semibold transition-colors ${
                activeTab === 'contacts'
                  ? 'border-b-2 border-pink-500 text-pink-600 bg-pink-50/50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50/50'
              }`}
            >
              <Icon name="Phone" size={20} className="inline mr-2" />
              Важные контакты
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex-1 min-w-fit px-6 py-4 font-semibold transition-colors ${
                activeTab === 'news'
                  ? 'border-b-2 border-pink-500 text-pink-600 bg-pink-50/50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50/50'
              }`}
            >
              <Icon name="MessageCircle" size={20} className="inline mr-2" />
              Системный чат
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 min-w-fit px-6 py-4 font-semibold transition-colors ${
                activeTab === 'users'
                  ? 'border-b-2 border-pink-500 text-pink-600 bg-pink-50/50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50/50'
              }`}
            >
              <Icon name="Users" size={20} className="inline mr-2" />
              Пользователи
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'contacts' && <ContactManagement />}
            {activeTab === 'news' && <SystemChatManagement />}
            {activeTab === 'users' && <UserManagement />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;