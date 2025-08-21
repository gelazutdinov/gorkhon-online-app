import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/services/userService';
import { UserProfile, UserRegistrationData, UserLoginData } from '@/types/user';

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем пользователя при инициализации
  useEffect(() => {
    const loadCurrentUser = () => {
      const currentUser = userService.getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };

    loadCurrentUser();
  }, []);

  // Регистрация
  const register = useCallback(async (data: UserRegistrationData) => {
    try {
      const result = await userService.register(data);
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
      const result = await userService.login(data);
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
      await userService.logout();
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
      const result = await userService.updateProfile(user.id, updates);
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
      const result = await userService.changePassword(user.id, currentPassword, newPassword);
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