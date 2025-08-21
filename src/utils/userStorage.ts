import { UserProfile, UserRegistrationData, UserSearchFilters, DatabaseStats } from '@/types/user';

class UserStorage {
  private readonly STORAGE_KEY = 'gorkhon_users_db';
  private readonly CURRENT_USER_KEY = 'gorkhon_current_user';

  // Получить всех пользователей
  getAllUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Ошибка при получении пользователей:', error);
      return [];
    }
  }

  // Сохранить всех пользователей
  private saveAllUsers(users: UserProfile[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Ошибка при сохранении пользователей:', error);
    }
  }

  // Генерация уникального ID
  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Хэширование пароля (простая реализация для демо)
  private hashPassword(password: string): string {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Конвертация в 32-битное целое
    }
    return hash.toString(36);
  }

  // Создать нового пользователя
  createUser(data: UserRegistrationData): UserProfile | null {
    try {
      const users = this.getAllUsers();
      
      // Проверка на существующий email
      const existingUser = users.find(user => user.email === data.email);
      if (existingUser) {
        throw new Error('Пользователь с таким email уже существует');
      }

      const now = new Date().toISOString();
      const newUser: UserProfile = {
        id: this.generateId(),
        email: data.email,
        password: this.hashPassword(data.password),
        name: data.name,
        middleName: data.middleName,
        lastName: data.lastName,
        phone: data.phone,
        birthDate: data.birthDate,
        isVerified: false,
        bio: 'Участник Горхон.Online',
        
        settings: {
          analytics: true,
          autoSave: true,
          animations: true,
          sounds: false,
          verification: false
        },
        
        createdAt: now,
        updatedAt: now,
        loginCount: 0,
        daysWithUs: 0,
        timeSpent: 0,
        
        status: 'active',
        role: 'user'
      };

      users.push(newUser);
      this.saveAllUsers(users);
      
      return newUser;
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
      return null;
    }
  }

  // Найти пользователя по ID
  getUserById(id: string): UserProfile | null {
    const users = this.getAllUsers();
    return users.find(user => user.id === id) || null;
  }

  // Найти пользователя по email
  getUserByEmail(email: string): UserProfile | null {
    const users = this.getAllUsers();
    return users.find(user => user.email === email) || null;
  }

  // Авторизация пользователя
  authenticateUser(email: string, password: string): UserProfile | null {
    try {
      const user = this.getUserByEmail(email);
      if (!user) return null;

      const hashedPassword = this.hashPassword(password);
      if (user.password !== hashedPassword) return null;

      // Обновляем статистику входа
      user.loginCount += 1;
      user.lastLoginAt = new Date().toISOString();
      user.updatedAt = new Date().toISOString();
      
      // Обновляем дни с нами
      const daysSinceRegistration = Math.floor(
        (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      user.daysWithUs = daysSinceRegistration;

      this.updateUser(user.id, user);
      this.setCurrentUser(user);

      return { ...user, password: undefined }; // Не возвращаем пароль
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
      return null;
    }
  }

  // Обновить данные пользователя
  updateUser(id: string, updates: Partial<UserProfile>): UserProfile | null {
    try {
      const users = this.getAllUsers();
      const userIndex = users.findIndex(user => user.id === id);
      
      if (userIndex === -1) return null;

      const updatedUser = {
        ...users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      users[userIndex] = updatedUser;
      this.saveAllUsers(users);

      // Если это текущий пользователь, обновляем и его данные
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === id) {
        this.setCurrentUser(updatedUser);
      }

      return updatedUser;
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error);
      return null;
    }
  }

  // Удалить пользователя
  deleteUser(id: string): boolean {
    try {
      const users = this.getAllUsers();
      const filteredUsers = users.filter(user => user.id !== id);
      
      if (users.length === filteredUsers.length) return false; // Пользователь не найден

      this.saveAllUsers(filteredUsers);
      
      // Если удаляем текущего пользователя
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === id) {
        this.removeCurrentUser();
      }

      return true;
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      return false;
    }
  }

  // Поиск пользователей с фильтрами
  searchUsers(filters: UserSearchFilters = {}): UserProfile[] {
    let users = this.getAllUsers();

    if (filters.status) {
      users = users.filter(user => user.status === filters.status);
    }

    if (filters.role) {
      users = users.filter(user => user.role === filters.role);
    }

    if (filters.isVerified !== undefined) {
      users = users.filter(user => user.isVerified === filters.isVerified);
    }

    if (filters.createdAfter) {
      users = users.filter(user => user.createdAt >= filters.createdAfter!);
    }

    if (filters.createdBefore) {
      users = users.filter(user => user.createdAt <= filters.createdBefore!);
    }

    return users.map(user => ({ ...user, password: undefined })); // Не возвращаем пароли
  }

  // Получить статистику базы данных
  getDatabaseStats(): DatabaseStats {
    const users = this.getAllUsers();
    const today = new Date().toDateString();

    return {
      totalUsers: users.length,
      activeUsers: users.filter(user => user.status === 'active').length,
      newUsersToday: users.filter(user => 
        new Date(user.createdAt).toDateString() === today
      ).length,
      verifiedUsers: users.filter(user => user.isVerified).length,
      bannedUsers: users.filter(user => user.status === 'banned').length
    };
  }

  // Работа с текущим пользователем
  setCurrentUser(user: UserProfile): void {
    try {
      const userWithoutPassword = { ...user, password: undefined };
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error('Ошибка при сохранении текущего пользователя:', error);
    }
  }

  getCurrentUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(this.CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Ошибка при получении текущего пользователя:', error);
      return null;
    }
  }

  removeCurrentUser(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // Очистить всю базу данных (для разработки)
  clearDatabase(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // Экспорт данных
  exportUsers(): string {
    const users = this.getAllUsers().map(user => ({ ...user, password: undefined }));
    return JSON.stringify(users, null, 2);
  }

  // Импорт данных
  importUsers(jsonData: string): boolean {
    try {
      const users = JSON.parse(jsonData) as UserProfile[];
      
      // Валидация данных
      if (!Array.isArray(users)) {
        throw new Error('Данные должны быть массивом');
      }

      // Проверяем, что каждый элемент имеет нужные поля
      for (const user of users) {
        if (!user.id || !user.email || !user.name) {
          throw new Error('Некорректные данные пользователя');
        }
      }

      this.saveAllUsers(users);
      return true;
    } catch (error) {
      console.error('Ошибка при импорте данных:', error);
      return false;
    }
  }
}

// Экспортируем единственный экземпляр
export const userStorage = new UserStorage();