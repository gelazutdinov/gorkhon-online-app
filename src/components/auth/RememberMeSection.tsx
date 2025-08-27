import Icon from '@/components/ui/icon';

interface RememberMeSectionProps {
  rememberMe: boolean;
  setRememberMe: React.Dispatch<React.SetStateAction<boolean>>;
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    password: string;
    birthDate: string;
    gender: 'male' | 'female';
  }>>;
}

const RememberMeSection = ({ rememberMe, setRememberMe, setFormData }: RememberMeSectionProps) => {
  return (
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
  );
};

export default RememberMeSection;