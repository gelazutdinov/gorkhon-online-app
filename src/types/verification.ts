export interface VerificationRequest {
  id: string;
  userId: string;
  username: string;
  email: string;
  fullName: string;
  reason: string; // Причина запроса верификации
  documents?: string[]; // URL документов для подтверждения
  socialLinks?: {
    instagram?: string;
    telegram?: string;
    website?: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string; // ID админа
  reviewNotes?: string;
}

export interface VerificationFormData {
  reason: string;
  fullName: string;
  documents: string[];
  socialLinks: {
    instagram: string;
    telegram: string;
    website: string;
  };
}

export interface UserVerificationStatus {
  isVerified: boolean;
  verifiedAt?: Date;
  verificationBadge?: string; // URL иконки верификации
}