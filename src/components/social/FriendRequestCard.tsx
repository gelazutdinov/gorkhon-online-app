import Icon from '@/components/ui/icon';
import { FriendRequest, UserProfileWithFriendship } from './types';

interface FriendRequestCardProps {
  request: FriendRequest;
  user: UserProfileWithFriendship;
  getAge: (birthDate: string) => number;
  onAccept: (requestId: string, fromUserId: string) => void;
  onReject: (requestId: string) => void;
}

const FriendRequestCard = ({ request, user, getAge, onAccept, onReject }: FriendRequestCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
          {user.avatar.startsWith('data:') ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            user.avatar
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">{user.name}</h3>
              <p className="text-sm text-gray-600">{getAge(user.birthDate)} лет</p>
              <p className="text-sm text-gray-500 mt-1">
                Отправил заявку {new Date(request.createdAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => onAccept(request.id, request.fromUserId)}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
              >
                Принять
              </button>
              <button
                onClick={() => onReject(request.id)}
                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition-colors"
              >
                Отклонить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendRequestCard;