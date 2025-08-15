import MobileSupportSystem from '@/components/support/MobileSupportSystem';
import { useUser } from '@/hooks/useUser';

const Support = () => {
  const { user } = useUser();

  // Всегда показываем прямой чат с Линой
  return <MobileSupportSystem user={user || { name: 'Гость' }} />;
};

export default Support;