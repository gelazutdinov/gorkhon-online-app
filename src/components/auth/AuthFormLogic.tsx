import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getAutoFillCredentials, saveCredentials } from '@/utils/rememberMe';

export const useAuthForm = () => {
  const { register, login } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [forceUpdate, setForceUpdate] = useState(0);

  // Инициализация состояния на основе сохраненных данных
  const [rememberMe, setRememberMe] = useState(() => {
    const credentials = getAutoFillCredentials();
    return credentials.rememberMe;
  });

  const [formData, setFormData] = useState(() => {
    const credentials = getAutoFillCredentials();
    
    return {
      name: '',
      email: credentials.email,
      password: credentials.password,
      birthDate: '',
      gender: 'male' as 'male' | 'female'
    };
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  // Автозаполнение при переключении режимов
  useEffect(() => {
    console.log('🔄 useEffect сработал при переключении режима:', { isLoginMode });
    
    if (isLoginMode) {
      // Проверяем localStorage напрямую для отладки
      const directEmail = localStorage.getItem('savedEmail');
      const directPassword = localStorage.getItem('savedPassword');
      const directRemember = localStorage.getItem('rememberMe') === 'true';
      
      console.log('🔍 Прямая проверка localStorage при переключении:', {
        directEmail,
        directPassword: directPassword ? '***' : 'пусто',
        directRemember
      });
      
      // Используем функцию
      const credentials = getAutoFillCredentials();
      console.log('📥 Данные через getAutoFillCredentials:', {
        email: credentials.email,
        password: credentials.password ? '***' : 'пусто',
        rememberMe: credentials.rememberMe
      });
      
      // Заполняем форму если есть данные
      if (credentials.email && credentials.password) {
        setFormData(prev => ({
          ...prev,
          email: credentials.email,
          password: credentials.password
        }));
        setRememberMe(credentials.rememberMe);
        console.log('✅ Поля автозаполнены при переключении на вход');
      } else {
        console.log('❌ Нет данных для автозаполнения');
      }
    }
  }, [isLoginMode]);

  // Принудительная перезагрузка данных при монтировании компонента
  useEffect(() => {
    const credentials = getAutoFillCredentials();
    console.log('🚀 Инициализация компонента:', credentials);
    
    if (credentials.email || credentials.password) {
      setFormData(prev => ({
        ...prev,
        email: credentials.email,
        password: credentials.password
      }));
      setRememberMe(credentials.rememberMe);
    }
  }, []);

  const validateForm = () => {
    if (!formData.email.trim()) return 'Введите email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Некорректный email';
    if (!formData.password.trim()) return 'Введите пароль';
    if (formData.password.length < 6) return 'Пароль должен содержать минимум 6 символов';

    if (!isLoginMode) {
      if (!formData.name.trim()) return 'Введите имя';
      if (!formData.birthDate) return 'Выберите дату рождения';
      if (!acceptedTerms) return 'Примите условия использования';
      if (!acceptedPrivacy) return 'Примите политику конфиденциальности';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      if (isLoginMode) {
        const result = await login({
          email: formData.email,
          password: formData.password,
          rememberMe: rememberMe
        });

        if (result.success) {
          // Сохраняем данные через новую систему
          saveCredentials(formData.email, formData.password, rememberMe);
          
          // ДУБЛИРУЕМ сохранение напрямую в localStorage для надежности
          if (rememberMe) {
            localStorage.setItem('savedEmail', formData.email);
            localStorage.setItem('savedPassword', formData.password);  
            localStorage.setItem('rememberMe', 'true');
            console.log('💾 ДУБЛИРОВАННОЕ сохранение:', {
              email: formData.email,
              password: '***',
              success: true
            });
          }
          
          setSuccess('Добро пожаловать!');
        } else {
          setError(result.error || 'Ошибка входа');
        }
      } else {
        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          birthDate: formData.birthDate,
          gender: formData.gender
        });

        if (result.success) {
          console.log('🎉 Регистрация прошла успешно! Сохраняю данные для автозаполнения...');
          
          // ПРИНУДИТЕЛЬНОЕ сохранение данных для автозаполнения после регистрации
          localStorage.setItem('savedEmail', formData.email);
          localStorage.setItem('savedPassword', formData.password);  
          localStorage.setItem('rememberMe', 'true');
          
          // Также через функцию для совместимости
          saveCredentials(formData.email, formData.password, true);
          
          // ПРОВЕРИМ что данные действительно сохранились
          const checkEmail = localStorage.getItem('savedEmail');
          const checkPassword = localStorage.getItem('savedPassword');
          console.log('🔍 Проверка сохранения после регистрации:', {
            savedEmail: checkEmail,
            savedPassword: checkPassword ? '***' : 'НЕ СОХРАНЕН',
            success: !!(checkEmail && checkPassword)
          });
          
          setSuccess('Регистрация успешна! Данные сохранены для входа!');
        } else {
          setError(result.error || 'Ошибка регистрации');
        }
      }
    } catch (error) {
      setError('Произошла неожиданная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return {
    isLoginMode,
    setIsLoginMode,
    isLoading,
    error,
    setError,
    success,
    setSuccess,
    formData,
    setFormData,
    rememberMe,
    setRememberMe,
    acceptedTerms,
    setAcceptedTerms,
    acceptedPrivacy,
    setAcceptedPrivacy,
    forceUpdate,
    setForceUpdate,
    handleSubmit,
    handleInputChange
  };
};