import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import { isUserLoggedIn } from '@/utils/auth';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем, не авторизован ли уже пользователь
    if (isUserLoggedIn()) {
      navigate('/');
    }
  }, [navigate]);

  const handleSuccess = () => {
    // При успешном входе/регистрации перенаправляем на главную
    navigate('/');
  };

  return (
    <>
      {isLogin ? (
        <LoginForm 
          onSwitchToRegister={() => setIsLogin(false)} 
          onSuccess={handleSuccess}
        />
      ) : (
        <RegisterForm 
          onSwitchToLogin={() => setIsLogin(true)} 
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
};

export default AuthPage;