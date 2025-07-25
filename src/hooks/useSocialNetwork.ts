import { useState, useEffect } from 'react';

export interface ResidentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  birthDate: string;
  avatar: string;
  registrationDate: string;
  lastActive: string;
  isOnline: boolean;
  friends: string[];
  friendRequests: {
    sent: string[];
    received: string[];
  };
  bio?: string;
  interests?: string[];
  status?: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: ResidentProfile;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
}

const STORAGE_KEY = 'gorkhon_social_network';

export const useSocialNetwork = () => {
  const [allResidents, setAllResidents] = useState<ResidentProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<ResidentProfile | null>(null);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  // Загрузка данных при инициализации
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const data = JSON.parse(savedData);
      setAllResidents(data.residents || []);
      setFriendRequests(data.friendRequests || []);
    }
    
    // Загрузка текущего пользователя
    const currentUserData = localStorage.getItem('gorkhon_user');
    if (currentUserData) {
      const userData = JSON.parse(currentUserData);
      if (userData.id) {
        setCurrentUser(userData);
        // Добавляем пользователя в список жителей, если его там нет
        updateResidentsList(userData);
      }
    }
  }, []);

  // Сохранение в localStorage
  const saveData = (residents: ResidentProfile[], requests: FriendRequest[]) => {
    const data = {
      residents,
      friendRequests: requests,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  // Обновление списка жителей
  const updateResidentsList = (user: ResidentProfile) => {
    setAllResidents(prev => {
      const existingIndex = prev.findIndex(r => r.id === user.id);
      let updated;
      
      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = { ...user, lastActive: new Date().toISOString(), isOnline: true };
      } else {
        updated = [...prev, { ...user, lastActive: new Date().toISOString(), isOnline: true }];
      }
      
      saveData(updated, friendRequests);
      return updated;
    });
  };

  // Регистрация нового жителя
  const registerResident = (userData: Omit<ResidentProfile, 'id' | 'registrationDate' | 'lastActive' | 'isOnline' | 'friends' | 'friendRequests'>) => {
    const newResident: ResidentProfile = {
      ...userData,
      id: `resident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      registrationDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      isOnline: true,
      friends: [],
      friendRequests: {
        sent: [],
        received: []
      }
    };

    setCurrentUser(newResident);
    updateResidentsList(newResident);
    localStorage.setItem('gorkhon_user', JSON.stringify(newResident));
    
    return newResident;
  };

  // Поиск жителей
  const searchResidents = (query: string): ResidentProfile[] => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return allResidents.filter(resident => 
      resident.id !== currentUser?.id && (
        resident.name.toLowerCase().includes(searchTerm) ||
        resident.email.toLowerCase().includes(searchTerm) ||
        resident.interests?.some(interest => interest.toLowerCase().includes(searchTerm))
      )
    );
  };

  // Получение списка друзей
  const getFriends = (): ResidentProfile[] => {
    if (!currentUser) return [];
    
    return allResidents.filter(resident => 
      currentUser.friends.includes(resident.id)
    );
  };

  // Отправка заявки в друзья
  const sendFriendRequest = (toUserId: string): boolean => {
    if (!currentUser || toUserId === currentUser.id) return false;
    
    const targetUser = allResidents.find(r => r.id === toUserId);
    if (!targetUser) return false;

    // Проверяем, что заявка еще не отправлена
    const existingRequest = friendRequests.find(
      req => req.fromUserId === currentUser.id && req.toUserId === toUserId && req.status === 'pending'
    );
    
    if (existingRequest) return false;

    const newRequest: FriendRequest = {
      id: `request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromUserId: currentUser.id,
      toUserId,
      fromUser: currentUser,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    const updatedRequests = [...friendRequests, newRequest];
    setFriendRequests(updatedRequests);
    
    // Обновляем данные отправителя
    const updatedCurrentUser = {
      ...currentUser,
      friendRequests: {
        ...currentUser.friendRequests,
        sent: [...currentUser.friendRequests.sent, newRequest.id]
      }
    };
    setCurrentUser(updatedCurrentUser);
    localStorage.setItem('gorkhon_user', JSON.stringify(updatedCurrentUser));

    // Обновляем данные получателя
    const updatedResidents = allResidents.map(resident => {
      if (resident.id === toUserId) {
        return {
          ...resident,
          friendRequests: {
            ...resident.friendRequests,
            received: [...resident.friendRequests.received, newRequest.id]
          }
        };
      }
      return resident;
    });
    
    setAllResidents(updatedResidents);
    saveData(updatedResidents, updatedRequests);
    
    return true;
  };

  // Принятие заявки в друзья
  const acceptFriendRequest = (requestId: string): boolean => {
    if (!currentUser) return false;

    const request = friendRequests.find(r => r.id === requestId);
    if (!request || request.toUserId !== currentUser.id) return false;

    // Обновляем статус заявки
    const updatedRequests = friendRequests.map(req =>
      req.id === requestId ? { ...req, status: 'accepted' as const } : req
    );
    setFriendRequests(updatedRequests);

    // Добавляем в друзья обоих пользователей
    const updatedCurrentUser = {
      ...currentUser,
      friends: [...currentUser.friends, request.fromUserId],
      friendRequests: {
        ...currentUser.friendRequests,
        received: currentUser.friendRequests.received.filter(id => id !== requestId)
      }
    };
    setCurrentUser(updatedCurrentUser);
    localStorage.setItem('gorkhon_user', JSON.stringify(updatedCurrentUser));

    // Обновляем данные отправителя заявки
    const updatedResidents = allResidents.map(resident => {
      if (resident.id === request.fromUserId) {
        return {
          ...resident,
          friends: [...resident.friends, currentUser.id],
          friendRequests: {
            ...resident.friendRequests,
            sent: resident.friendRequests.sent.filter(id => id !== requestId)
          }
        };
      }
      return resident;
    });

    setAllResidents(updatedResidents);
    saveData(updatedResidents, updatedRequests);
    
    return true;
  };

  // Отклонение заявки в друзья
  const declineFriendRequest = (requestId: string): boolean => {
    if (!currentUser) return false;

    const request = friendRequests.find(r => r.id === requestId);
    if (!request || request.toUserId !== currentUser.id) return false;

    // Обновляем статус заявки
    const updatedRequests = friendRequests.map(req =>
      req.id === requestId ? { ...req, status: 'declined' as const } : req
    );
    setFriendRequests(updatedRequests);

    // Убираем заявку из списков
    const updatedCurrentUser = {
      ...currentUser,
      friendRequests: {
        ...currentUser.friendRequests,
        received: currentUser.friendRequests.received.filter(id => id !== requestId)
      }
    };
    setCurrentUser(updatedCurrentUser);
    localStorage.setItem('gorkhon_user', JSON.stringify(updatedCurrentUser));

    const updatedResidents = allResidents.map(resident => {
      if (resident.id === request.fromUserId) {
        return {
          ...resident,
          friendRequests: {
            ...resident.friendRequests,
            sent: resident.friendRequests.sent.filter(id => id !== requestId)
          }
        };
      }
      return resident;
    });

    setAllResidents(updatedResidents);
    saveData(updatedResidents, updatedRequests);
    
    return true;
  };

  // Получение входящих заявок в друзья
  const getIncomingFriendRequests = (): FriendRequest[] => {
    if (!currentUser) return [];
    
    return friendRequests.filter(
      req => req.toUserId === currentUser.id && req.status === 'pending'
    );
  };

  // Получение исходящих заявок в друзья
  const getOutgoingFriendRequests = (): FriendRequest[] => {
    if (!currentUser) return [];
    
    return friendRequests.filter(
      req => req.fromUserId === currentUser.id && req.status === 'pending'
    );
  };

  // Проверка статуса дружбы
  const getFriendshipStatus = (userId: string): 'friends' | 'request_sent' | 'request_received' | 'none' => {
    if (!currentUser) return 'none';
    
    if (currentUser.friends.includes(userId)) {
      return 'friends';
    }
    
    const sentRequest = friendRequests.find(
      req => req.fromUserId === currentUser.id && req.toUserId === userId && req.status === 'pending'
    );
    if (sentRequest) return 'request_sent';
    
    const receivedRequest = friendRequests.find(
      req => req.fromUserId === userId && req.toUserId === currentUser.id && req.status === 'pending'
    );
    if (receivedRequest) return 'request_received';
    
    return 'none';
  };

  // Удаление из друзей
  const removeFriend = (friendId: string): boolean => {
    if (!currentUser) return false;

    // Обновляем текущего пользователя
    const updatedCurrentUser = {
      ...currentUser,
      friends: currentUser.friends.filter(id => id !== friendId)
    };
    setCurrentUser(updatedCurrentUser);
    localStorage.setItem('gorkhon_user', JSON.stringify(updatedCurrentUser));

    // Обновляем друга
    const updatedResidents = allResidents.map(resident => {
      if (resident.id === friendId) {
        return {
          ...resident,
          friends: resident.friends.filter(id => id !== currentUser.id)
        };
      }
      return resident;
    });

    setAllResidents(updatedResidents);
    saveData(updatedResidents, friendRequests);
    
    return true;
  };

  return {
    allResidents,
    currentUser,
    friendRequests,
    registerResident,
    searchResidents,
    getFriends,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    getIncomingFriendRequests,
    getOutgoingFriendRequests,
    getFriendshipStatus,
    removeFriend,
    updateResidentsList
  };
};