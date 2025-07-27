import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useUser';

interface ProfileInfoProps {
  user: UserProfile;
  isEditing: boolean;
  name: string;
  status: string;
  about: string;
  onNameChange: (name: string) => void;
  onStatusChange: (status: string) => void;
  onAboutChange: (about: string) => void;
}

const ProfileInfo = ({ 
  user, 
  isEditing, 
  name, 
  status, 
  about,
  onNameChange,
  onStatusChange,
  onAboutChange
}: ProfileInfoProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(Math.floor(Math.random() * 50) + 10);
  const [following, setFollowing] = useState(Math.floor(Math.random() * 30) + 5);
  const [posts, setPosts] = useState(Math.floor(Math.random() * 20) + 3);

  const getAge = () => {
    if (!user.birthDate) return null;
    const today = new Date();
    const birth = new Date(user.birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowers(prev => isFollowing ? prev - 1 : prev + 1);
  };

  return (
    <>
      {/* Основная информация */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className="text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-gorkhon-pink focus:outline-none w-full"
                placeholder="Ваше имя"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
            )}
            
            {isEditing ? (
              <input
                type="text"
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
                className="text-gray-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-gorkhon-pink w-full mt-2"
                placeholder="Ваш статус"
                maxLength={100}
              />
            ) : (
              status && <p className="text-gray-600 mt-1">{status}</p>
            )}
          </div>
          
          {/* Социальные кнопки */}
          <div className="flex gap-2 ml-4">
            <button 
              onClick={handleFollow}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                isFollowing 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-gorkhon-pink text-white hover:bg-gorkhon-pink/90'
              }`}
            >
              <Icon name={isFollowing ? "UserCheck" : "UserPlus"} size={14} />
              {isFollowing ? 'Подписан' : 'Подписаться'}
            </button>
            <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">
              <Icon name="MessageCircle" size={14} />
              Написать
            </button>
          </div>
        </div>

        {/* Счетчики как в ВК */}
        <div className="flex gap-6 text-sm">
          <div className="cursor-pointer hover:text-gorkhon-pink transition-colors">
            <span className="font-bold text-gray-800">{posts}</span>
            <span className="text-gray-600 ml-1">записей</span>
          </div>
          <div className="cursor-pointer hover:text-gorkhon-pink transition-colors">
            <span className="font-bold text-gray-800">{followers}</span>
            <span className="text-gray-600 ml-1">подписчиков</span>
          </div>
          <div className="cursor-pointer hover:text-gorkhon-pink transition-colors">
            <span className="font-bold text-gray-800">{following}</span>
            <span className="text-gray-600 ml-1">подписок</span>
          </div>
        </div>
      </div>

      {/* О себе */}
      {(about || isEditing) && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">О себе</h3>
          {isEditing ? (
            <textarea
              value={about}
              onChange={(e) => onAboutChange(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent resize-none"
              placeholder="Расскажите о себе..."
              maxLength={300}
            />
          ) : (
            <p className="text-gray-700">{about}</p>
          )}
        </div>
      )}

      {/* Подробная информация */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Icon name="Calendar" size={16} className="text-gray-400" />
          <span className="text-gray-600">
            {getAge() ? `${getAge()} лет` : 'Возраст не указан'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Icon name="MapPin" size={16} className="text-gray-400" />
          <span className="text-gray-600">Горхон</span>
        </div>
        {user.phone && (
          <div className="flex items-center gap-3">
            <Icon name="Phone" size={16} className="text-gray-400" />
            <span className="text-gray-600">{user.phone}</span>
          </div>
        )}
        {user.email && (
          <div className="flex items-center gap-3">
            <Icon name="Mail" size={16} className="text-gray-400" />
            <span className="text-gray-600">{user.email}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileInfo;