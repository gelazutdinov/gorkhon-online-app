import { useState } from 'react';
import { Comment, SocialUser } from '../types/SocialTypes';
import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';

interface CommentsProps {
  comments: Comment[];
  socialUsers: SocialUser[];
  currentUser: UserProfile;
  onAddComment: (content: string) => void;
  onToggleCommentLike: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
}

const Comments = ({ 
  comments, 
  socialUsers, 
  currentUser, 
  onAddComment, 
  onToggleCommentLike,
  onDeleteComment 
}: CommentsProps) => {
  const [newComment, setNewComment] = useState('');
  const [showAll, setShowAll] = useState(false);

  const getUserById = (userId: string) => 
    socialUsers.find(u => u.id === userId);

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const visibleComments = showAll ? comments : comments.slice(0, 3);

  return (
    <div className="border-t border-gray-100 pt-3">
      {/* Показать больше комментариев */}
      {comments.length > 3 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="text-sm text-gray-500 hover:text-gray-700 mb-3"
        >
          Показать все {comments.length} комментариев
        </button>
      )}

      {/* Список комментариев */}
      <div className="space-y-3 mb-3">
        {visibleComments.map(comment => {
          const author = getUserById(comment.authorId);
          if (!author) return null;

          const isLiked = comment.likes.includes(currentUser.id);
          const canDelete = comment.authorId === currentUser.id;

          return (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm flex-shrink-0">
                {author.avatar.startsWith('data:') ? (
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  author.avatar
                )}
              </div>
              
              <div className="flex-1">
                <div className="bg-gray-50 rounded-2xl px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-gray-900">{author.name}</span>
                    {canDelete && onDeleteComment && (
                      <button
                        onClick={() => onDeleteComment(comment.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Icon name="Trash2" size={12} />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-800 text-sm mt-1">{comment.content}</p>
                </div>
                
                <div className="flex items-center gap-4 mt-1 ml-2">
                  <span className="text-xs text-gray-500">
                    {new Date(comment.timestamp).toLocaleString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  
                  <button
                    onClick={() => onToggleCommentLike(comment.id)}
                    className={`flex items-center gap-1 text-xs ${
                      isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    } transition-colors`}
                  >
                    <Icon name="Heart" size={12} className={isLiked ? 'fill-current' : ''} />
                    {comment.likes.length > 0 && (
                      <span>{comment.likes.length}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Свернуть комментарии */}
      {showAll && comments.length > 3 && (
        <button
          onClick={() => setShowAll(false)}
          className="text-sm text-gray-500 hover:text-gray-700 mb-3"
        >
          Скрыть комментарии
        </button>
      )}

      {/* Форма добавления комментария */}
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm flex-shrink-0">
          {currentUser.avatar.startsWith && currentUser.avatar.startsWith('data:') ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            currentUser.avatar
          )}
        </div>
        
        <div className="flex-1 relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Написать комментарий..."
            className="w-full px-4 py-2 pr-10 bg-gray-50 rounded-2xl resize-none border-none outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            rows={1}
          />
          
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="Send" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comments;