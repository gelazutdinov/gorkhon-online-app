import { useState, useEffect } from 'react';
import { AdminUser, VerificationRequest } from '@/types/admin';

interface Admin {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'moderator';
  isActive: boolean;
}

const ADMIN_KEY = 'admin-session';
const ADMINS_KEY = 'admin-users';
const VERIFICATION_REQUESTS_KEY = 'verification-requests';

// Демо админы для разработки
const DEFAULT_ADMINS: Admin[] = [
  {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@poehali.dev',
    role: 'super_admin',
    isActive: true
  },
  {
    id: 'admin-2', 
    username: 'moderator',
    email: 'mod@poehali.dev',
    role: 'moderator',
    isActive: true
  }
];

// Демо пароли (в продакшене должны быть захешированы)
const ADMIN_CREDENTIALS = {
  'admin': 'admin123',
  'moderator': 'mod123'
};

export const useAdmin = () => {
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);

  useEffect(() => {
    checkAdminSession();
    initializeAdmins();
    loadVerificationRequests();
  }, []);

  const initializeAdmins = () => {
    const stored = localStorage.getItem(ADMINS_KEY);
    if (!stored) {
      localStorage.setItem(ADMINS_KEY, JSON.stringify(DEFAULT_ADMINS));
    }
  };

  const checkAdminSession = () => {
    try {
      const session = localStorage.getItem(ADMIN_KEY);
      if (session) {
        const adminData = JSON.parse(session);
        setCurrentAdmin(adminData);
      }
    } catch (error) {
      console.error('Error checking admin session:', error);
      localStorage.removeItem(ADMIN_KEY);
    }
    setIsLoading(false);
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Проверяем учетные данные
      if (!ADMIN_CREDENTIALS[username as keyof typeof ADMIN_CREDENTIALS] || 
          ADMIN_CREDENTIALS[username as keyof typeof ADMIN_CREDENTIALS] !== password) {
        return { success: false, error: 'Неверный логин или пароль' };
      }

      // Находим админа
      const admins: Admin[] = JSON.parse(localStorage.getItem(ADMINS_KEY) || '[]');
      const admin = admins.find(a => a.username === username && a.isActive);
      
      if (!admin) {
        return { success: false, error: 'Аккаунт заблокирован или не найден' };
      }

      // Создаем сессию
      const sessionData = {
        ...admin,
        loginTime: new Date().toISOString()
      };

      localStorage.setItem(ADMIN_KEY, JSON.stringify(sessionData));
      setCurrentAdmin(admin);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Ошибка входа в систему' };
    }
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_KEY);
    setCurrentAdmin(null);
  };

  const isAdmin = () => {
    return currentAdmin !== null;
  };

  const isSuperAdmin = () => {
    return currentAdmin?.role === 'super_admin';
  };

  const canManageUsers = () => {
    return currentAdmin?.role === 'super_admin';
  };

  const canManageNotifications = () => {
    return currentAdmin !== null; // Все админы могут управлять уведомлениями
  };

  const loadVerificationRequests = () => {
    try {
      const stored = localStorage.getItem(VERIFICATION_REQUESTS_KEY);
      if (stored) {
        const requests = JSON.parse(stored);
        setVerificationRequests(requests.map((r: any) => ({
          ...r,
          submittedAt: new Date(r.submittedAt),
          reviewedAt: r.reviewedAt ? new Date(r.reviewedAt) : undefined
        })));
      }
    } catch (error) {
      console.error('Error loading verification requests:', error);
    }
  };

  const saveVerificationRequests = (requests: VerificationRequest[]) => {
    try {
      localStorage.setItem(VERIFICATION_REQUESTS_KEY, JSON.stringify(requests));
      setVerificationRequests(requests);
    } catch (error) {
      console.error('Error saving verification requests:', error);
    }
  };

  const submitVerificationRequest = (request: Omit<VerificationRequest, 'id' | 'submittedAt' | 'status'>): string => {
    const newRequest: VerificationRequest = {
      ...request,
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      submittedAt: new Date(),
      status: 'pending'
    };

    const updated = [newRequest, ...verificationRequests];
    saveVerificationRequests(updated);
    return newRequest.id;
  };

  const reviewVerificationRequest = (
    requestId: string, 
    status: 'approved' | 'rejected', 
    reason?: string
  ): boolean => {
    if (!currentAdmin) return false;

    const updated = verificationRequests.map(req => 
      req.id === requestId 
        ? {
            ...req,
            status,
            reason,
            reviewedBy: currentAdmin.id,
            reviewedAt: new Date()
          }
        : req
    );

    saveVerificationRequests(updated);
    return true;
  };

  const getPendingRequests = () => {
    return verificationRequests.filter(r => r.status === 'pending');
  };

  const getRequestById = (id: string) => {
    return verificationRequests.find(r => r.id === id);
  };

  return {
    currentAdmin,
    isLoading,
    isAdmin,
    isSuperAdmin,
    canManageUsers,
    canManageNotifications,
    login,
    logout,
    verificationRequests,
    submitVerificationRequest,
    reviewVerificationRequest,
    getPendingRequests,
    getRequestById,
    refreshRequests: loadVerificationRequests
  };
};