export interface ImportantNumber {
  name: string;
  person: string;
  phone: string;
  icon: string;
}

export interface WorkScheduleItem {
  name: string;
  schedule: string;
  icon: string;
}

export interface PvzItem {
  name: string;
  address: string;
  schedule: string;
  phone: string;
  hasFitting: boolean;
  photos: { url: string; caption: string; }[];
}

export interface SystemMessage {
  id: string;
  text: string;
  timestamp: string;
  isFromAdmin?: boolean;
}

export interface HelpItem {
  title: string;
  description: string;
  contact: string;
  icon: string;
}
