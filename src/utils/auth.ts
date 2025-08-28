export interface UserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
}

export interface LoginData {
  email: string;
  password: string;
}

const USERS_KEY = 'gorkhon_users';
const CURRENT_USER_KEY = 'gorkhon_current_user';

// Получить всех пользователей из localStorage
export const getAllUsers = (): UserData[] => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    return [];
  }
};

// Сохранить пользователей в localStorage
export const saveUsers = (users: UserData[]): void => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Ошибка при сохранении пользователей:', error);
  }
};

// Проверить, существует ли пользователь с таким email
export const userExists = (email: string): boolean => {
  const users = getAllUsers();
  return users.some(user => user.email.toLowerCase() === email.toLowerCase());
};

// Зарегистрировать нового пользователя
export const registerUser = (userData: UserData): { success: boolean; message: string } => {
  try {
    // Проверяем, не существует ли уже пользователь
    if (userExists(userData.email)) {
      return { success: false, message: 'Пользователь с таким email уже существует' };
    }

    // Получаем текущих пользователей
    const users = getAllUsers();
    
    // Добавляем нового пользователя
    users.push(userData);
    
    // Сохраняем в localStorage
    saveUsers(users);
    
    // Автоматически логиним пользователя после регистрации
    setCurrentUser({ email: userData.email, firstName: userData.firstName, lastName: userData.lastName });
    
    return { success: true, message: 'Регистрация прошла успешно!' };
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    return { success: false, message: 'Произошла ошибка при регистрации' };
  }
};

// Войти в аккаунт
export const loginUser = (loginData: LoginData & { rememberMe?: boolean }): { success: boolean; message: string; user?: UserData } => {
  try {
    const users = getAllUsers();
    const user = users.find(u => 
      u.email.toLowerCase() === loginData.email.toLowerCase() && 
      u.password === loginData.password
    );

    if (user) {
      // Сохраняем информацию о текущем пользователе
      setCurrentUser({ 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName 
      });
      
      // Сохраняем данные для автозаполнения, если включено "Запомнить меня"
      if (loginData.rememberMe) {
        localStorage.setItem('savedEmail', loginData.email);
        localStorage.setItem('savedPassword', loginData.password);
        localStorage.setItem('rememberMe', 'true');
        console.log('✅ Данные входа сохранены в utils/auth');
      } else {
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('savedPassword');  
        localStorage.removeItem('rememberMe');
        console.log('🗑️ Сохраненные данные очищены в utils/auth');
      }
      
      return { success: true, message: 'Вход выполнен успешно!', user };
    } else {
      return { success: false, message: 'Неверный email или пароль' };
    }
  } catch (error) {
    console.error('Ошибка при входе:', error);
    return { success: false, message: 'Произошла ошибка при входе' };
  }
};

// Установить текущего пользователя
export const setCurrentUser = (user: { email: string; firstName: string; lastName: string }): void => {
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Ошибка при сохранении текущего пользователя:', error);
  }
};

// Получить текущего пользователя
export const getCurrentUser = (): { email: string; firstName: string; lastName: string } | null => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Ошибка при получении текущего пользователя:', error);
    return null;
  }
};

// Выйти из аккаунта
export const logoutUser = (): void => {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error('Ошибка при выходе:', error);
  }
};

// Проверить, авторизован ли пользователь
export const isUserLoggedIn = (): boolean => {
  return getCurrentUser() !== null;
};

// Проверить, является ли пользователь администратором
export const isUserAdmin = (): boolean => {
  const currentUser = getCurrentUser();
  return currentUser?.email === 'smm@gelazutdinov.ru';
};