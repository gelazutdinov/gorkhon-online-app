import Icon from '@/components/ui/icon';
import FormFields from '@/components/auth/FormFields';
import RememberMeSection from '@/components/auth/RememberMeSection';
import { useAuthForm } from '@/components/auth/AuthFormLogic';

const AuthForm = () => {
  const {
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
  } = useAuthForm();

  return (
    <div key={forceUpdate} className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {isLoginMode ? 'Вход в профиль' : 'Создание профиля'}
        </h2>
        <p className="text-gray-600 mt-2">
          {isLoginMode ? 'Войдите в свой аккаунт' : 'Зарегистрируйтесь для использования всех возможностей'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormFields
          isLoginMode={isLoginMode}
          formData={formData}
          acceptedTerms={acceptedTerms}
          acceptedPrivacy={acceptedPrivacy}
          handleInputChange={handleInputChange}
          setAcceptedTerms={setAcceptedTerms}
          setAcceptedPrivacy={setAcceptedPrivacy}
        />

        {/* Чекбокс "Запомнить меня" только для входа */}
        {isLoginMode && (
          <RememberMeSection
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            setFormData={setFormData}
          />
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