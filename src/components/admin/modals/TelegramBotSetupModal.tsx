import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { telegramService } from '@/services/telegramService';

interface TelegramBotSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TelegramBotSetupModal = ({ isOpen, onClose, onSuccess }: TelegramBotSetupModalProps) => {
  const [step, setStep] = useState(1);
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const handleValidateAndSave = async () => {
    if (!botToken.trim() || !chatId.trim()) {
      setError('Заполните все поля');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      // Сохраняем конфигурацию
      telegramService.setConfig(botToken.trim(), chatId.trim());
      
      // Проверяем подключение
      const isValid = await telegramService.checkBotStatus();
      
      if (isValid) {
        onSuccess();
        onClose();
        resetForm();
      } else {
        setError('Не удалось подключиться к боту. Проверьте токен.');
      }
    } catch (error) {
      setError('Ошибка подключения к Telegram API');
    } finally {
      setIsValidating(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setBotToken('');
    setChatId('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="MessageCircle" className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Настройка Telegram бота</h2>
                <p className="text-blue-100 text-sm">Подключение @gorhononline_bot</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Icon name="X" className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Bot" className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Инструкция по настройке</h3>
                <p className="text-gray-600">Следуйте этим шагам для подключения бота</p>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">Создайте бота в Telegram</h4>
                      <ol className="text-blue-800 text-sm space-y-1">
                        <li>• Откройте чат с @BotFather в Telegram</li>
                        <li>• Отправьте команду <code className="bg-blue-200 px-1 rounded">/newbot</code></li>
                        <li>• Следуйте инструкциям и дайте боту имя</li>
                        <li>• Скопируйте полученный токен</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-medium text-green-900 mb-2">Создайте канал или группу</h4>
                      <ol className="text-green-800 text-sm space-y-1">
                        <li>• Создайте канал/группу для уведомлений</li>
                        <li>• Добавьте бота как администратора</li>
                        <li>• Дайте боту права на отправку сообщений</li>
                        <li>• Получите Chat ID канала/группы</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-medium text-orange-900 mb-2">Получение Chat ID</h4>
                      <div className="text-orange-800 text-sm space-y-2">
                        <p>Для получения Chat ID:</p>
                        <ol className="space-y-1">
                          <li>• Отправьте сообщение в ваш канал/группу</li>
                          <li>• Перейдите по ссылке: <br/>
                            <code className="bg-orange-200 px-1 rounded break-all">
                              https://api.telegram.org/bot[TOKEN]/getUpdates
                            </code>
                          </li>
                          <li>• Найдите "chat":{"id": в ответе</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Продолжить
                  <Icon name="ArrowRight" size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Settings" className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Введите данные бота</h3>
                <p className="text-gray-600">Вставьте токен бота и Chat ID</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
                  <div className="flex items-center gap-2">
                    <Icon name="AlertCircle" size={16} />
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Токен бота
                  </label>
                  <input
                    type="text"
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="1234567890:ABCdefGhIjKlMnOpQrStUvWxYz"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Токен, полученный от @BotFather
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chat ID канала/группы
                  </label>
                  <input
                    type="text"
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="-1001234567890"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ID канала или группы (обычно начинается с -100)
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Icon name="ArrowLeft" size={16} />
                  Назад
                </button>
                <button
                  onClick={handleValidateAndSave}
                  disabled={isValidating || !botToken.trim() || !chatId.trim()}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isValidating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Проверка...
                    </>
                  ) : (
                    <>
                      <Icon name="Check" size={16} />
                      Сохранить и подключить
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelegramBotSetupModal;