// Типы для системы верификации жителей Горхона

export type VerificationStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  
  // Данные заявки
  fullName: string;
  address: string;
  documentType: 'passport' | 'birth_certificate' | 'residence_permit';
  documentNumber: string;
  documentPhoto?: string; // base64
  selfiePhoto?: string; // base64
  additionalInfo?: string;
  
  // Метаданные
  status: VerificationStatus;
  submittedAt: string; // ISO date
  reviewedAt?: string; // ISO date
  reviewedBy?: string; // ID админа
  adminComment?: string;
  
  // История изменений
  history: VerificationHistoryEntry[];
}

export interface VerificationHistoryEntry {
  timestamp: string; // ISO date
  action: 'submitted' | 'approved' | 'rejected' | 'updated';
  adminId?: string;
  comment?: string;
}

export interface UserVerification {
  status: VerificationStatus;
  verifiedAt?: string; // ISO date
  badge?: 'resident' | 'native' | 'official'; // Типы галочек
  requestId?: string; // ID текущей заявки
}

export interface VerificationAdmin {
  id: string;
  name: string;
  role: 'moderator' | 'admin' | 'super_admin';
  permissions: string[];
}

// Форма подачи заявки
export interface VerificationFormData {
  fullName: string;
  address: string;
  documentType: 'passport' | 'birth_certificate' | 'residence_permit';
  documentNumber: string;
  documentPhoto?: File;
  selfiePhoto?: File;
  additionalInfo?: string;
}

// Статистика для админов
export interface VerificationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  todaySubmitted: number;
  todayReviewed: number;
}