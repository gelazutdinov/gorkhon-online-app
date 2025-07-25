import { SocialPost, SocialUser, formatTimeAgo } from '../types/SocialTypes';
import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';

interface PostItemProps {
  post: SocialPost;
  author: SocialUser | undefined;
  currentUser: UserProfile;
  onToggleLike: (postId: string) => void;
  onDeletePost?: (postId: string) => void;
}

const PostItem = ({ post, author, currentUser, onToggleLike, onDeletePost }: PostItemProps) => {
  if (!author) return null;

  const canDelete = post.authorId === currentUser.id;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Заголовок поста */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-lg flex-shrink-0">
            {author.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{author.name}</h3>
                  {author.id === 'gorkhon_official' && (
                    <>
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Icon name="Check" size={12} className="text-white" />
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                        Официальный
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500">{formatTimeAgo(post.timestamp)}</p>
              </div>
              
              {/* Кнопка удаления для автора поста */}
              {canDelete && onDeletePost && (
                <button
                  onClick={() => onDeletePost(post.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                  title="Удалить пост"
                >
                  <Icon name="Trash2" size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Содержимое поста */}
      <div className="p-4">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
        
        {/* Изображения */}
        {post.images && post.images.length > 0 && (
          <div className="mt-3 rounded-lg overflow-hidden">
            <img 
              src={post.images[0]} 
              alt="Post attachment" 
              className="w-full h-64 object-cover"
            />
          </div>
        )}
      </div>

      {/* Статистика и кнопки действий */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <div className="flex items-center gap-4">
            {post.likes.length > 0 && (
              <span className="flex items-center gap-1">
                <Icon name="Heart" size={14} className="text-red-500" />
                {post.likes.length}
              </span>
            )}
            {post.comments.length > 0 && (
              <span>{post.comments.length} комментариев</span>
            )}
            {post.shares > 0 && (
              <span>{post.shares} репостов</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            onClick={() => onToggleLike(post.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              post.likes.includes(currentUser.id)
                ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon name="Heart" size={16} className={post.likes.includes(currentUser.id) ? 'fill-current' : ''} />
            <span className="text-sm font-medium">Нравится</span>
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            <Icon name="MessageCircle" size={16} />
            <span className="text-sm font-medium">Комментировать</span>
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            <Icon name="Share" size={16} />
            <span className="text-sm font-medium">Поделиться</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostItem;