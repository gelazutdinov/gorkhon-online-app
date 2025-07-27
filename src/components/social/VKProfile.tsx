import { useState } from 'react';
import { UserProfile } from '@/hooks/useUser';
import ProfileHeader from './ProfileHeader';
import ProfileInfo from './ProfileInfo';
import ProfileInterests from './ProfileInterests';
import ProfileActivity from './ProfileActivity';

interface VKProfileProps {
  user: UserProfile;
  onUserUpdate?: (user: UserProfile) => void;
  onClose: () => void;
  onLogout?: () => void;
}

const VKProfile = ({ user, onUserUpdate, onClose, onLogout }: VKProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [status, setStatus] = useState(user.status || '');
  const [birthDate, setBirthDate] = useState(user.birthDate || '');
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [interests, setInterests] = useState<string[]>(user.interests || []);
  const [about, setAbout] = useState(user.about || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedUser: UserProfile = {
        ...user,
        name: name.trim(),
        status: status.trim(),
        birthDate,
        phone: phone.trim(),
        email: email.trim(),
        interests,
        about: about.trim()
      };

      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addInterest = (interest: string) => {
    if (!interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'logout':
        if (onLogout) {
          onLogout();
        }
        break;
      case 'privacy':
        window.open('/privacy', '_blank');
        break;
      case 'terms':
        window.open('/terms', '_blank');
        break;
      case 'data-protection':
        window.open('/data-protection', '_blank');
        break;
      default:
        console.log(`Action: ${action}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200 relative">
      <ProfileHeader
        user={user}
        isEditing={isEditing}
        onEditToggle={setIsEditing}
        onSave={handleSave}
        onClose={onClose}
        onMenuAction={handleMenuAction}
        isSaving={isSaving}
      />

      <div className="pt-16 p-6 space-y-6">
        <ProfileInfo
          user={user}
          isEditing={isEditing}
          name={name}
          status={status}
          about={about}
          onNameChange={setName}
          onStatusChange={setStatus}
          onAboutChange={setAbout}
        />

        <ProfileInterests
          interests={interests}
          isEditing={isEditing}
          onAddInterest={addInterest}
          onRemoveInterest={removeInterest}
        />

        <ProfileActivity user={user} />

        {/* Кнопки действий для редактирования */}
        {isEditing && (
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 py-3 px-4 bg-gorkhon-pink text-white rounded-lg hover:bg-gorkhon-pink/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Сохранение...
                </div>
              ) : (
                'Сохранить'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VKProfile;