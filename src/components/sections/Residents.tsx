import { useState } from 'react';
import ResidentsList from '@/components/social/ResidentsList';
import ResidentProfile from '@/components/social/ResidentProfile';
import { UserProfile } from '@/types/user';

const Residents = () => {
  const [selectedResident, setSelectedResident] = useState<UserProfile | null>(null);

  const handleAddFriend = (userId: string) => {
    console.log('Add friend:', userId);
  };

  const handleRemoveFriend = (userId: string) => {
    console.log('Remove friend:', userId);
  };

  const handleSendMessage = (userId: string) => {
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