import { useState } from 'react';
import UserManagement from '@/components/admin/UserManagement';
import AdminAuth from '@/components/admin/AdminAuth';
import AdminLogout from '@/components/admin/AdminLogout';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        <AdminLogout onLogout={() => setIsAuthenticated(false)} />
        <UserManagement />
      </div>
    </div>
  );
};

export default Admin;