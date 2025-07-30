import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useAdmin } from '@/hooks/useAdmin';
import { useUser } from '@/hooks/useUser';

const VerificationForm: React.FC = () => {
  const { submitVerificationRequest } = useAdmin();
  const { user } = useUser();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    documents: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Необходимо войти в систему');
      return;
    }

    if (!formData.fullName.trim()) {
      alert('Заполните обязательные поля');
      return;
    }

    submitVerificationRequest({
      userId: user.id,
      username: user.username,
      email: user.email,
      fullName: formData.fullName.trim(),
      documents: formData.documents
    });

    setIsSubmitted(true);
  };

  const handleAddDocument = () => {
    const url = prompt('Введите URL документа:');
    if (url && url.trim()) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, url.trim()]
      }));
    }
  };

  const handleRemoveDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Check" size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Заявка отправлена!</h2>
        <p className="text-gray-600 mb-4">
          Ваша заявка на верификацию отправлена на рассмотрение. 
          Мы уведомим вас о результате в течение 24 часов.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
          <Icon name="Clock" size={16} />
          <span>Ожидает рассмотрения</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Icon name="UserCheck" size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Заявка на верификацию</h2>
          <p className="text-sm text-gray-600">Получите галочку подтверждения аккаунта</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Полное имя *
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink/20 focus:border-gorkhon-pink"
            placeholder="Введите ваше полное имя"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Документы (необязательно)
          </label>
          <div className="space-y-2">
            {formData.documents.map((doc, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <Icon name="FileText" size={16} className="text-blue-500" />
                <span className="text-sm text-gray-700 flex-1">Документ {index + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveDocument(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddDocument}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gorkhon-pink hover:text-gorkhon-pink transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="Plus" size={16} />
              Добавить документ
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          <div className="flex items-start gap-2">
            <Icon name="Info" size={16} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-1">Что дает верификация?</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Галочка подтверждения профиля</li>
                <li>• Повышенное доверие пользователей</li>
                <li>• Приоритетная поддержка</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-gorkhon-pink to-gorkhon-blue text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Отправить заявку
        </button>
      </form>
    </div>
  );
};

export default VerificationForm;