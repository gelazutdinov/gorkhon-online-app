import Icon from '@/components/ui/icon';
import { Story } from './advanced-types';

interface AdvancedStoriesMainProps {
  stories: Story[];
  currentUser?: any;
  onCreateStory: () => void;
  onStoryClick: (index: number) => void;
}

const AdvancedStoriesMain = ({ stories, currentUser, onCreateStory, onStoryClick }: AdvancedStoriesMainProps) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 px-1">
      {/* Кнопка добавления истории */}
      {currentUser && (
        <div className="flex-shrink-0">
          <button
            onClick={onCreateStory}
            className="flex flex-col items-center gap-2"
          >
            <div className="relative w-16 h-16">
              <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center border-2 border-white shadow-md">
                <Icon name="Plus" size={24} className="text-white" />
              </div>
            </div>
            <span className="text-xs text-gray-600 max-w-[70px] truncate">Создать</span>
          </button>
        </div>
      )}

      {/* Пользовательские истории */}
      {stories.map((story, index) => (
        <div key={story.id} className="flex-shrink-0">
          <button
            onClick={() => onStoryClick(index)}
            className="flex flex-col items-center gap-2"
          >
            <div className="relative w-16 h-16">
              <div className={`w-full h-full rounded-full p-0.5 ${
                story.viewed 
                  ? 'bg-gray-300' 
                  : 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500'
              }`}>
                <div className="w-full h-full rounded-full bg-white p-0.5">
                  <div 
                    className="w-full h-full rounded-full bg-cover bg-center flex items-center justify-center text-xl overflow-hidden"
                    style={{ 
                      backgroundImage: story.userAvatar.startsWith('http') || story.userAvatar.startsWith('data:') 
                        ? `url(${story.userAvatar})` : undefined
                    }}
                  >
                    {!story.userAvatar.startsWith('http') && !story.userAvatar.startsWith('data:') && story.userAvatar}
                  </div>
                </div>
              </div>
              {/* Индикатор музыки */}
              {story.music && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Icon name="Music" size={12} className="text-white" />
                </div>
              )}
            </div>
            <span className="text-xs text-gray-600 max-w-[70px] truncate">{story.userName}</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdvancedStoriesMain;