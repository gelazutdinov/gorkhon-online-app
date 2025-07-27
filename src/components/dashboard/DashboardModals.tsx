import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useUser';
import ProfileSettings from '@/components/profile/ProfileSettings';
import NotificationCenter from '@/components/features/NotificationCenter';
import DataExportImport from '@/components/features/DataExportImport';
import ThemeSelector from '@/components/features/ThemeSelector';
import QuickActions from '@/components/features/QuickActions';
import VKProfile from '@/components/social/VKProfile';
import ResidentsFeed from '@/components/social/ResidentsFeed';

interface DashboardModalsProps {
  user: UserProfile;
  showProfileSettings: boolean;
  showNotifications: boolean;
  showDataManager: boolean;
  showThemeSelector: boolean;
  showQuickActions: boolean;
  showSocialProfile: boolean;
  showResidentsFeed: boolean;
  onUserUpdate?: (user: UserProfile) => void;
  onSectionChange: (section: string) => void;
  onCloseProfileSettings: () => void;
  onCloseNotifications: () => void;
  onCloseDataManager: () => void;
  onCloseThemeSelector: () => void;
  onCloseQuickActions: () => void;
  onCloseSocialProfile: () => void;
  onCloseResidentsFeed: () => void;
  onUpdateNotificationCount: () => void;
}

const DashboardModals = ({
  user,
  showProfileSettings,
  showNotifications,
  showDataManager,
  showThemeSelector,
  showQuickActions,
  showSocialProfile,
  showResidentsFeed,
  onUserUpdate,
  onSectionChange,
  onCloseProfileSettings,
  onCloseNotifications,
  onCloseDataManager,
  onCloseThemeSelector,
  onCloseQuickActions,
  onCloseSocialProfile,
  onCloseResidentsFeed,
  onUpdateNotificationCount
}: DashboardModalsProps) => {
  return (
    <>
      {/* Модальное окно настроек */}
      {showProfileSettings && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
          <div className="relative">
            <ProfileSettings
              user={user}
              onUserUpdate={onUserUpdate}
              onClose={onCloseProfileSettings}
            />
          </div>
        </div>
      )}

      {/* Модальное окно уведомлений */}
      {showNotifications && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
          <div className="relative">
            <NotificationCenter
              onClose={() => {
                onCloseNotifications();
                onUpdateNotificationCount();
              }}
            />
          </div>
        </div>
      )}

      {/* Модальное окно управления данными */}
      {showDataManager && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
          <div className="relative">
            <DataExportImport
              user={user}
              onClose={onCloseDataManager}
              onImportSuccess={(importedUser) => {
                if (onUserUpdate) {
                  onUserUpdate(importedUser);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Модальное окно выбора темы */}
      {showThemeSelector && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
          <div className="relative">
            <ThemeSelector
              onClose={onCloseThemeSelector}
            />
          </div>
        </div>
      )}

      {/* Модальное окно быстрых действий */}
      {showQuickActions && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
          <div className="relative">
            <QuickActions
              onClose={onCloseQuickActions}
              onSectionChange={onSectionChange}
            />
          </div>
        </div>
      )}

      {/* Модальное окно социального профиля */}
      {showSocialProfile && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
          <div className="relative">
            <VKProfile
              user={user}
              onUserUpdate={onUserUpdate}
              onClose={onCloseSocialProfile}
            />
          </div>
        </div>
      )}

      {/* Модальное окно ленты жителей */}
      {showResidentsFeed && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
          <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-gray-800">Жители Горхона</h2>
              <button
                onClick={onCloseResidentsFeed}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon name="X" size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <ResidentsFeed
                currentUser={user}
                onViewProfile={(resident: any) => {
                  console.log('Viewing profile:', resident);
                  // Здесь можно добавить логику просмотра профиля другого жителя
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardModals;