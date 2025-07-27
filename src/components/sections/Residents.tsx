import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import ResidentsList from '@/components/social/ResidentsList';
import ResidentProfile from '@/components/social/ResidentProfile';
import { UserProfile } from '@/hooks/useUser';

const Residents = () => {
  const { user, updateUser } = useUser();
  const [selectedResident, setSelectedResident] = useState<UserProfile | null>(null);

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          Для просмотра списка жителей необходимо войти в аккаунт
        </div>
      </div>
    );
  }

  const handleAddFriend = (userId: string) => {
    const updatedFriends = [...(user.friends || []), userId];
    const updatedUser = { ...user, friends: updatedFriends };
    updateUser(updatedUser);
  };

  const handleRemoveFriend = (userId: string) => {
    const updatedFriends = (user.friends || []).filter(id => id !== userId);
    const updatedUser = { ...user, friends: updatedFriends };
    updateUser(updatedUser);
  };

  const handleSendMessage = (userId: string) => {
    // В будущем здесь будет система сообщений
    alert(`Функция отправки сообщений пока в разработке. ID получателя: ${userId}`);
  };

  return (
    <div className="space-y-6">
      {selectedResident ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
          <div className="relative">
            <ResidentProfile
              resident={selectedResident}
              currentUser={user}
              onClose={() => setSelectedResident(null)}
              onAddFriend={handleAddFriend}
              onRemoveFriend={handleRemoveFriend}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      ) : null}

      <ResidentsList 
        currentUser={user}
        onUserSelect={setSelectedResident}
      />
    </div>
  );
};

export default Residents;