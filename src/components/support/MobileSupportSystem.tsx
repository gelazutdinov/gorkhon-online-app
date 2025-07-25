import { useState } from 'react';
import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';
import TicketSystem from '../TicketSystem';

interface MobileSupportSystemProps {
  user: UserProfile;
}

const MobileSupportSystem = ({ user }: MobileSupportSystemProps) => {
  const [showFullSupport, setShowFullSupport] = useState(false);
  const [showLinaChat, setShowLinaChat] = useState(false);

  // Убираем популярные вопросы по запросу

  return (
    <div className="relative">
      {/* Основная система поддержки */}
      {showFullSupport ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Техническая поддержка</h2>
            <button
              onClick={() => setShowFullSupport(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Icon name="X" size={20} className="text-gray-500" />
            </button>
          </div>
          <TicketSystem user={user} />
        </div>
      ) : (
        <>
          {/* Мобильная версия с быстрыми вопросами */}
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Поддержка Горхона</h2>
              <p className="text-gray-600">Лина поможет с любыми вопросами 24/7</p>
            </div>

            {/* Быстрые вопросы убраны по запросу */}

            {/* Кнопки действий */}
            <div className="space-y-3">
              <button
                onClick={() => setShowLinaChat(true)}
                className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all"
              >
                <Icon name="MessageCircle" size={20} />
                <span className="font-medium">Чат с Линой</span>
              </button>
              
              <button
                onClick={() => setShowFullSupport(true)}
                className="w-full flex items-center justify-center gap-3 p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Icon name="Settings" size={20} />
                <span className="font-medium">Создать тикет</span>
              </button>
            </div>

            {/* Информация */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Как работает поддержка?</h4>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Лина — AI-помощник, который отвечает мгновенно. Если нужна помощь человека, 
                    она переведет вас на агента или вы можете создать тикет.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Плавающий чат с Линой - поднят выше */}
          {showLinaChat && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end p-4 pb-24">
              <div className="bg-white rounded-2xl w-80 h-96 flex flex-col shadow-2xl animate-in slide-in-from-right-5">
                {/* Заголовок чата */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      🤖
                    </div>
                    <div>
                      <h3 className="font-semibold">Лина</h3>
                      <p className="text-xs opacity-80">Онлайн</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLinaChat(false)}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>

                {/* Сообщения */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-sm">
                        🤖
                      </div>
                      <div className="bg-gray-100 rounded-2xl px-4 py-2 max-w-[80%]">
                        <p className="text-sm text-gray-800">
                          Привет! Я Лина, ваш AI-помощник. Чем могу помочь? 😊
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Поле ввода */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Напишите сообщение..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                    <button className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center hover:from-purple-600 hover:to-blue-600 transition-all">
                      <Icon name="Send" size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Плавающая кнопка Лина - поднята выше меню */}
      {!showLinaChat && !showFullSupport && (
        <button
          onClick={() => setShowLinaChat(true)}
          className="fixed bottom-32 right-4 w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center animate-pulse z-40"
        >
          <span className="text-xl">🤖</span>
        </button>
      )}
    </div>
  );
};

export default MobileSupportSystem;