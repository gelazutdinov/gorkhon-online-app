import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AdminLogoutProps {
  onLogout: () => void;
}

const AdminLogout = ({ onLogout }: AdminLogoutProps) => {
  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_email');
    onLogout();
  };

  const adminEmail = localStorage.getItem('admin_email');

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Icon name="User" className="w-4 h-4" />
        <span>{adminEmail}</span>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleLogout}
        className="ml-auto"
      >
        <Icon name="LogOut" className="w-4 h-4 mr-2" />
        Выйти
      </Button>
    </div>
  );
};

export default AdminLogout;