import { useState, useEffect } from 'react';
import { UserProfile } from '@/hooks/useUser';
import UserProfileHeader from '@/components/dashboard/UserProfileHeader';
import DashboardActions from '@/components/dashboard/DashboardActions';
import StatisticsModal from '@/components/dashboard/StatisticsModal';
import DashboardModals from '@/components/dashboard/DashboardModals';

interface UserDashboardProps {
  user: UserProfile;
  daysWithUs: number;
  formattedTimeSpent: string;
  onLogout: () => void;
  onUserUpdate?: (user: UserProfile) => void;
  onSectionChange: (section: string) => void;
}

const UserDashboard = ({ user, daysWithUs, formattedTimeSpent, onLogout, onUserUpdate, onSectionChange }: UserDashboardProps) => {
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDataManager, setShowDataManager] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showSocialProfile, setShowSocialProfile] = useState(false);
  const [showResidentsFeed, setShowResidentsFeed] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Инициализация темы и подсчет непрочитанных уведомлений
  useEffect(() => {
    // Применяем сохраненную тему
    const savedTheme = localStorage.getItem('gorkhon_theme');
    if (savedTheme && savedTheme !== 'default') {
      const themes = {
        nature: { primary: '#10B981', secondary: '#059669', accent: '#34D399' },
        ocean: { primary: '#0EA5E9', secondary: '#0284C7', accent: '#38BDF8' },
        sunset: { primary: '#F97316', secondary: '#EA580C', accent: '#FB923C' },
        purple: { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA' },
        dark: { primary: '#374151', secondary: '#1F2937', accent: '#6B7280' }
      };
      
      const theme = themes[savedTheme as keyof typeof themes];
      if (theme) {
        const root = document.documentElement;
        root.style.setProperty('--color-gorkhon-pink', theme.primary);
        root.style.setProperty('--color-gorkhon-green', theme.secondary);
        root.style.setProperty('--color-gorkhon-blue', theme.accent);
      }
    }

    // Подсчет непрочитанных уведомлений
    const savedNotifications = localStorage.getItem('gorkhon_notifications');
    if (savedNotifications) {
      try {
        const notifications = JSON.parse(savedNotifications);
        const unreadCount = notifications.filter((n: any) => !n.read).length;
        setUnreadNotifications(unreadCount);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);
  
  const getRegistrationDate = () => {
    return new Date(user.registeredAt).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getMostUsedFeature = () => {
    const features = user.stats?.featuresUsed || {};
    const entries = Object.entries(features);
    if (entries.length === 0) return 'Пока нет данных';
    
    const [featureName] = entries.reduce((a, b) => a[1] > b[1] ? a : b);
    
    const featureNames: Record<string, string> = {
      importantNumbers: 'Важные номера',
      schedule: 'Расписание транспорта',
      donation: 'Помощь поселку',
      workSchedule: 'Режим работы',
      pvz: 'Пункты выдачи',
      notifications: 'Уведомления'
    };
    
    return featureNames[featureName] || featureName;
  };

  const getMostVisitedSection = () => {
    const sections = user.stats?.sectionsVisited || {};
    const entries = Object.entries(sections);
    if (entries.length === 0) return 'Пока нет данных';
    
    const [sectionName] = entries.reduce((a, b) => a[1] > b[1] ? a : b);
    
    const sectionNames: Record<string, string> = {
      home: 'Главная',
      news: 'Новости',
      support: 'Поддержка',
      profile: 'Личный кабинет'
    };
    
    return sectionNames[sectionName] || sectionName;
  };

  const getActivityLevel = () => {
    const totalActions = Object.values(user.stats?.featuresUsed || {}).reduce((sum, count) => sum + count, 0);
    if (totalActions < 10) return { level: 'Новичок', color: 'text-gray-600', bg: 'bg-gray-100' };
    if (totalActions < 50) return { level: 'Активный пользователь', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (totalActions < 100) return { level: 'Опытный житель', color: 'text-green-600', bg: 'bg-green-100' };
    return { level: 'Мастер платформы', color: 'text-purple-600', bg: 'bg-purple-100' };
  };

  const updateNotificationCount = () => {
    const savedNotifications = localStorage.getItem('gorkhon_notifications');
    if (savedNotifications) {
      try {
        const notifications = JSON.parse(savedNotifications);
        const unreadCount = notifications.filter((n: any) => !n.read).length;
        setUnreadNotifications(unreadCount);
      } catch (error) {
        console.error('Error updating notification count:', error);
      }
    }
  };

  const activityLevel = getActivityLevel();

  return (
    <div className="space-y-6">
      <UserProfileHeader user={user} activityLevel={activityLevel} />
      
      <DashboardActions
        unreadNotifications={unreadNotifications}
        onShowSocialProfile={() => setShowSocialProfile(true)}
        onShowResidentsFeed={() => setShowResidentsFeed(true)}
        onShowStatistics={() => setShowStatistics(true)}
        onShowNotifications={() => setShowNotifications(true)}
        onShowProfileSettings={() => setShowProfileSettings(true)}
        onShowThemeSelector={() => setShowThemeSelector(true)}
        onShowDataManager={() => setShowDataManager(true)}
        onLogout={onLogout}
      />

      {/* Модальное окно статистики */}
      {showStatistics && (
        <StatisticsModal
          user={user}
          daysWithUs={daysWithUs}
          formattedTimeSpent={formattedTimeSpent}
          getMostVisitedSection={getMostVisitedSection}
          getMostUsedFeature={getMostUsedFeature}
          getRegistrationDate={getRegistrationDate}
          onClose={() => setShowStatistics(false)}
        />
      )}

      <DashboardModals
        user={user}
        showProfileSettings={showProfileSettings}
        showNotifications={showNotifications}
        showDataManager={showDataManager}
        showThemeSelector={showThemeSelector}
        showQuickActions={showQuickActions}
        showSocialProfile={showSocialProfile}
        showResidentsFeed={showResidentsFeed}
        onUserUpdate={onUserUpdate}
        onSectionChange={onSectionChange}
        onCloseProfileSettings={() => setShowProfileSettings(false)}
        onCloseNotifications={() => setShowNotifications(false)}
        onCloseDataManager={() => setShowDataManager(false)}
        onCloseThemeSelector={() => setShowThemeSelector(false)}
        onCloseQuickActions={() => setShowQuickActions(false)}
        onCloseSocialProfile={() => setShowSocialProfile(false)}
        onCloseResidentsFeed={() => setShowResidentsFeed(false)}
        onUpdateNotificationCount={updateNotificationCount}
      />
    </div>
  );
};

export default UserDashboard;