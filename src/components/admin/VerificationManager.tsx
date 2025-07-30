import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useAdmin } from '@/hooks/useAdmin';
import { VerificationRequest } from '@/types/admin';

const VerificationManager: React.FC = () => {
  const { 
    verificationRequests, 
    reviewVerificationRequest, 
    getPendingRequests 
  } = useAdmin();
  
  const [selectedTab, setSelectedTab] = useState<'pending' | 'all'>('pending');
  const [reviewingRequest, setReviewingRequest] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingRequests = getPendingRequests();
  const displayRequests = selectedTab === 'pending' ? pendingRequests : verificationRequests;

  const handleApprove = (requestId: string) => {
    reviewVerificationRequest(requestId, 'approved');
    setReviewingRequest(null);
  };

  const handleReject = (requestId: string) => {
    if (!rejectionReason.trim()) {
      alert('Укажите причину отклонения');
      return;
    }
    reviewVerificationRequest(requestId, 'rejected', rejectionReason);
    setReviewingRequest(null);
    setRejectionReason('');
  };

  const getStatusBadge = (status: VerificationRequest['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800', 
      rejected: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      pending: 'На рассмотрении',
      approved: 'Одобрено',
      rejected: 'Отклонено'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Верификация пользователей</h1>
          <p className="text-gray-600 mt-1">Управление заявками на верификацию</p>
        </div>
        
        {pendingRequests.length > 0 && (
          <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg flex items-center gap-2">
            <Icon name="Clock" size={16} />
            <span className="font-medium">{pendingRequests.length} заявок ожидают</span>
          </div>
        )}
      </div>

      {/* Табы */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg inline-flex">
        <button
          onClick={() => setSelectedTab('pending')}
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedTab === 'pending'
              ? 'bg-white text-gorkhon-pink shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          На рассмотрении ({pendingRequests.length})
        </button>
        <button
          onClick={() => setSelectedTab('all')}
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedTab === 'all'
              ? 'bg-white text-gorkhon-pink shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Все заявки ({verificationRequests.length})
        </button>
      </div>

      {/* Список заявок */}
      {displayRequests.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="UserCheck" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {selectedTab === 'pending' ? 'Нет заявок на рассмотрении' : 'Заявок пока нет'}
          </h3>
          <p className="text-gray-600">
            {selectedTab === 'pending' ? 'Все заявки обработаны' : 'Заявки на верификацию появятся здесь'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayRequests.map((request) => (
            <div key={request.id} className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{request.fullName}</h3>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Логин:</strong> {request.username}
                    </div>
                    <div>
                      <strong>Email:</strong> {request.email}
                    </div>
                    <div>
                      <strong>Подана:</strong> {request.submittedAt.toLocaleString('ru-RU')}
                    </div>
                    {request.reviewedAt && (
                      <div>
                        <strong>Рассмотрена:</strong> {request.reviewedAt.toLocaleString('ru-RU')}
                      </div>
                    )}
                  </div>

                  {request.documents && request.documents.length > 0 && (
                    <div className="mt-4">
                      <strong className="text-sm text-gray-700">Документы:</strong>
                      <div className="flex gap-2 mt-1">
                        {request.documents.map((doc, index) => (
                          <a
                            key={index}
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                          >
                            Документ {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {request.status === 'rejected' && request.reason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                      <strong className="text-sm text-red-800">Причина отклонения:</strong>
                      <p className="text-sm text-red-700 mt-1">{request.reason}</p>
                    </div>
                  )}
                </div>

                {request.status === 'pending' && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                    >
                      <img 
                        src="https://cdn.poehali.dev/files/d7d9ac7d-1d6d-4e53-aaf7-50bb2a1c66ea.png" 
                        alt="Verified" 
                        className="w-4 h-4"
                      />
                      Одобрить
                    </button>
                    <button
                      onClick={() => setReviewingRequest(request.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
                    >
                      <Icon name="X" size={16} />
                      Отклонить
                    </button>
                  </div>
                )}

                {request.status === 'approved' && (
                  <div className="flex items-center gap-2 ml-4 text-green-600">
                    <img 
                      src="https://cdn.poehali.dev/files/d7d9ac7d-1d6d-4e53-aaf7-50bb2a1c66ea.png" 
                      alt="Verified" 
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-medium">Верифицирован</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модал отклонения */}
      {reviewingRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Отклонить заявку</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Причина отклонения *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink/20 focus:border-gorkhon-pink"
                rows={4}
                placeholder="Укажите причину отклонения заявки..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleReject(reviewingRequest)}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
              >
                Отклонить
              </button>
              <button
                onClick={() => {
                  setReviewingRequest(null);
                  setRejectionReason('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationManager;