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

const AdminAuth = ({ onAuthenticated }: AdminAuthProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Проверяем, если пользователь уже авторизован
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    const authEmail = localStorage.getItem('admin_email');
    
    if (isAuthenticated === 'true' && authEmail === DEVELOPER_EMAIL) {
      onAuthenticated();
    }
  }, [onAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Проверяем email
    if (email !== DEVELOPER_EMAIL) {
      setError('Доступ запрещен. Только для разработчиков.');
      setIsLoading(false);
      return;
    }

    // Простая проверка пароля (в реальном приложении это должно быть на сервере)
    if (password !== 'dev2024') {
      setError('Неверный пароль');
      setIsLoading(false);
      return;
    }

    // Сохраняем авторизацию
    localStorage.setItem('admin_authenticated', 'true');
    localStorage.setItem('admin_email', email);
    
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
            <div className="font-medium mb-1">Для разработчиков:</div>
            <div>Email: {DEVELOPER_EMAIL}</div>
            <div>Пароль: dev2024</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;