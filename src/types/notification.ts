export interface SystemNotification {
  id: string;
  title: string;
  content: string; // HTML контент с форматированием
  imageUrl?: string;
  type: 'update' | 'feature' | 'maintenance' | 'announcement';
  priority: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: string; // разработчик
  readBy: string[]; // ID пользователей, которые прочитали
}

export interface NotificationFormData {
  title: string;
  content: string;
  imageUrl: string;
  type: SystemNotification['type'];
  priority: SystemNotification['priority'];
  isActive: boolean;
}