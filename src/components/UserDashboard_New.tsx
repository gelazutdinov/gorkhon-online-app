import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProfileEditModal from '@/components/ProfileEditModal';
import UserManagement from '@/components/admin/UserManagement';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTabs';
import ProfileContent from '@/components/profile/ProfileContent';
import SettingsContent from '@/components/profile/SettingsContent';
import SettingsModals from '@/components/profile/SettingsModals';

const UserDashboard_New = () => {
  const { user, logout, updateProfile, isAdmin } = useAuth();
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Настройки состояния
  const [settings, setSettings] = useState({
    profilePrivate: true,
    twoFactorAuth: false,
    emailNotifications: true,
    pushNotifications: true,
    newsUpdates: true,
    darkTheme: false,
    compactView: false,
    language: 'ru'
  });

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showActivityHistory, setShowActivityHistory] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
  };

  const handleProfileUpdate = async (updates: any) => {
    await updateProfile(updates);
  };

  // Функции для работы с настройками
  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLanguageChange = (newLang: string) => {
    setSettings(prev => ({ ...prev, language: newLang }));
    setShowLanguageSelect(false);
  };

  const handlePasswordChange = () => {
    setShowPasswordChange(true);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо.')) {
      setShowDeleteAccount(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ProfileHeader 
        user={user}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      <ProfileTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isAdmin={isAdmin}
      />

      {/* Content */}
      <div className="p-4 space-y-4 pb-20">
        {activeTab === 'profile' && (
          <ProfileContent
            user={user}
            onEditProfile={() => setShowProfileEdit(true)}
            onOpenSettings={() => setActiveTab('settings')}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsContent
            settings={settings}
            onToggleSetting={toggleSetting}
            onEditProfile={() => setShowProfileEdit(true)}
            onPasswordChange={handlePasswordChange}
            onShowActivityHistory={() => setShowActivityHistory(true)}
            onDeleteAccount={handleDeleteAccount}
          />
        )}

        {activeTab === 'admin' && isAdmin && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <UserManagement />
          </div>
        )}
      </div>

      {/* Модалка редактирования профиля */}
      {showProfileEdit && (
        <ProfileEditModal
          user={user}
          onClose={() => setShowProfileEdit(false)}
          onUpdate={handleProfileUpdate}
        />
      )}

      <SettingsModals
        showPasswordChange={showPasswordChange}
        showActivityHistory={showActivityHistory}
        onClosePasswordChange={() => setShowPasswordChange(false)}
        onCloseActivityHistory={() => setShowActivityHistory(false)}
      />
    </div>
  );
};

export default UserDashboard_New;