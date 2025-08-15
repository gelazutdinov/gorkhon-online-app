import MobileSupportSystem from '@/components/support/MobileSupportSystem';
import { useUser } from '@/hooks/useUser';

interface SupportProps {
  onSectionChange?: (section: string) => void;
}

const Support = ({ onSectionChange }: SupportProps) => {
  const { user } = useUser();

  // Всегда показываем прямой чат с Линой
  return <MobileSupportSystem user={user || { name: 'Гость' }} onSectionChange={onSectionChange} />;
};

export default Support;