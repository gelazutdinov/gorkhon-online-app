import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/services/apiClient';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  middleName?: string;
  phone?: string;
  birthDate?: string;
  avatar?: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  loginCount: number;
}

export interface UserRegistrationData {
  email: string;
  password: string;
  name: string;
  middleName?: string;
  phone?: string;
  birthDate?: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем пользователя при инициализации
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const result = await apiClient.getCurrentUser();
        if (result.success && result.user) {
          setUser(result.user);
        }
      } catch (error) {
        console.error('Load user error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  // Регистрация
  const register = useCallback(async (data: UserRegistrationData) => {
    try {
      const result = await apiClient.register(data);
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Произошла ошибка при регистрации' };
    }
  }, []);

  // Вход в систему
  const login = useCallback(async (data: UserLoginData) => {
    try {
      const result = await apiClient.login(data);
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Произошла ошибка при входе' };
    }
  }, []);

  // Выход из системы
  const logout = useCallback(async () => {
    try {
      await apiClient.logout();
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Произошла ошибка при выходе' };
    }
  }, []);

  // Обновление профиля
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return { success: false, error: 'Пользователь не авторизован' };

    try {
      const result = await apiClient.updateProfile(updates);
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Произошла ошибка при обновлении профиля' };
    }
  }, [user]);

  // Изменение пароля
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) return { success: false, error: 'Пользователь не авторизован' };

    try {
      const result = await apiClient.changePassword(currentPassword, newPassword);
      return result;
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'Произошла ошибка при смене пароля' };
    }
  }, [user]);

  // Проверяем, является ли пользователь администратором
  const isAdmin = user?.email === 'smm@gelazutdinov.ru' || user?.role === 'admin';

  return {
    user,
    isLoading,
    isLoggedIn: !!user,
    isAdmin,
    register,
    login,
    logout,
    updateProfile,
    changePassword
  };
};