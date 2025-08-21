export interface UserProfile {
  id: string;
  email: string;
  password?: string; // Хранится в зашифрованном виде
  name: string;
  middleName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  birthDate?: string;
  location?: string;
  website?: string;
  isVerified: boolean;
  
  // Настройки приватности
  settings: {
    analytics: boolean;
    autoSave: boolean;
    animations: boolean;
    sounds: boolean;
    verification: boolean;
  };
  
  // Метаданные
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  loginCount: number;
  
  // Статистика
  daysWithUs: number;
  timeSpent: number; // в минутах
  
  // Статус аккаунта
  status: 'active' | 'inactive' | 'banned' | 'pending';
  role: 'user' | 'admin' | 'moderator';
}

export interface UserRegistrationData {
  email: string;
  password: string;
  name: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: string;
}

export interface UserLoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface UserUpdateData {
  name?: string;
  middleName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  birthDate?: string;
  location?: string;
  website?: string;
}

export interface UserSearchFilters {
  status?: UserProfile['status'];
  role?: UserProfile['role'];
  isVerified?: boolean;
  createdAfter?: string;
  createdBefore?: string;
}

export interface DatabaseStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  verifiedUsers: number;
  bannedUsers: number;
}