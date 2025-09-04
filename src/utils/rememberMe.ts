// Утилиты для функции "Запомнить меня"

export interface SavedCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Сохранить данные для автозаполнения
export const saveCredentials = (email: string, password: string, remember: boolean = true) => {
  try {
    if (remember) {
      localStorage.setItem('savedEmail', email);
      localStorage.setItem('savedPassword', password);
      localStorage.setItem('rememberMe', 'true');
      // Данные сохранены успешно
    } else {
      clearCredentials();
    }
  } catch (error) {
    // Silently handle localStorage errors
  }
};

// Загрузить сохраненные данные
export const loadCredentials = (): SavedCredentials => {
  try {
    const savedEmail = localStorage.getItem('savedEmail') || '';
    const savedPassword = localStorage.getItem('savedPassword') || '';
    const rememberMe = localStorage.getItem('rememberMe') === 'true';

    // Данные загружены успешно

    return {
      email: savedEmail,
      password: savedPassword,
      rememberMe
    };
  } catch (error) {
    // Silently handle localStorage errors
    return {
      email: '',
      password: '',
      rememberMe: false
    };
  }
};

// Очистить сохраненные данные
export const clearCredentials = () => {
  try {
    localStorage.removeItem('savedEmail');
    localStorage.removeItem('savedPassword');
    localStorage.removeItem('rememberMe');
    // Данные очищены успешно
  } catch (error) {
    // Silently handle localStorage errors
  }
};

// Проверить, есть ли сохраненные данные
export const hasCredentials = (): boolean => {
  try {
    const email = localStorage.getItem('savedEmail');
    const password = localStorage.getItem('savedPassword');
    const remember = localStorage.getItem('rememberMe') === 'true';
    
    return !!(email && password && remember);
  } catch (error) {
    // Silently handle localStorage errors
    return false;
  }
};

// Автозаполнение из старой системы аутентификации
export const loadFallbackCredentials = (): SavedCredentials => {
  try {
    const gorkhonUsers = localStorage.getItem('gorkhon_users');
    if (gorkhonUsers) {
      const users = JSON.parse(gorkhonUsers);
      if (users.length > 0) {
        // Берем последнего зарегистрированного пользователя
        const lastUser = users[users.length - 1];
        // Данные из старой системы загружены
        
        return {
          email: lastUser.email || '',
          password: lastUser.password || '',
          rememberMe: false // Не включаем автоматически для старых данных
        };
      }
    }
  } catch (error) {
    // Silently handle fallback data loading
  }
  
  return {
    email: '',
    password: '',
    rememberMe: false
  };
};

// Универсальная функция для получения данных автозаполнения
export const getAutoFillCredentials = (): SavedCredentials => {
  // Сначала пробуем новую систему
  const newSystem = loadCredentials();
  if (newSystem.email && newSystem.password) {
    return newSystem;
  }
  
  // Если нет данных в новой системе, пробуем старую
  const fallback = loadFallbackCredentials();
  if (fallback.email && fallback.password) {
    return fallback;
  }
  
  // Если ничего нет, возвращаем пустые данные
  return {
    email: '',
    password: '',
    rememberMe: false
  };
};