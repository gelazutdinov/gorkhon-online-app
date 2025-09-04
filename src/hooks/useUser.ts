import { useState, useEffect, useCallback, useMemo } from 'react';
import { useThrottledCallback } from './usePerformance';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  birthDate: string;
  avatar: string;
  interests?: string[];
  status?: string;
  city?: string;
  about?: string;
  friends?: number;
  isOnline?: boolean;
  registeredAt: number;
  lastActiveAt: number;
  stats: {
    totalSessions: number;
    totalTimeSpent: number; // в минутах
    sectionsVisited: {
      home: number;
      news: number;
      support: number;
      profile: number;
    };
    featuresUsed: {
      importantNumbers: number;
      schedule: number;
      donation: number;
      workSchedule: number;
      pvz: number;
      notifications: number;
    };
    daysActive: number;
  };
}

const STORAGE_KEY = 'gorkhon_user_profile';
const SESSION_KEY = 'gorkhon_session_start';

export const useUser = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Мемоизация для предотвращения лишних вычислений
  const userStats = useMemo(() => {
    if (!user) return null;
    return {
      daysWithUs: Math.floor((Date.now() - user.registeredAt) / (1000 * 60 * 60 * 24)),
      totalSessions: user.stats.totalSessions,
      timeSpent: `${Math.floor(user.stats.totalTimeSpent / 60)}ч ${user.stats.totalTimeSpent % 60}м`
    };
  }, [user]);
  
  // Оптимизированное сохранение в localStorage с throttling
  const saveUserThrottled = useThrottledCallback((userData: UserProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  }, 1000);

  useEffect(() => {
    // Загрузка профиля пользователя
    const savedProfile = localStorage.getItem(STORAGE_KEY);
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        
        // Миграция старого профиля для совместимости
        const migratedProfile: UserProfile = {
          id: profile.id || `user_${Date.now()}`,
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          gender: profile.gender || 'male',
          birthDate: profile.birthDate || '',
          avatar: profile.avatar || (profile.gender === 'female' ? '👩' : '👨'),
          interests: profile.interests || [],
          status: profile.status || '',
          city: profile.city || 'Горхон',
          about: profile.about || '',
          friends: profile.friends || [],
          isOnline: true,
          registeredAt: profile.registeredAt || Date.now(),
          lastActiveAt: profile.lastActiveAt || Date.now(),
          stats: {
            totalSessions: profile.stats?.totalSessions || 1,
            totalTimeSpent: profile.stats?.totalTimeSpent || 0,
            sectionsVisited: {
              home: profile.stats?.sectionsVisited?.home || 0,
              news: profile.stats?.sectionsVisited?.news || 0,
              support: profile.stats?.sectionsVisited?.support || 0,
              profile: profile.stats?.sectionsVisited?.profile || 1
            },
            featuresUsed: {
              importantNumbers: profile.stats?.featuresUsed?.importantNumbers || 0,
              schedule: profile.stats?.featuresUsed?.schedule || 0,
              donation: profile.stats?.featuresUsed?.donation || 0,
              workSchedule: profile.stats?.featuresUsed?.workSchedule || 0,
              pvz: profile.stats?.featuresUsed?.pvz || 0,
              notifications: profile.stats?.featuresUsed?.notifications || 0
            },
            daysActive: profile.stats?.daysActive || 1
          }
        };
        
        setUser(migratedProfile);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedProfile));
        
        // Обновляем последнюю активность и начинаем новую сессию
        updateLastActive(profile);
        startSession();
      } catch (error) {
        // Silently handle JSON parsing errors
      }
    }
    setIsLoading(false);
  }, []);

  // Отслеживание времени сессии
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      updateSessionTime();
    }, 60000); // Обновляем каждую минуту

    // Обновляем при закрытии вкладки
    const handleBeforeUnload = () => {
      updateSessionTime();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);

  const register = (userData: { name: string; email: string; phone: string; gender: 'male' | 'female'; birthDate: string; avatar: string }) => {
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      gender: userData.gender,
      birthDate: userData.birthDate,
      avatar: userData.avatar,
      interests: [],
      status: '',
      registeredAt: Date.now(),
      lastActiveAt: Date.now(),
      stats: {
        totalSessions: 1,
        totalTimeSpent: 0,
        sectionsVisited: {
          home: 0,
          news: 0,
          support: 0,
          profile: 1
        },
        featuresUsed: {
          importantNumbers: 0,
          schedule: 0,
          donation: 0,
          workSchedule: 0,
          pvz: 0,
          notifications: 0
        },
        daysActive: 1
      }
    };

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    startSession();
  };

  const logout = () => {
    if (user) {
      updateSessionTime();
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateProfile = (updates: Partial<Pick<UserProfile, 'name' | 'email' | 'phone' | 'avatar' | 'gender' | 'birthDate'>>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const trackSectionVisit = (section: keyof UserProfile['stats']['sectionsVisited']) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      stats: {
        ...user.stats,
        sectionsVisited: {
          ...user.stats.sectionsVisited,
          [section]: user.stats.sectionsVisited[section] + 1
        }
      }
    };

    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const trackFeatureUse = (feature: keyof UserProfile['stats']['featuresUsed']) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      stats: {
        ...user.stats,
        featuresUsed: {
          ...user.stats.featuresUsed,
          [feature]: user.stats.featuresUsed[feature] + 1
        }
      }
    };

    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const startSession = () => {
    localStorage.setItem(SESSION_KEY, Date.now().toString());
  };

  const updateSessionTime = () => {
    if (!user) return;

    const sessionStart = localStorage.getItem(SESSION_KEY);
    if (!sessionStart) return;

    const sessionDuration = Math.floor((Date.now() - parseInt(sessionStart)) / 60000); // в минутах
    
    const updatedUser = {
      ...user,
      stats: {
        ...user.stats,
        totalTimeSpent: user.stats.totalTimeSpent + sessionDuration
      }
    };

    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    
    // Обновляем начало сессии
    localStorage.setItem(SESSION_KEY, Date.now().toString());
  };

  const updateLastActive = (profile: UserProfile) => {
    const today = new Date().toDateString();
    const lastActiveDay = new Date(profile.lastActiveAt).toDateString();
    
    let updatedProfile = {
      ...profile,
      lastActiveAt: Date.now(),
      stats: {
        ...profile.stats,
        totalSessions: profile.stats.totalSessions + 1
      }
    };

    // Если пользователь активен в новый день
    if (today !== lastActiveDay) {
      updatedProfile.stats.daysActive += 1;
    }

    setUser(updatedProfile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
  };

  const getDaysWithUs = () => {
    if (!user) return 0;
    return Math.floor((Date.now() - user.registeredAt) / (1000 * 60 * 60 * 24));
  };

  const getFormattedTimeSpent = () => {
    if (!user) return '0 мин';
    const minutes = user.stats.totalTimeSpent;
    if (minutes < 60) return `${minutes} мин`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} ч ${remainingMinutes} мин`;
  };

  const updateUser = (updatedUser: UserProfile) => {
    try {
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    isLoading,
    register,
    logout,
    updateProfile,
    updateUser,
    trackSectionVisit,
    trackFeatureUse,
    getDaysWithUs,
    getFormattedTimeSpent,
    isLoggedIn: !!user
  };
};