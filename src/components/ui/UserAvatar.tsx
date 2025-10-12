import { UserProfile } from '@/types/user';

interface UserAvatarProps {
  user: UserProfile;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const UserAvatar = ({ user, size = 'md', className = '' }: UserAvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
  };

  const iconSizes = {
    sm: '16',
    md: '24',
    lg: '40', 
    xl: '64'
  };

  // Определяем цвета на основе пола
  const isFemale = user.gender === 'female';
  const bgColor = isFemale ? 'bg-blue-500' : 'bg-gorkhon-pink';
  const silhouetteColor = isFemale ? 'text-gorkhon-pink' : 'text-blue-500';

  return (
    <div className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center overflow-hidden ${className}`}>
      {/* SVG силуэт пользователя */}
      <svg 
        width={iconSizes[size]} 
        height={iconSizes[size]} 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={silhouetteColor}
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    </div>
  );
};

export default UserAvatar;