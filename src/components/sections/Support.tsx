import MobileSupportSystem from '@/components/support/MobileSupportSystem';

interface SupportProps {
  onSectionChange?: (section: string) => void;
}

const Support = ({ onSectionChange }: SupportProps) => {
  // Всегда показываем прямой чат с Линой
  return <MobileSupportSystem user={{ name: 'Гость' }} onSectionChange={onSectionChange} />;
};

export default Support;