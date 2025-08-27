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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <AdminLogout onLogout={() => setIsAuthenticated(false)} />
        </div>
      </div>
      <UserManagement />
    </div>
  );
};

export default Admin;