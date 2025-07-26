import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { VerificationRequest, VerificationStats, VerificationHistoryEntry } from '@/types/verification';

interface AdminPanelProps {
  onClose: () => void;
  isAdmin: boolean;
}

const AdminPanel = ({ onClose, isAdmin }: AdminPanelProps) => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [stats, setStats] = useState<VerificationStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    todaySubmitted: 0,
    todayReviewed: 0
  });
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [reviewComment, setReviewComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Загрузка заявок
  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    try {
      const stored = localStorage.getItem('gorkhon_verification_requests');
      const allRequests: VerificationRequest[] = stored ? JSON.parse(stored) : [];
      
      setRequests(allRequests);
      calculateStats(allRequests);
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error);
    }
  };

  const calculateStats = (allRequests: VerificationRequest[]) => {
    const today = new Date().toDateString();
    
    const newStats: VerificationStats = {
      total: allRequests.length,
      pending: allRequests.filter(r => r.status === 'pending').length,
      approved: allRequests.filter(r => r.status === 'approved').length,
      rejected: allRequests.filter(r => r.status === 'rejected').length,
      todaySubmitted: allRequests.filter(r => 
        new Date(r.submittedAt).toDateString() === today
      ).length,
      todayReviewed: allRequests.filter(r => 
        r.reviewedAt && new Date(r.reviewedAt).toDateString() === today
      ).length
    };
    
    setStats(newStats);
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const handleReviewRequest = async (requestId: string, action: 'approve' | 'reject') => {
    if (!reviewComment.trim() && action === 'reject') {
      alert('Для отклонения заявки необходимо указать причину');
      return;
    }

    setIsProcessing(true);

    try {
      const updatedRequests = requests.map(request => {
        if (request.id === requestId) {
          const historyEntry: VerificationHistoryEntry = {
            timestamp: new Date().toISOString(),
            action: action === 'approve' ? 'approved' : 'rejected',
            adminId: 'admin_current', // В реальности здесь ID текущего админа
            comment: reviewComment || undefined
          };

          return {
            ...request,
            status: action === 'approve' ? 'approved' as const : 'rejected' as const,
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'admin_current',
            adminComment: reviewComment || undefined,
            history: [...request.history, historyEntry]
          };
        }
        return request;
      });

      // Сохраняем обновленные заявки
      localStorage.setItem('gorkhon_verification_requests', JSON.stringify(updatedRequests));
      
      // Обновляем верификацию пользователя
      if (action === 'approve') {
        updateUserVerification(selectedRequest!.userId, true);
      }

      setRequests(updatedRequests);
      calculateStats(updatedRequests);
      setSelectedRequest(null);
      setReviewComment('');
      
      console.log(`Заявка ${requestId} ${action === 'approve' ? 'одобрена' : 'отклонена'}`);
    } catch (error) {
      console.error('Ошибка обработки заявки:', error);
      alert('Произошла ошибка при обработке заявки');
    } finally {
      setIsProcessing(false);
    }
  };

  const updateUserVerification = (userId: string, approved: boolean) => {
    try {
      // Обновляем профиль пользователя
      const userProfile = localStorage.getItem('gorkhon_user_profile');
      if (userProfile) {
        const profile = JSON.parse(userProfile);
        if (profile.id === userId || !profile.id) {
          profile.verification = {
            status: approved ? 'approved' : 'rejected',
            verifiedAt: approved ? new Date().toISOString() : undefined,
            badge: approved ? 'resident' : undefined
          };
          localStorage.setItem('gorkhon_user_profile', JSON.stringify(profile));
        }
      }
    } catch (error) {
      console.error('Ошибка обновления профиля пользователя:', error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl w-full max-w-md p-6 shadow-2xl border border-white/20">
        <div className="text-center">
          <Icon name="Shield" size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Доступ запрещен</h2>
          <p className="text-gray-600 mb-4">У вас нет прав для доступа к админ-панели</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl w-full max-w-6xl max-h-[85vh] overflow-hidden shadow-2xl border border-white/20">
      {/* Заголовок */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Админ-панель верификации
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Управление заявками на верификацию жителей Горхона
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon name="X" size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="flex h-[calc(85vh-80px)]">
        {/* Левая панель - список заявок */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col">
          {/* Статистика */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gorkhon-pink">{stats.pending}</div>
                <div className="text-sm text-gray-600">На рассмотрении</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                <div className="text-sm text-gray-600">Одобрено</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                <div className="text-sm text-gray-600">Отклонено</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.todaySubmitted}</div>
                <div className="text-sm text-gray-600">Сегодня подано</div>
              </div>
            </div>
          </div>

          {/* Фильтры */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-2">
              {[
                { key: 'pending', label: 'На рассмотрении', color: 'bg-yellow-100 text-yellow-800' },
                { key: 'approved', label: 'Одобренные', color: 'bg-green-100 text-green-800' },
                { key: 'rejected', label: 'Отклоненные', color: 'bg-red-100 text-red-800' },
                { key: 'all', label: 'Все', color: 'bg-gray-100 text-gray-800' }
              ].map(filterOption => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key as any)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === filterOption.key 
                      ? filterOption.color 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* Список заявок */}
          <div className="flex-1 overflow-y-auto">
            {filteredRequests.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Icon name="FileText" size={48} className="mx-auto mb-2 opacity-50" />
                <p>Заявок не найдено</p>
              </div>
            ) : (
              filteredRequests.map(request => (
                <div
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedRequest?.id === request.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{request.fullName}</h4>
                      <p className="text-sm text-gray-600">{request.address}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(request.submittedAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status === 'pending' ? 'На рассмотрении' :
                       request.status === 'approved' ? 'Одобрена' : 'Отклонена'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Правая панель - детали заявки */}
        <div className="w-1/2 flex flex-col">
          {selectedRequest ? (
            <>
              {/* Детали заявки */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Основная информация */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Информация о заявителе</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Полное имя:</span>
                        <span className="font-medium">{selectedRequest.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Адрес:</span>
                        <span className="font-medium">{selectedRequest.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedRequest.userEmail || 'Не указан'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Телефон:</span>
                        <span className="font-medium">{selectedRequest.userPhone || 'Не указан'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Документы */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Документы</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Тип документа:</span>
                        <span className="font-medium">
                          {selectedRequest.documentType === 'passport' ? 'Паспорт РФ' :
                           selectedRequest.documentType === 'birth_certificate' ? 'Свидетельство о рождении' :
                           'Вид на жительство'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Номер:</span>
                        <span className="font-medium">{selectedRequest.documentNumber}</span>
                      </div>
                    </div>

                    {/* Фотографии */}
                    <div className="grid grid-cols-2 gap-4">
                      {selectedRequest.documentPhoto && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Фото документа</h4>
                          <img 
                            src={selectedRequest.documentPhoto} 
                            alt="Документ" 
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                      {selectedRequest.selfiePhoto && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Селфи с документом</h4>
                          <img 
                            src={selectedRequest.selfiePhoto} 
                            alt="Селфи" 
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Дополнительная информация */}
                  {selectedRequest.additionalInfo && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Дополнительная информация</h3>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {selectedRequest.additionalInfo}
                      </p>
                    </div>
                  )}

                  {/* История */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">История изменений</h3>
                    <div className="space-y-2">
                      {selectedRequest.history.map((entry, index) => (
                        <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {entry.action === 'submitted' ? 'Подана заявка' :
                               entry.action === 'approved' ? 'Заявка одобрена' :
                               entry.action === 'rejected' ? 'Заявка отклонена' :
                               'Заявка обновлена'}
                            </span>
                            <span className="text-gray-500">
                              {new Date(entry.timestamp).toLocaleString('ru-RU')}
                            </span>
                          </div>
                          {entry.comment && (
                            <p className="text-gray-600 mt-1">{entry.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Панель действий */}
              {selectedRequest.status === 'pending' && (
                <div className="border-t border-gray-200 p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Комментарий (обязательно для отклонения)
                      </label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
                        rows={3}
                        placeholder="Укажите причину решения..."
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReviewRequest(selectedRequest.id, 'reject')}
                        disabled={isProcessing}
                        className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Обработка...' : 'Отклонить'}
                      </button>
                      <button
                        onClick={() => handleReviewRequest(selectedRequest.id, 'approve')}
                        disabled={isProcessing}
                        className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Обработка...' : 'Одобрить'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Icon name="FileSearch" size={48} className="mx-auto mb-2 opacity-50" />
                <p>Выберите заявку для просмотра</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;