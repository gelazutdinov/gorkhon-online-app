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
      console.error('Registration error:', error);
      return { success: false, error: 'Произошла ошибка при регистрации' };
    }
  }, []);

  // Вход в систему
  const login = useCallback(async (data: UserLoginData & { rememberMe?: boolean }) => {
    try {
      console.log('🔐 Попытка входа с:', { email: data.email, password: '***', rememberMe: data.rememberMe });
      
      // Проверяем тестовые данные первыми
      if (data.email === 'test@example.com' && data.password === 'test123') {
        console.log('✅ Вход с тестовыми данными');
        
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
          console.log('✅ Тестовые данные входа сохранены');
        }
        
        return { success: true };
      }
      
      // Проверяем данные регистрации в localStorage
      const savedData = localStorage.getItem('registrationData');
      if (savedData) {
        const regData = JSON.parse(savedData);
        console.log('📋 Проверяем сохраненные данные регистрации:', { 
          savedEmail: regData.email, 
          inputEmail: data.email,
          match: regData.email === data.email && regData.password === data.password
        });
        
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
              console.log('✅ Данные входа сохранены в useAuth');
            } else {
              localStorage.removeItem('savedEmail');
              localStorage.removeItem('savedPassword');
              localStorage.removeItem('rememberMe');
              console.log('🗑️ Сохраненные данные очищены в useAuth');
            }
            
            return { success: true };
          }
        }
      }
      
      console.log('❌ Неверный email или пароль');
      return { success: false, error: 'Неверный email или пароль' };
    } catch (error) {
      console.error('Login error:', error);
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