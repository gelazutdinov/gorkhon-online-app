const API_BASE_URL = 'http://localhost:3001/api';

class ApiClient {
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private removeAuthToken(): void {
    localStorage.removeItem('auth_token');
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка API');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Авторизация
  async register(userData: {
    email: string;
    password: string;
    name: string;
    middleName?: string;
    phone?: string;
    birthDate?: string;
  }) {
    try {
      const response = await this.makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response.success && response.data.token) {
        this.setAuthToken(response.data.token);
        return {
          success: true,
          user: response.data.user,
        };
      }

      return {
        success: false,
        error: response.error || 'Ошибка регистрации',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Ошибка регистрации',
      };
    }
  }

  async login(credentials: { email: string; password: string }) {
    try {
      const response = await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.success && response.data.token) {
        this.setAuthToken(response.data.token);
        return {
          success: true,
          user: response.data.user,
        };
      }

      return {
        success: false,
        error: response.error || 'Ошибка входа',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Ошибка входа',
      };
    }
  }

  async logout() {
    try {
      await this.makeRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      // Silently handle logout error
    } finally {
      this.removeAuthToken();
      return { success: true };
    }
  }

  async getCurrentUser() {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { success: false, user: null };
      }

      const response = await this.makeRequest('/auth/me');

      if (response.success) {
        return {
          success: true,
          user: response.data.user,
        };
      }

      return {
        success: false,
        user: null,
      };
    } catch (error: any) {
      // Если токен недействителен, удаляем его
      if (error.message.includes('токен') || error.message.includes('авторизации')) {
        this.removeAuthToken();
      }
      return {
        success: false,
        user: null,
        error: error.message,
      };
    }
  }

  // Профиль пользователя
  async updateProfile(updates: any) {
    try {
      const response = await this.makeRequest('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      if (response.success) {
        return {
          success: true,
          user: response.data.user,
        };
      }

      return {
        success: false,
        error: response.error || 'Ошибка обновления профиля',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Ошибка обновления профиля',
      };
    }
  }

  async changePassword(currentPassword: string, newPassword: string) {
    try {
      const response = await this.makeRequest('/users/password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      return {
        success: response.success,
        error: response.error,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Ошибка смены пароля',
      };
    }
  }

  // Админ функции
  async getAllUsers() {
    try {
      const response = await this.makeRequest('/admin/users');
      return {
        success: true,
        users: response.data.users,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Ошибка получения пользователей',
      };
    }
  }

  async getStats() {
    try {
      const response = await this.makeRequest('/admin/stats');
      return {
        success: true,
        stats: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Ошибка получения статистики',
      };
    }
  }

  async updateUserStatus(userId: string, status: string) {
    try {
      const response = await this.makeRequest(`/admin/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });

      return {
        success: response.success,
        user: response.data?.user,
        error: response.error,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Ошибка изменения статуса',
      };
    }
  }

  async verifyUser(userId: string, isVerified: boolean) {
    try {
      const response = await this.makeRequest(`/admin/users/${userId}/verify`, {
        method: 'PUT',
        body: JSON.stringify({ isVerified }),
      });

      return {
        success: response.success,
        user: response.data?.user,
        error: response.error,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Ошибка верификации',
      };
    }
  }

  async deleteUser(userId: string) {
    try {
      const response = await this.makeRequest(`/admin/users/${userId}`, {
        method: 'DELETE',
      });

      return {
        success: response.success,
        error: response.error,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Ошибка удаления пользователя',
      };
    }
  }

  // Проверка подключения к серверу
  async checkServerConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const apiClient = new ApiClient();