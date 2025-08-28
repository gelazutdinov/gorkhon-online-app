import { getCurrentUser, isUserLoggedIn, isUserAdmin } from '@/utils/auth';

export const useAuth = () => {
  const user = getCurrentUser();
  const isLoggedIn = isUserLoggedIn();
  const isAdmin = isUserAdmin();

  return {
    user,
    isLoggedIn,
    isAdmin
  };
};