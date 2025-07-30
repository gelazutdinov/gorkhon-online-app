import { useState, useEffect } from 'react';
import { VerificationRequest, VerificationFormData, UserVerificationStatus } from '@/types/verification';

const VERIFICATION_REQUESTS_KEY = 'verification-requests';
const USER_VERIFICATIONS_KEY = 'user-verifications';

export const useVerification = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [userVerifications, setUserVerifications] = useState<Record<string, UserVerificationStatus>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      // Загружаем заявки на верификацию
      const storedRequests = localStorage.getItem(VERIFICATION_REQUESTS_KEY);
      if (storedRequests) {
        const parsed = JSON.parse(storedRequests);
        setRequests(parsed.map((r: any) => ({
          ...r,
          submittedAt: new Date(r.submittedAt),
          reviewedAt: r.reviewedAt ? new Date(r.reviewedAt) : undefined
        })));
      }

      // Загружаем статусы верификации пользователей
      const storedVerifications = localStorage.getItem(USER_VERIFICATIONS_KEY);
      if (storedVerifications) {
        const parsed = JSON.parse(storedVerifications);
        setUserVerifications(Object.fromEntries(
          Object.entries(parsed).map(([userId, status]: [string, any]) => [
            userId,
            {
              ...status,
              verifiedAt: status.verifiedAt ? new Date(status.verifiedAt) : undefined
            }
          ])
        ));
      }
    } catch (error) {
      console.error('Error loading verification data:', error);
    }
    setIsLoading(false);
  };

  const saveRequests = (newRequests: VerificationRequest[]) => {
    try {
      localStorage.setItem(VERIFICATION_REQUESTS_KEY, JSON.stringify(newRequests));
      setRequests(newRequests);
    } catch (error) {
      console.error('Error saving verification requests:', error);
    }
  };

  const saveUserVerifications = (newVerifications: Record<string, UserVerificationStatus>) => {
    try {
      localStorage.setItem(USER_VERIFICATIONS_KEY, JSON.stringify(newVerifications));
      setUserVerifications(newVerifications);
    } catch (error) {
      console.error('Error saving user verifications:', error);
    }
  };

  const submitVerificationRequest = (userId: string, username: string, email: string, formData: VerificationFormData): VerificationRequest => {
    const request: VerificationRequest = {
      id: `verification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      username,
      email,
      fullName: formData.fullName,
      reason: formData.reason,
      documents: formData.documents.filter(d => d.trim()),
      socialLinks: {
        instagram: formData.socialLinks.instagram || undefined,
        telegram: formData.socialLinks.telegram || undefined,
        website: formData.socialLinks.website || undefined
      },
      status: 'pending',
      submittedAt: new Date()
    };

    const updated = [request, ...requests];
    saveRequests(updated);
    return request;
  };

  const reviewVerificationRequest = (
    requestId: string, 
    adminId: string, 
    action: 'approved' | 'rejected', 
    notes?: string
  ): boolean => {
    const requestIndex = requests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) return false;

    const request = requests[requestIndex];
    const updatedRequests = [...requests];
    
    updatedRequests[requestIndex] = {
      ...request,
      status: action,
      reviewedAt: new Date(),
      reviewedBy: adminId,
      reviewNotes: notes
    };

    // Если одобрено - обновляем статус верификации пользователя
    if (action === 'approved') {
      const updatedVerifications = {
        ...userVerifications,
        [request.userId]: {
          isVerified: true,
          verifiedAt: new Date(),
          verificationBadge: 'https://cdn.poehali.dev/files/d7d9ac7d-1d6d-4e53-aaf7-50bb2a1c66ea.png'
        }
      };
      saveUserVerifications(updatedVerifications);
    }

    saveRequests(updatedRequests);
    return true;
  };

  const getUserVerificationStatus = (userId: string): UserVerificationStatus => {
    return userVerifications[userId] || { isVerified: false };
  };

  const getPendingRequests = () => {
    return requests.filter(r => r.status === 'pending').sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  };

  const getRequestsByStatus = (status: VerificationRequest['status']) => {
    return requests.filter(r => r.status === status).sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  };

  const hasActiveRequest = (userId: string) => {
    return requests.some(r => r.userId === userId && r.status === 'pending');
  };

  return {
    requests,
    userVerifications,
    isLoading,
    submitVerificationRequest,
    reviewVerificationRequest,
    getUserVerificationStatus,
    getPendingRequests,
    getRequestsByStatus,
    hasActiveRequest,
    refreshData: loadData
  };
};