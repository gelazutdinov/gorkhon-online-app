import { Link } from 'react-router-dom';

interface FormFieldsProps {
  isLoginMode: boolean;
  formData: {
    name: string;
    email: string;
    password: string;
    birthDate: string;
    gender: 'male' | 'female';
  };
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  handleInputChange: (field: string, value: string) => void;
  setAcceptedTerms: React.Dispatch<React.SetStateAction<boolean>>;
  setAcceptedPrivacy: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormFields = ({
  isLoginMode,
  formData,
  acceptedTerms,
  acceptedPrivacy,
  handleInputChange,
  setAcceptedTerms,
  setAcceptedPrivacy
}: FormFieldsProps) => {
  return (
    <>
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
    </>
  );
};

export default FormFields;