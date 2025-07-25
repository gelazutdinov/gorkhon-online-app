import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

interface RegistrationFormProps {
  onRegister: (userData: { name: string; email: string; phone: string }) => void;
}

const RegistrationForm = ({ onRegister }: RegistrationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Введите ваше имя';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else if (!/^[\+]?[0-9\-\(\)\s]+$/.test(formData.phone)) {
      newErrors.phone = 'Введите корректный номер телефона';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'Необходимо согласиться с пользовательским соглашением';
    }

    if (!acceptedPrivacy) {
      newErrors.privacy = 'Необходимо согласиться с политикой конфиденциальности';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onRegister(formData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="bg-gorkhon-pink/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <Icon name="UserPlus" size={32} className="text-gorkhon-pink" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Регистрация</h2>
        <p className="text-gray-600">Создайте личный кабинет для отслеживания активности</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Имя и фамилия
          </label>
          <div className="relative">
            <Icon name="User" size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent transition-all ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Введите ваше имя"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Icon name="Mail" size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent transition-all ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="example@mail.ru"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Номер телефона
          </label>
          <div className="relative">
            <Icon name="Phone" size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent transition-all ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+7 (XXX) XXX-XX-XX"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* Согласие с правовыми документами */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Icon name="FileText" size={16} className="text-gorkhon-blue" />
            <span>Согласие с документами</span>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => {
                  setAcceptedTerms(e.target.checked);
                  if (errors.terms) {
                    setErrors(prev => ({ ...prev, terms: '' }));
                  }
                }}
                className="w-4 h-4 text-gorkhon-pink rounded border-gray-300 focus:ring-gorkhon-pink mt-0.5"
              />
              <div className="text-sm text-gray-700">
                Я принимаю{' '}
                <Link 
                  to="/terms" 
                  target="_blank"
                  className="text-gorkhon-pink hover:underline font-medium"
                >
                  пользовательское соглашение
                </Link>
                {' '}и соглашаюсь с правилами использования портала
              </div>
            </label>
            {errors.terms && (
              <p className="text-sm text-red-600 ml-7">{errors.terms}</p>
            )}

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedPrivacy}
                onChange={(e) => {
                  setAcceptedPrivacy(e.target.checked);
                  if (errors.privacy) {
                    setErrors(prev => ({ ...prev, privacy: '' }));
                  }
                }}
                className="w-4 h-4 text-gorkhon-pink rounded border-gray-300 focus:ring-gorkhon-pink mt-0.5"
              />
              <div className="text-sm text-gray-700">
                Я согласен с{' '}
                <Link 
                  to="/privacy" 
                  target="_blank"
                  className="text-gorkhon-pink hover:underline font-medium"
                >
                  политикой конфиденциальности
                </Link>
                {' '}и обработкой персональных данных
              </div>
            </label>
            {errors.privacy && (
              <p className="text-sm text-red-600 ml-7">{errors.privacy}</p>
            )}
          </div>
          
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Icon name="Shield" size={14} className="text-blue-600 mt-0.5" />
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">Ваша безопасность важна</p>
                <p>
                  Все данные хранятся локально в браузере. 
                  Ознакомьтесь с нашей{' '}
                  <Link 
                    to="/data-protection" 
                    target="_blank"
                    className="underline hover:no-underline"
                  >
                    системой защиты информации
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!acceptedTerms || !acceptedPrivacy}
          className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200 ${
            acceptedTerms && acceptedPrivacy
              ? 'bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white hover:shadow-lg transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Icon name="Check" size={18} />
            <span>Создать личный кабинет</span>
          </div>
        </button>
      </form>

      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Зачем нужна регистрация?</p>
            <ul className="space-y-1 text-xs">
              <li>• Отслеживание времени пользования платформой</li>
              <li>• Персональная статистика активности</li>
              <li>• Уведомления о важных событиях</li>
              <li>• Сохранение ваших предпочтений</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;