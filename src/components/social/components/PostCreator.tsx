import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';

interface PostCreatorProps {
  currentUser: UserProfile;
  newPost: string;
  onPostChange: (content: string) => void;
  onCreatePost: () => void;
}

const PostCreator = ({ currentUser, newPost, onPostChange, onCreatePost }: PostCreatorProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-lg flex-shrink-0">
          {currentUser.avatar}
        </div>
        <div className="flex-1">
          <textarea
            value={newPost}
            onChange={(e) => onPostChange(e.target.value)}
            placeholder="Что у вас нового?"
            className="w-full resize-none border-none outline-none text-gray-700 placeholder-gray-400 bg-gray-50 rounded-lg p-3 min-h-[80px]"
          />
          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-3">
              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                <Icon name="Camera" size={16} />
                <span className="text-sm">Фото</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                <Icon name="MapPin" size={16} />
                <span className="text-sm">Место</span>
              </button>
            </div>
            <button
              onClick={onCreatePost}
              disabled={!newPost.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Опубликовать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCreator;