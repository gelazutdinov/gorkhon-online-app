import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { VerificationFormData, VerificationRequest } from '@/types/verification';
import { UserProfile } from '@/hooks/useUser';

interface VerificationRequestProps {
  user: UserProfile;
  onClose: () => void;
  onSubmit: (request: VerificationRequest) => void;
  currentRequest?: VerificationRequest;
}

const VerificationRequestComponent = ({ 
  user, 
  onClose, 
  onSubmit, 
  currentRequest 
}: VerificationRequestProps) => {
  const [formData, setFormData] = useState<VerificationFormData>({
    fullName: currentRequest?.fullName || user.name || '',
    address: currentRequest?.address || '',
    documentType: currentRequest?.documentType || 'passport',
    documentNumber: currentRequest?.documentNumber || '',
    additionalInfo: currentRequest?.additionalInfo || ''
  });
  
  const [documentPhoto, setDocumentPhoto] = useState<string | null>(
    currentRequest?.documentPhoto || null
  );
  const [selfiePhoto, setSelfiePhoto] = useState<string | null>(
    currentRequest?.selfiePhoto || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const documentTypes = [
    { value: 'passport', label: 'Паспорт РФ' },
    { value: 'birth_certificate', label: 'Свидетельство о рождении' },
    { value: 'residence_permit', label: 'Вид на жительство' }
  ];

  const handleFileUpload = (type: 'document' | 'selfie', file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (type === 'document') {
        setDocumentPhoto(base64);
      } else {
        setSelfiePhoto(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Укажите полное имя';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Укажите адрес проживания в Горхоне';
    }

    if (!formData.documentNumber.trim()) {
      newErrors.documentNumber = 'Укажите номер документа';
    }

    if (!documentPhoto) {
      newErrors.documentPhoto = 'Загрузите фото документа';
    }

    if (!selfiePhoto) {
      newErrors.selfiePhoto = 'Загрузите селфи с документом';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const request: VerificationRequest = {
        id: currentRequest?.id || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id || 'unknown',
        userName: user.name || 'Неизвестно',
        userEmail: user.email || '',
        userPhone: user.phone || '',
        
        fullName: formData.fullName,
        address: formData.address,
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        documentPhoto,
        selfiePhoto,
        additionalInfo: formData.additionalInfo,
        
        status: 'pending',
        submittedAt: new Date().toISOString(),
        
        history: [
          ...(currentRequest?.history || []),
          {
            timestamp: new Date().toISOString(),
            action: currentRequest ? 'updated' : 'submitted'
          }
        ]
      };

      onSubmit(request);
      onClose();
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      alert('Произошла ошибка при отправке заявки');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusInfo = () => {
    if (!currentRequest) return null;

    const statusConfig = {
      pending: { 
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200', 
        icon: 'Clock', 
        text: 'На рассмотрении' 
      },
      approved: { 
        color: 'text-green-600 bg-green-50 border-green-200', 
        icon: 'CheckCircle', 
        text: 'Одобрена' 
      },
      rejected: { 
        color: 'text-red-600 bg-red-50 border-red-200', 
        icon: 'XCircle', 
        text: 'Отклонена' 
      }
    };

    const config = statusConfig[currentRequest.status];
    if (!config) return null;

    return (
      <div className={`p-4 rounded-lg border ${config.color} mb-6`}>
        <div className="flex items-center gap-2">
          <Icon name={config.icon as any} size={20} />
          <span className="font-medium">Статус заявки: {config.text}</span>
        </div>
        {currentRequest.adminComment && (
          <p className="mt-2 text-sm">
            <strong>Комментарий:</strong> {currentRequest.adminComment}
          </p>
        )}
        {currentRequest.status === 'rejected' && (
          <p className="mt-2 text-sm">
            Вы можете подать новую заявку с исправленными данными.
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-white/20">
      {/* Заголовок */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Верификация жителя Горхона
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Подтвердите, что вы являетесь жителем Лесозаводской
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon name="X" size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {getStatusInfo()}

        {/* Основная информация */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Личные данные</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Полное имя *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent ${
                errors.fullName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Фамилия Имя Отчество"
            />
            {errors.fullName && (
              <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Адрес проживания в Горхоне *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent ${
                errors.address ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="ул. Центральная, д. 1, кв. 1"
            />
            {errors.address && (
              <p className="text-red-600 text-sm mt-1">{errors.address}</p>
            )}
          </div>
        </div>

        {/* Документы */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Документы</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тип документа *
            </label>
            <select
              value={formData.documentType}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                documentType: e.target.value as any 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
            >
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Номер документа *
            </label>
            <input
              type="text"
              value={formData.documentNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, documentNumber: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent ${
                errors.documentNumber ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Серия и номер документа"
            />
            {errors.documentNumber && (
              <p className="text-red-600 text-sm mt-1">{errors.documentNumber}</p>
            )}
          </div>
        </div>

        {/* Фотографии */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Фотографии</h3>
          
          {/* Фото документа */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Фото документа *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {documentPhoto ? (
                <div className="relative">
                  <img 
                    src={documentPhoto} 
                    alt="Документ" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setDocumentPhoto(null)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block text-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('document', file);
                    }}
                  />
                  <Icon name="Upload" size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">Нажмите для загрузки фото документа</p>
                </label>
              )}
            </div>
            {errors.documentPhoto && (
              <p className="text-red-600 text-sm mt-1">{errors.documentPhoto}</p>
            )}
          </div>

          {/* Селфи */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Селфи с документом *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {selfiePhoto ? (
                <div className="relative">
                  <img 
                    src={selfiePhoto} 
                    alt="Селфи" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setSelfiePhoto(null)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block text-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('selfie', file);
                    }}
                  />
                  <Icon name="Camera" size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">Нажмите для загрузки селфи с документом</p>
                </label>
              )}
            </div>
            {errors.selfiePhoto && (
              <p className="text-red-600 text-sm mt-1">{errors.selfiePhoto}</p>
            )}
          </div>
        </div>

        {/* Дополнительная информация */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дополнительная информация
          </label>
          <textarea
            value={formData.additionalInfo}
            onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
            rows={3}
            placeholder="Любая дополнительная информация, которая поможет при рассмотрении заявки"
          />
        </div>

        {/* Кнопки */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2 justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Отправка...</span>
              </div>
            ) : (
              currentRequest ? 'Обновить заявку' : 'Подать заявку'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationRequestComponent;