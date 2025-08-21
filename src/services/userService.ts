import { userStorage } from '@/utils/userStorage';
import { UserProfile, UserRegistrationData, UserLoginData, UserUpdateData, UserSearchFilters, DatabaseStats } from '@/types/user';

export class UserService {
  // Регистрация нового пользователя
  async register(data: UserRegistrationData): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      // Валидация данных
      if (!data.email || !data.password || !data.name) {
        return { success: false, error: 'Заполните все обязательные поля' };
      }

      // Проверка формата email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return { success: false, error: 'Некорректный формат email' };
      }

      // Проверка длины пароля
      if (data.password.length < 6) {
        return { success: false, error: 'Пароль должен содержать минимум 6 символов' };
      }

      // Проверка существующего пользователя
      const existingUser = userStorage.getUserByEmail(data.email);
      if (existingUser) {
        return { success: false, error: 'Пользователь с таким email уже существует' };
      }

      // Создание пользователя
      const newUser = userStorage.createUser(data);
      if (!newUser) {
        return { success: false, error: 'Ошибка при создании пользователя' };
      }

      // Возвращаем пользователя без пароля
      const { password: _, ...userWithoutPassword } = newUser;
      return { success: true, user: userWithoutPassword as UserProfile };
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      return { success: false, error: 'Произошла ошибка при регистрации' };
    }
  }

  // Авторизация пользователя
  async login(data: UserLoginData): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      if (!data.email || !data.password) {
        return { success: false, error: 'Введите email и пароль' };
      }

      const user = userStorage.authenticateUser(data.email, data.password);
      if (!user) {
        return { success: false, error: 'Неверный email или пароль' };
      }

      if (user.status === 'banned') {
        return { success: false, error: 'Ваш аккаунт заблокирован' };
      }

      if (user.status === 'inactive') {
        return { success: false, error: 'Ваш аккаунт неактивен' };
      }

      return { success: true, user };
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      return { success: false, error: 'Произошла ошибка при входе' };
    }
  }

  // Выход из системы
  async logout(): Promise<{ success: boolean }> {
    try {
      userStorage.removeCurrentUser();
      return { success: true };
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      return { success: false };
    }
  }

  // Получить текущего пользователя
  getCurrentUser(): UserProfile | null {
    return userStorage.getCurrentUser();
  }

  // Обновить профиль пользователя
  async updateProfile(userId: string, data: UserUpdateData): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      const updatedUser = userStorage.updateUser(userId, data);
      if (!updatedUser) {
        return { success: false, error: 'Пользователь не найден' };
      }

      const { password: _, ...userWithoutPassword } = updatedUser;
      return { success: true, user: userWithoutPassword as UserProfile };
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      return { success: false, error: 'Произошла ошибка при обновлении профиля' };
    }
  }

  // Изменить пароль
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = userStorage.getUserById(userId);
      if (!user) {
        return { success: false, error: 'Пользователь не найден' };
      }

      // Проверяем текущий пароль
      const authenticatedUser = userStorage.authenticateUser(user.email, currentPassword);
      if (!authenticatedUser) {
        return { success: false, error: 'Неверный текущий пароль' };
      }

      if (newPassword.length < 6) {
        return { success: false, error: 'Новый пароль должен содержать минимум 6 символов' };
      }

      // Обновляем пароль (будет захэширован в userStorage)
      const updatedUser = userStorage.updateUser(userId, { 
        password: newPassword, 
        updatedAt: new Date().toISOString() 
      } as any);

      if (!updatedUser) {
        return { success: false, error: 'Ошибка при изменении пароля' };
      }

      return { success: true };
    } catch (error) {
      console.error('Ошибка изменения пароля:', error);
      return { success: false, error: 'Произошла ошибка при изменении пароля' };
    }
  }

  // Получить пользователя по ID
  async getUserById(id: string): Promise<UserProfile | null> {
    const user = userStorage.getUserById(id);
    if (!user) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as UserProfile;
  }

  // Поиск пользователей
  async searchUsers(filters: UserSearchFilters = {}): Promise<UserProfile[]> {
    return userStorage.searchUsers(filters);
  }

  // Получить всех пользователей (для админа)
  async getAllUsers(): Promise<UserProfile[]> {
    const users = userStorage.getAllUsers();
    return users.map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as UserProfile;
    });
  }

  // Заблокировать/разблокировать пользователя (для админа)
  async updateUserStatus(userId: string, status: UserProfile['status']): Promise<{ success: boolean; error?: string }> {
    try {
      const updatedUser = userStorage.updateUser(userId, { status });
      if (!updatedUser) {
        return { success: false, error: 'Пользователь не найден' };
      }

      return { success: true };
    } catch (error) {
      console.error('Ошибка изменения статуса:', error);
      return { success: false, error: 'Произошла ошибка при изменении статуса' };
    }
  }

  // Верификация пользователя
  async verifyUser(userId: string, verified: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      const updatedUser = userStorage.updateUser(userId, { isVerified: verified });
      if (!updatedUser) {
        return { success: false, error: 'Пользователь не найден' };
      }

      return { success: true };
    } catch (error) {
      console.error('Ошибка верификации:', error);
      return { success: false, error: 'Произошла ошибка при верификации' };
    }
  }

  // Удаление аккаунта
  async deleteAccount(userId: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = userStorage.getUserById(userId);
      if (!user) {
        return { success: false, error: 'Пользователь не найден' };
      }

      // Проверяем пароль
      const authenticatedUser = userStorage.authenticateUser(user.email, password);
      if (!authenticatedUser) {
        return { success: false, error: 'Неверный пароль' };
      }

      const deleted = userStorage.deleteUser(userId);
      if (!deleted) {
        return { success: false, error: 'Ошибка при удалении аккаунта' };
      }

      return { success: true };
    } catch (error) {
      console.error('Ошибка удаления аккаунта:', error);
      return { success: false, error: 'Произошла ошибка при удалении аккаунта' };
    }
  }

  // Статистика базы данных
  getDatabaseStats(): DatabaseStats {
    return userStorage.getDatabaseStats();
  }

  // Экспорт данных
  exportUsers(): string {
    return userStorage.exportUsers();
  }

  // Импорт данных
  async importUsers(jsonData: string): Promise<{ success: boolean; error?: string }> {
    try {
      const success = userStorage.importUsers(jsonData);
      if (!success) {
        return { success: false, error: 'Ошибка при импорте данных' };
      }

      return { success: true };
    } catch (error) {
      console.error('Ошибка импорта:', error);
      return { success: false, error: 'Произошла ошибка при импорте данных' };
    }
  }

  // Очистка базы данных (для разработки)
  clearDatabase(): void {
    userStorage.clearDatabase();
  }

  // Создать тестовых пользователей
  async createTestUsers(): Promise<void> {
    const testUsers: UserRegistrationData[] = [
      {
        email: 'admin@gorkhon.online',
        password: 'admin123',
        name: 'Администратор',
        middleName: 'Главный',
        phone: '+7 900 123-45-67'
      },
      {
        email: 'user@example.com',
        password: 'user123',
        name: 'Иван Петров',
        middleName: 'Сергеевич',
        phone: '+7 900 987-65-43',
        birthDate: '1990-01-15'
      },
      {
        email: 'maria@example.com',
        password: 'maria123',
        name: 'Мария Сидорова',
        middleName: 'Александровна',
        phone: '+7 900 555-55-55',
        birthDate: '1995-06-20'
      }
    ];

    for (const userData of testUsers) {
      const existing = userStorage.getUserByEmail(userData.email);
      if (!existing) {
        await this.register(userData);
        
        // Делаем первого пользователя админом и верифицированным
        if (userData.email === 'admin@gorkhon.online') {
          const user = userStorage.getUserByEmail(userData.email);
          if (user) {
            userStorage.updateUser(user.id, { 
              role: 'admin', 
              isVerified: true,
              settings: { ...user.settings, verification: true }
            });
          }
        }
      }
    }
  }
}

// Экспортируем единственный экземпляр
export const userService = new UserService();