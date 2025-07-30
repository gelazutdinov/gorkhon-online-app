import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { useNotifications } from '@/hooks/useNotifications';
import { useAdmin } from '@/hooks/useAdmin';
import { SystemNotification, NotificationFormData } from '@/types/notification';
import AdminLogin from './AdminLogin';
import VerificationManager from './VerificationManager';
import { Link } from 'react-router-dom';

const NotificationManager: React.FC = () => {
  const { 
    notifications, 
    createNotification, 
    updateNotification, 
    deleteNotification,
    getActiveNotifications 
  } = useNotifications();
  
  const { currentAdmin, isLoading, isAdmin, login, logout, getPendingRequests } = useAdmin();
  const [activeTab, setActiveTab] = useState<'notifications' | 'verification'>('notifications');

  const [isCreateMode, setIsCreateMode] = useState(false);
  const [editingNotification, setEditingNotification] = useState<SystemNotification | null>(null);
  const [formData, setFormData] = useState<NotificationFormData>({
    title: '',
    content: '',
    imageUrl: '',
    type: 'update',
    priority: 'medium',
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      imageUrl: '',
      type: 'update',
      priority: 'medium',
      isActive: true
    });
    setIsCreateMode(false);
    setEditingNotification(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Заполните обязательные поля');
      return;
    }

    if (editingNotification) {
      updateNotification(editingNotification.id, formData);
    } else {
      createNotification(formData);
    }
    
    resetForm();
  };

  const handleEdit = (notification: SystemNotification) => {
    setFormData({
      title: notification.title,
      content: notification.content,
      imageUrl: notification.imageUrl || '',
      type: notification.type,
      priority: notification.priority,
      isActive: notification.isActive
    });
    setEditingNotification(notification);
    setIsCreateMode(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить уведомление?')) {
      deleteNotification(id);
    }
  };

  const getTypeColor = (type: SystemNotification['type']) => {
    const colors = {
      update: 'bg-blue-100 text-blue-800',
      feature: 'bg-green-100 text-green-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      announcement: 'bg-purple-100 text-purple-800'
    };
    return colors[type];
  };

  const getPriorityColor = (priority: SystemNotification['priority']) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[priority];
  };

  const activeNotifications = getActiveNotifications();
  const pendingRequests = getPendingRequests();

  // Показываем форму входа, если не авторизован
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gorkhon-pink"></div>
      </div>
    );
  }

  if (!isAdmin()) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка админ-панели */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">Админ-панель</h1>
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'notifications'
                      ? 'bg-white text-gorkhon-pink shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Уведомления
                </button>
                <button
                  onClick={() => setActiveTab('verification')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors relative ${
                    activeTab === 'verification'
                      ? 'bg-white text-gorkhon-pink shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Верификация
                  {pendingRequests.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {pendingRequests.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                Привет, <span className="font-medium">{currentAdmin?.username}</span>
              </div>
              <Link
                to="/"
                className="bg-gorkhon-blue text-white px-3 py-1.5 rounded-lg hover:bg-gorkhon-blue/90 flex items-center gap-2 text-sm"
              >
                <Icon name="Home" size={16} />
                На главную
              </Link>
              <button
                onClick={logout}
                className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-300 flex items-center gap-2 text-sm"
              >
                <Icon name="LogOut" size={16} />
                Выход
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="max-w-6xl mx-auto p-6">
        {activeTab === 'verification' ? (
          <VerificationManager />
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Управление уведомлениями</h2>
              <button
                onClick={() => setIsCreateMode(true)}
                className="bg-gorkhon-pink text-white px-4 py-2 rounded-lg hover:bg-gorkhon-pink/90 flex items-center gap-2"
              >
                <Icon name="Plus" size={16} />
                Создать уведомление
              </button>
            </div>

      {isCreateMode && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border">
          <h2 className="text-lg font-semibold mb-4">
            {editingNotification ? 'Редактировать уведомление' : 'Новое уведомление'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Заголовок *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink/20 focus:border-gorkhon-pink"
                placeholder="Введите заголовок уведомления"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Содержание *
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Введите содержание уведомления..."
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL изображения
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink/20 focus:border-gorkhon-pink"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип уведомления
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink/20 focus:border-gorkhon-pink"
                >
                  <option value="update">Обновление</option>
                  <option value="feature">Новая функция</option>
                  <option value="maintenance">Технические работы</option>
                  <option value="announcement">Объявление</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Приоритет
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink/20 focus:border-gorkhon-pink"
                >
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                  <option value="critical">Критический</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 text-gorkhon-pink focus:ring-gorkhon-pink/20 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Активное уведомление
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-gorkhon-pink text-white px-6 py-2 rounded-lg hover:bg-gorkhon-pink/90"
              >
                {editingNotification ? 'Сохранить' : 'Создать'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Все уведомления ({notifications.length})
        </h2>
        
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Уведомлений пока нет
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white border rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                        {notification.priority}
                      </span>
                      {!notification.isActive && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Неактивно
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mb-2" dangerouslySetInnerHTML={{
                      __html: notification.content.substring(0, 150) + (notification.content.length > 150 ? '...' : '')
                    }} />
                    <div className="text-xs text-gray-500">
                      Создано: {notification.createdAt.toLocaleString()} | 
                      Прочитано: {notification.readBy.length} польз.
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(notification)}
                      className="p-2 text-gray-600 hover:text-gorkhon-blue hover:bg-gray-100 rounded"
                      title="Редактировать"
                    >
                      <Icon name="Edit" size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded"
                      title="Удалить"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
                
                {notification.imageUrl && (
                  <img 
                    src={notification.imageUrl} 
                    alt="Notification" 
                    className="w-full h-32 object-cover rounded mt-2"
                  />
                )}
              </div>
            ))}
          </div>
        )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationManager;