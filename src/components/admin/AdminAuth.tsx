import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';

interface AdminAuthProps {
  onAuthenticated: () => void;
}

const DEVELOPER_EMAIL = 'smm@gelazutdinov.ru';
const ADMIN_PASSWORD_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

const AdminAuth = ({ onAuthenticated }: AdminAuthProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('admin_session_token');
    const expiresAt = sessionStorage.getItem('admin_session_expires');
    const authEmail = sessionStorage.getItem('admin_email');
    
    if (sessionToken && expiresAt && authEmail === DEVELOPER_EMAIL) {
      if (Date.now() < parseInt(expiresAt)) {
        onAuthenticated();
      } else {
        sessionStorage.removeItem('admin_session_token');
        sessionStorage.removeItem('admin_session_expires');
        sessionStorage.removeItem('admin_email');
      }
    }
  }, [onAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');



    if (email !== DEVELOPER_EMAIL) {
      setError('Доступ запрещен. Только для разработчиков.');
      setIsLoading(false);
      return;
    }

    const hashedPassword = await hashPassword(password);
    if (hashedPassword !== ADMIN_PASSWORD_HASH) {
      setError('Неверный пароль');
      setIsLoading(false);
      
      const attempts = parseInt(sessionStorage.getItem('login_attempts') || '0') + 1;
      sessionStorage.setItem('login_attempts', attempts.toString());
      
      if (attempts >= 5) {
        setError('Слишком много попыток входа. Попробуйте позже.');
        setTimeout(() => sessionStorage.removeItem('login_attempts'), 300000);
      }
      return;
    }
    
    sessionStorage.removeItem('login_attempts');

    const sessionToken = crypto.randomUUID();
    const expiresAt = Date.now() + 3600000;
    
    sessionStorage.setItem('admin_session_token', sessionToken);
    sessionStorage.setItem('admin_session_expires', expiresAt.toString());
    sessionStorage.setItem('admin_email', email);
    
    setTimeout(() => {
      setIsLoading(false);
      onAuthenticated();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Icon name="Shield" className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Админ-панель</CardTitle>
          <CardDescription className="text-gray-600">
            Доступ только для разработчиков
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email разработчика</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <Icon name="AlertCircle" className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                  Проверка...
                </>
              ) : (
                'Войти в админ-панель'
              )}
            </Button>
          </form>
          <div className="mt-6 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
            <div className="font-medium mb-1">⚠️ Только для авторизованных разработчиков</div>
            <div className="text-xs">Используйте корпоративные учётные данные</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;