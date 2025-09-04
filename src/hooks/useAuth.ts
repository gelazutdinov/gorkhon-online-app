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
  gender?: 'male' | 'female';
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
        // Проверяем localStorage вместо сервера
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        // Silently handle localStorage parsing errors
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  // Регистрация
  const register = useCallback(async (data: UserRegistrationData) => {
    try {
      // Симуляция успешной регистрации без сервера
      const mockUser: UserProfile = {
        id: 'mock-user-' + Date.now(),
        email: data.email,
        name: data.name,
        birthDate: data.birthDate,
        role: 'user',
        status: 'active',
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        loginCount: 1
      };

      // Сохраняем в localStorage
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      localStorage.setItem('registrationData', JSON.stringify(data));
      
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Произошла ошибка при регистрации' };
    }
  }, []);

  // Вход в систему
  const login = useCallback(async (data: UserLoginData & { rememberMe?: boolean }) => {
    try {
      
      // Проверяем тестовые данные первыми
      if (data.email === 'test@example.com' && data.password === 'test123') {
        
        const testUser: UserProfile = {
          id: 'test-user',
          email: 'test@example.com',
          name: 'Тестовый пользователь',
          role: 'user',
          status: 'active',
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          loginCount: 1
        };
        
        localStorage.setItem('currentUser', JSON.stringify(testUser));
        setUser(testUser);
        
        // Сохраняем данные для автозаполнения, если включено "Запомнить меня"
        if (data.rememberMe) {
          localStorage.setItem('savedEmail', data.email);
          localStorage.setItem('savedPassword', data.password);
          localStorage.setItem('rememberMe', 'true');
        }
        
        return { success: true };
      }
      
      // Проверяем данные регистрации в localStorage
      const savedData = localStorage.getItem('registrationData');
      if (savedData) {
        const regData = JSON.parse(savedData);
        
        if (regData.email === data.email && regData.password === data.password) {
          const savedUser = localStorage.getItem('currentUser');
          if (savedUser) {
            const user = JSON.parse(savedUser);
            setUser(user);
            
            // Сохраняем данные для автозаполнения, если включено "Запомнить меня"
            if (data.rememberMe) {
              localStorage.setItem('savedEmail', data.email);
              localStorage.setItem('savedPassword', data.password);
              localStorage.setItem('rememberMe', 'true');
            } else {
              localStorage.removeItem('savedEmail');
              localStorage.removeItem('savedPassword');
              localStorage.removeItem('rememberMe');
            }
            
            return { success: true };
          }
        }
      }
      
      return { success: false, error: 'Неверный email или пароль' };
    } catch (error) {
      return { success: false, error: 'Произошла ошибка при входе' };
    }
  }, []);

  // Выход из системы
  const logout = useCallback(async () => {
    try {
      // Очищаем данные пользователя
      localStorage.removeItem('currentUser');
      localStorage.removeItem('registrationData');
      localStorage.removeItem('gorkhon_current_user');
      localStorage.removeItem('gorkhon_users');
      
      // НЕ очищаем сохраненные данные входа (savedEmail, savedPassword, rememberMe)
      // если пользователь выбрал "Запомнить меня"
      
      // Сбрасываем состояние пользователя
      setUser(null);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Произошла ошибка при выходе' };
    }
  }, []);

  // Обновление профиля
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return { success: false, error: 'Пользователь не авторизован' };

    try {
      
      // Обновляем локальное состояние
      const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
      
      // Сохраняем в localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Обновляем состояние
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
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
      return { success: false, error: 'Произошла ошибка при смене пароля' };
    }
  }, [user]);

  // Проверяем, является ли пользователь администратором
  // Принудительная перезагрузка данных пользователя
  const reloadUser = useCallback(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: 'Нет сохраненных данных пользователя' };
    } catch (error) {
      return { success: false, error: 'Ошибка при перезагрузке данных' };
    }
  }, []);

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
    changePassword,
    reloadUser
  };
};