import { getAutoFillCredentials, saveCredentials, clearCredentials } from '@/utils/rememberMe';

interface DebugPanelProps {
  formData: {
    email: string;
    password: string;
    name: string;
    birthDate: string;
    gender: 'male' | 'female';
  };
  rememberMe: boolean;
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    password: string;
    birthDate: string;
    gender: 'male' | 'female';
  }>>;
  setRememberMe: React.Dispatch<React.SetStateAction<boolean>>;
  setForceUpdate: React.Dispatch<React.SetStateAction<number>>;
}

const DebugPanel = ({ formData, rememberMe, setFormData, setRememberMe, setForceUpdate }: DebugPanelProps) => {
  return (
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
  );
};

export default DebugPanel;