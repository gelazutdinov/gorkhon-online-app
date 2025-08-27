import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Icon from '@/components/ui/icon';
import { getAutoFillCredentials, saveCredentials, clearCredentials } from '@/utils/rememberMe';

const AuthForm = () => {
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
    console.log('🔄 useEffect сработал:', { isLoginMode, rememberMe });
    
    if (isLoginMode) {
      const credentials = getAutoFillCredentials();
      console.log('📥 Загружены данные в useEffect:', credentials);
      
      if (credentials.email || credentials.password) {
        setFormData(prev => ({
          ...prev,
          email: credentials.email,
          password: credentials.password
        }));
        setRememberMe(credentials.rememberMe);
        console.log('✅ Форма обновлена в useEffect');
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
          // Автоматически сохраняем данные после регистрации
          saveCredentials(formData.email, formData.password, true);
          setSuccess('Регистрация успешна! Добро пожаловать!');
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

  return (
    <div key={forceUpdate} className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Отладочная панель - только для разработки */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs">
        <strong>🔧 Отладка "Запомнить меня":</strong>
        <div className="mt-1 space-y-1">
          <div>savedEmail: {localStorage.getItem('savedEmail') || 'не найден'}</div>
          <div>savedPassword: {localStorage.getItem('savedPassword') ? '***' : 'не найден'}</div>
          <div>rememberMe: {localStorage.getItem('rememberMe') || 'не найден'}</div>
          <div>formData.email: {formData.email || 'пустое'}</div>
          <div>formData.password: {formData.password ? '***' : 'пустое'}</div>
          <div>rememberMe state: {rememberMe.toString()}</div>
        </div>
        <div className="flex gap-1 mt-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              const credentials = getAutoFillCredentials();
              console.log('📊 Все данные:', {
                localStorage: {
                  savedEmail: localStorage.getItem('savedEmail'),
                  savedPassword: localStorage.getItem('savedPassword'),
                  rememberMe: localStorage.getItem('rememberMe')
                },
                credentials,
                formData,
                rememberMeState: rememberMe
              });
            }}
            className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
          >
            Лог
          </button>
          <button
            type="button"
            onClick={() => {
              console.log('🧪 ТЕСТ: Сохраняем данные...');
              saveCredentials('test@example.com', 'test123', true);
              
              console.log('📊 После сохранения localStorage:', {
                email: localStorage.getItem('savedEmail'),
                password: localStorage.getItem('savedPassword'),
                rememberMe: localStorage.getItem('rememberMe')
              });
              
              const newCredentials = getAutoFillCredentials();
              console.log('📥 Загружены данные:', newCredentials);
              
              setFormData(prev => {
                console.log('🔄 Обновляем formData с:', prev, 'на:', {
                  ...prev,
                  email: newCredentials.email,
                  password: newCredentials.password
                });
                
                return {
                  ...prev,
                  email: newCredentials.email,
                  password: newCredentials.password
                };
              });
              
              setRememberMe(newCredentials.rememberMe);
              setForceUpdate(prev => prev + 1);
              console.log('✅ Тест завершен');
            }}
            className="px-2 py-1 bg-green-500 text-white text-xs rounded"
          >
            Тест
          </button>
          <button
            type="button"
            onClick={() => {
              const credentials = getAutoFillCredentials();
              console.log('🔄 Принудительная загрузка:', credentials);
              
              setFormData(prev => ({
                ...prev,
                email: credentials.email,
                password: credentials.password
              }));
              setRememberMe(credentials.rememberMe);
              setForceUpdate(prev => prev + 1);
            }}
            className="px-2 py-1 bg-orange-500 text-white text-xs rounded"
          >
            Загрузить
          </button>
          <button
            type="button"
            onClick={() => {
              clearCredentials();
              setFormData(prev => ({
                ...prev,
                email: '',
                password: ''
              }));
              setRememberMe(false);
            }}
            className="px-2 py-1 bg-red-500 text-white text-xs rounded"
          >
            Очистить
          </button>
          <button
            type="button"
            onClick={() => {
              console.log('🔄 Перезагрузка для проверки сохранения...');
              window.location.reload();
            }}
            className="px-2 py-1 bg-purple-500 text-white text-xs rounded"
          >
            Перезагрузить
          </button>
        </div>
        
        {/* Информация о текущем состоянии */}
        <div className="mt-2 text-xs text-gray-600">
          <div>🔍 <strong>Ожидаемое поведение:</strong></div>
          <div>1. Нажми "Тест" → поля заполнятся</div>
          <div>2. Нажми "Перезагрузить" → поля должны остаться заполненными</div>
          <div>3. Или войди реально с галочкой "Запомнить меня"</div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {isLoginMode ? 'Вход в профиль' : 'Создание профиля'}
        </h2>
        <p className="text-gray-600 mt-2">
          {isLoginMode ? 'Войдите в свой аккаунт' : 'Зарегистрируйтесь для использования всех возможностей'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
            {formData.email && (
              <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                ✓ Сохранено
              </span>
            )}
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formData.email ? 'border-green-300 bg-green-50/30' : 'border-gray-300'
            }`}
            placeholder="your@email.com"
            required
          />
        </div>

        {/* Пароль */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Пароль <span className="text-red-500">*</span>
            {formData.password && (
              <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                ✓ Сохранено
              </span>
            )}
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formData.password ? 'border-green-300 bg-green-50/30' : 'border-gray-300'
            }`}
            placeholder="Минимум 6 символов"
            required
          />
        </div>

        {/* Поля только для регистрации */}
        {!isLoginMode && (
          <>
            {/* Имя */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ваше имя"
                required
              />
            </div>



            {/* Дата рождения */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата рождения <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Пол */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Пол</label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-2xl mr-2">👨</span>
                  <span>Мужской</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-2xl mr-2">👩</span>
                  <span>Женский</span>
                </label>
              </div>
            </div>

            {/* Чекбоксы согласия */}
            <div className="space-y-2">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mr-2 mt-1"
                  required
                />
                <span className="text-sm text-gray-600">
                  Я принимаю{' '}
                  <Link to="/terms" className="text-blue-600 hover:underline">
                    условия использования
                  </Link>
                </span>
              </label>

              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedPrivacy}
                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                  className="mr-2 mt-1"
                  required
                />
                <span className="text-sm text-gray-600">
                  Я согласен с{' '}
                  <Link to="/privacy" className="text-blue-600 hover:underline">
                    политикой конфиденциальности
                  </Link>
                </span>
              </label>
            </div>
          </>
        )}

        {/* Чекбокс "Запомнить меня" только для входа */}
        {isLoginMode && (
          <>
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Запомнить меня</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                onClick={() => {
                  // Очистить сохраненные данные
                  localStorage.removeItem('savedEmail');
                  localStorage.removeItem('savedPassword');
                  localStorage.removeItem('rememberMe');
                  setFormData(prev => ({
                    ...prev,
                    email: '',
                    password: ''
                  }));
                  setRememberMe(false);
                }}
              >
                Очистить данные
              </button>
            </div>
            
            {/* Информация о функции "Запомнить меня" */}
            {rememberMe && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Icon name="Info" className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-700">
                    <strong>Запоминание данных включено.</strong>
                    <br />
                    Ваши email и пароль будут автоматически заполняться при следующем входе. 
                    Данные хранятся только в вашем браузере и не передаются на сервер.
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Ошибки и успех */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <Icon name="AlertCircle" className="w-4 h-4 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <Icon name="CheckCircle" className="w-4 h-4 text-green-500" />
            <span className="text-green-700 text-sm">{success}</span>
          </div>
        )}

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Icon name="Loader2" className="w-4 h-4 animate-spin" />
              {isLoginMode ? 'Вход...' : 'Регистрация...'}
            </>
          ) : (
            isLoginMode ? 'Войти в профиль' : 'Создать профиль'
          )}
        </button>

        {/* Переключение режима */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError('');
              setSuccess('');
            }}
            className="text-blue-600 hover:underline text-sm"
          >
            {isLoginMode ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;