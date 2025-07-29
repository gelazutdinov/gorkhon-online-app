import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface SecuritySettings {
  twoFactorEnabled: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
  loginAlerts: boolean;
  dataEncryption: boolean;
  privacyMode: boolean;
}

const SecuritySettings = () => {
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    smsNotifications: true,
    emailNotifications: true,
    loginAlerts: true,
    dataEncryption: true,
    privacyMode: false
  });

  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState<'phone' | 'verify' | 'backup'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 8; i++) {
      codes.push(Math.random().toString(36).substring(2, 8).toUpperCase());
    }
    return codes;
  };

  const handleToggleSetting = (key: keyof SecuritySettings) => {
    if (key === 'twoFactorEnabled' && !settings.twoFactorEnabled) {
      setShowTwoFactorSetup(true);
      return;
    }
    
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSetupTwoFactor = () => {
    if (twoFactorStep === 'phone') {
      if (!phoneNumber) return;
      // Имитация отправки SMS
      console.log('Отправка SMS на:', phoneNumber);
      setTwoFactorStep('verify');
    } else if (twoFactorStep === 'verify') {
      if (!verificationCode) return;
      // Имитация проверки кода
      console.log('Проверка кода:', verificationCode);
      const codes = generateBackupCodes();
      setBackupCodes(codes);
      setTwoFactorStep('backup');
    } else if (twoFactorStep === 'backup') {
      setSettings(prev => ({ ...prev, twoFactorEnabled: true }));
      setShowTwoFactorSetup(false);
      setTwoFactorStep('phone');
      setPhoneNumber('');
      setVerificationCode('');
      setBackupCodes([]);
    }
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

      {/* Двухфакторная аутентификация */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            settings.twoFactorEnabled ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            <Icon 
              name={settings.twoFactorEnabled ? "ShieldCheck" : "Shield"} 
              size={24} 
              className={settings.twoFactorEnabled ? 'text-green-600' : 'text-orange-600'} 
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">📱 Двухфакторная аутентификация</h3>
                <p className="text-gray-600">
                  Дополнительный уровень защиты с подтверждением по SMS
                </p>
              </div>
              <button
                onClick={() => handleToggleSetting('twoFactorEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.twoFactorEnabled ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {settings.twoFactorEnabled && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <Icon name="CheckCircle" size={16} />
                  <span className="font-medium">Двухфакторная аутентификация активна</span>
                </div>
                <p className="text-green-600 text-sm mt-1">
                  Привязанный номер: +7 (xxx) xxx-xx-45
                </p>
              </div>
            )}
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

      {/* Модальное окно настройки 2FA */}
      {showTwoFactorSetup && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowTwoFactorSetup(false)}></div>
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">🔐 Двухфакторная аутентификация</h3>
              <button
                onClick={() => setShowTwoFactorSetup(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            {twoFactorStep === 'phone' && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Введите номер телефона для получения кодов подтверждения
                </p>
                <div>
                  <label className="block text-sm font-medium mb-2">Номер телефона</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSetupTwoFactor}
                  disabled={!phoneNumber}
                  className="w-full bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  Отправить код
                </button>
              </div>
            )}

            {twoFactorStep === 'verify' && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Введите код подтверждения, отправленный на номер {phoneNumber}
                </p>
                <div>
                  <label className="block text-sm font-medium mb-2">Код подтверждения</label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent text-center text-xl font-mono"
                    maxLength={6}
                  />
                </div>
                <button
                  onClick={handleSetupTwoFactor}
                  disabled={!verificationCode}
                  className="w-full bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  Подтвердить
                </button>
              </div>
            )}

            {twoFactorStep === 'backup' && (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-700 mb-2">
                    <Icon name="AlertTriangle" size={16} />
                    <span className="font-medium">Сохраните резервные коды</span>
                  </div>
                  <p className="text-yellow-600 text-sm">
                    Используйте эти коды, если потеряете доступ к телефону
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-lg">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="text-center p-2 bg-white rounded border font-mono text-sm">
                      {code}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSetupTwoFactor}
                  className="w-full bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Завершить настройку
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySettings;