import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface SecuritySettings {
  smsNotifications: boolean;
  emailNotifications: boolean;
  loginAlerts: boolean;
  dataEncryption: boolean;
  privacyMode: boolean;
}

const SecuritySettings = () => {
  const [settings, setSettings] = useState<SecuritySettings>({
    smsNotifications: true,
    emailNotifications: true,
    loginAlerts: true,
    dataEncryption: true,
    privacyMode: false
  });





  const handleToggleSetting = (key: keyof SecuritySettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };



  const securityLevel = () => {
    const enabledCount = Object.values(settings).filter(Boolean).length;
    const total = Object.keys(settings).length;
    const percentage = (enabledCount / total) * 100;
    
    if (percentage >= 80) return { level: 'Высокий', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 50) return { level: 'Средний', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Низкий', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const securityInfo = securityLevel();

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">🔒 Безопасность</h1>
            <p className="text-white/90">Настройки защиты вашего аккаунта</p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${securityInfo.bg} ${securityInfo.color} text-sm font-medium`}>
              <Icon name="Shield" size={16} />
              {securityInfo.level}
            </div>
          </div>
        </div>
      </div>

      {/* Сертификаты SSL/TLS */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Icon name="ShieldCheck" size={24} className="text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">🛡️ SSL/TLS Защита</h3>
            <p className="text-gray-600 mb-4">
              Ваше соединение защищено современными сертификатами шифрования. 
              Все данные передаются в зашифрованном виде.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700">
                <Icon name="Lock" size={16} />
                <span className="font-medium">Соединение защищено</span>
              </div>
              <p className="text-green-600 text-sm mt-1">
                Сертификат: TLS 1.3 • Выдан: Let's Encrypt • До: 15.11.2024
              </p>
            </div>
          </div>
        </div>
      </div>



      {/* Настройки уведомлений */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="font-bold text-lg mb-4">🔔 Уведомления о безопасности</h3>
        <div className="space-y-4">
          {[
            {
              key: 'smsNotifications' as keyof SecuritySettings,
              title: 'SMS уведомления',
              description: 'Получать SMS при входе в аккаунт',
              icon: 'Smartphone'
            },
            {
              key: 'emailNotifications' as keyof SecuritySettings,
              title: 'Email уведомления',
              description: 'Получать письма о важных действиях',
              icon: 'Mail'
            },
            {
              key: 'loginAlerts' as keyof SecuritySettings,
              title: 'Оповещения о входе',
              description: 'Уведомления о новых сессиях',
              icon: 'AlertTriangle'
            }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name={item.icon as any} size={20} className="text-gray-600" />
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleSetting(item.key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings[item.key] ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Дополнительные настройки */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="font-bold text-lg mb-4">⚙️ Дополнительные настройки</h3>
        <div className="space-y-4">
          {[
            {
              key: 'dataEncryption' as keyof SecuritySettings,
              title: 'Шифрование данных',
              description: 'Дополнительное шифрование личных данных',
              icon: 'Lock'
            },
            {
              key: 'privacyMode' as keyof SecuritySettings,
              title: 'Режим приватности',
              description: 'Скрыть профиль от других пользователей',
              icon: 'EyeOff'
            }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name={item.icon as any} size={20} className="text-gray-600" />
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleSetting(item.key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings[item.key] ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default SecuritySettings;