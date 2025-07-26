import React from 'react';
import Icon from '@/components/ui/icon';
import { User } from './types';

interface StoriesMainProps {
  users: User[];
  onCreateStory: () => void;
  onViewStory: (userId: string) => void;
}

const StoriesMain: React.FC<StoriesMainProps> = ({
  users,
  onCreateStory,
  onViewStory
}) => {
  return (
    <div className="w-full max-w-md mx-auto p-2">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {users.map(user => (
          <div key={user.id} className="flex-shrink-0 text-center">
            <div className="relative">
              <div
                className={`w-20 h-20 rounded-full p-1 ${
                  user.hasStory 
                    ? 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500' 
                    : 'bg-gray-300'
                }`}
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-full h-full object-cover rounded-full bg-white p-0.5"
                />
              </div>
              
              {user.id === 'current_user' && (
                <button
                  onClick={onCreateStory}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Icon name="Plus" size={16} />
                </button>
              )}
            </div>
            
            {user.hasStory && user.id !== 'current_user' && (
              <button
                onClick={() => onViewStory(user.id)}
                className="w-full mt-1"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoriesMain;