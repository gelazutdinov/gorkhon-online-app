export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'super_admin';
  isActive: boolean;
  createdAt: Date;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  username: string;
  email: string;
  fullName: string;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  documents?: string[]; // URLs документов
  reason?: string; // Причина отклонения
  reviewedBy?: string; // ID админа
  reviewedAt?: Date;
}