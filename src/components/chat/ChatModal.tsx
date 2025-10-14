import { useState, useEffect } from "react";
import { sanitizeInput, preventXSS } from "@/utils/security";
import Icon from "@/components/ui/icon";

const SYSTEM_MESSAGES_URL = 'https://functions.poehali.dev/a7b8d7b8-eb5d-4ecc-ac30-8672db766806';

interface ChatMessage {
  text: string;
  sender: 'user' | 'support';
  showAgentButton?: boolean;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSystemChat?: boolean;
}

const getAIResponse = (userMessage: string): {text: string, showAgentButton?: boolean} => {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('привет') || msg.includes('здравствуй') || msg.includes('добрый')) {
    return {
      text: 'Привет! Рада помочь! 👋\n\nЯ могу подсказать:\n• Где найти нужные контакты\n• Как пользоваться порталом\n• Решить технические проблемы\n\nЧто вас интересует?'
    };
  }
  
  if (msg.includes('скорая') || msg.includes('112') || msg.includes('экстренн') || msg.includes('срочно')) {
    return {
      text: '🚨 Экстренные службы:\n\n📞 112 — Единый номер экстренных служб\n📞 Скорая помощь — также доступна по 112\n📞 ЕДДС района — найдёте на главной странице\n\nВ критической ситуации звоните 112!'
    };
  }
  
  if (msg.includes('фап') || msg.includes('больниц') || msg.includes('врач') || msg.includes('поликлиник') || msg.includes('здоровье')) {
    return {
      text: '🏥 ФАП Горхон:\n\nКонтакты фельдшерско-акушерского пункта находятся на главной странице в разделе "Важные контакты".\n\nПрокрутите страницу вниз — там номер телефона и режим работы!'
    };
  }
  
  if (msg.includes('участков') || msg.includes('полиц') || msg.includes('милиц')) {
    return {
      text: '👮 Участковый:\n\nКонтакт участкового уполномоченного размещён на главной странице в разделе "Важные контакты".\n\nТам указан номер телефона для связи.'
    };
  }
  
  if (msg.includes('электричеств') || msg.includes('свет') || msg.includes('рэс') || msg.includes('энерг') || msg.includes('отключ')) {
    return {
      text: '⚡ Диспетчер РЭС:\n\nПо вопросам электроснабжения звоните диспетчеру РЭС — контакт на главной странице в разделе "Важные контакты".\n\nОни помогут при отключениях или авариях!'
    };
  }
  
  if (msg.includes('мфц') || msg.includes('документ') || msg.includes('справк') || msg.includes('заиграев')) {
    return {
      text: '🏛️ МФЦ Заиграево:\n\nКонтакты многофункционального центра находятся на главной странице.\n\nТам вы найдёте:\n• Телефон для записи\n• Режим работы\n• Адрес офиса'
    };
  }
  
  if (msg.includes('почт') || msg.includes('посылк') || msg.includes('отправ')) {
    return {
      text: '📮 Почта Горхон:\n\nКонтакты почтового отделения размещены на главной странице в разделе "Важные контакты".\n\nУточните режим работы и телефон там!'
    };
  }
  
  if (msg.includes('контакт') || msg.includes('номер') || msg.includes('телефон') || msg.includes('позвонить')) {
    return {
      text: '📞 Все контакты в одном месте!\n\nНа главной странице вы найдёте:\n• ФАП Горхон — медицинская помощь\n• Участковый — охрана порядка\n• Скорая помощь — 112\n• Диспетчер РЭС — электричество\n• МФЦ Заиграево — госуслуги\n• Почта Горхон — отправка посылок\n• ЕДДС района — экстренные службы\n\nПрокрутите главную страницу вниз!'
    };
  }
  
  if (msg.includes('работ') || msg.includes('как пользовать') || msg.includes('инструкц')) {
    return {
      text: '📖 Как пользоваться порталом:\n\n1. На главной странице размещены все важные контакты\n2. Нажмите на номер телефона, чтобы позвонить\n3. Используйте меню (три полоски) для доступа к документам\n4. Я всегда здесь, если нужна помощь!\n\nПросто и удобно! 😊'
    };
  }
  
  if (msg.includes('как найти') || msg.includes('где найти') || msg.includes('где находится') || msg.includes('где посмотреть')) {
    return {
      text: '🔍 Как найти информацию:\n\n• Все контакты — на главной странице\n• Прокрутите вниз — там всё самое важное\n• Нажмите на раздел с нужной организацией\n• Телефоны кликабельны — можно сразу позвонить\n\nЧто именно ищете? Подскажу точнее!'
    };
  }
  
  if (msg.includes('проблем') || msg.includes('не работает') || msg.includes('ошибка') || msg.includes('баг') || msg.includes('не открывается')) {
    return {
      text: '🔧 Решаем техническую проблему:\n\n1️⃣ Обновите страницу (F5 или потяните вниз)\n2️⃣ Проверьте интернет-соединение\n3️⃣ Очистите кеш браузера\n4️⃣ Попробуйте другой браузер\n\nНе помогло? Напишите агенту — разберёмся вместе!',
      showAgentButton: true
    };
  }
  
  if (msg.includes('медленн') || msg.includes('тормоз') || msg.includes('долго грузится') || msg.includes('зависа')) {
    return {
      text: '⏱️ Портал загружается медленно?\n\nПопробуйте:\n• Проверить скорость интернета\n• Закрыть лишние вкладки\n• Перезагрузить устройство\n• Использовать Wi-Fi вместо мобильного интернета\n\nЕсли проблема остаётся, сообщите агенту!',
      showAgentButton: true
    };
  }
  
  if (msg.includes('установ') || msg.includes('приложение') || msg.includes('скачать')) {
    return {
      text: '📱 Установка веб-приложения:\n\nВы можете добавить Горхон.Online на главный экран!\n\n🔹 На Android: нажмите меню браузера → "Добавить на главный экран"\n🔹 На iPhone: Safari → Поделиться → "На экран Домой"\n\nБудет работать как приложение!'
    };
  }
  
  if (msg.includes('спасибо') || msg.includes('благодар') || msg.includes('помогли')) {
    return {
      text: 'Всегда рада помочь! 😊\n\nЕсли возникнут ещё вопросы — обращайтесь!\n\nХорошего дня! ✨'
    };
  }
  
  if (msg.includes('агент') || msg.includes('человек') || msg.includes('оператор') || msg.includes('живой')) {
    return {
      text: '👤 Нужен живой оператор?\n\nНаш агент всегда готов помочь с любыми вопросами лично!\n\nНажмите кнопку ниже, чтобы написать.',
      showAgentButton: true
    };
  }
  
  if (msg.includes('кто ты') || msg.includes('что ты') || msg.includes('ты кто')) {
    return {
      text: 'Я Лина — ИИ-помощник портала Горхон.Online! 🤖\n\nСоздана, чтобы помогать жителям посёлка быстро находить нужную информацию.\n\nРаботаю 24/7 и всегда рада помочь! 💙'
    };
  }
  
  if (msg.includes('новости') || msg.includes('что нового') || msg.includes('обновлен')) {
    return {
      text: 'Портал постоянно развивается!\n\n✨ Актуальные контакты всех служб\n✨ Быстрый доступ к важным номерам\n✨ Круглосуточная поддержка (я!)\n\nСледите за обновлениями на портале!'
    };
  }
  
  if (msg.length < 3) {
    return {
      text: 'Не совсем понял ваш вопрос 🤔\n\nПопробуйте спросить подробнее, например:\n• "Где найти номер врача?"\n• "Как позвонить в скорую?"\n• "Контакты МФЦ"'
    };
  }
  
  return {
    text: 'Хороший вопрос! 🤔\n\nЯ помогу найти:\n• Контакты служб Горхона\n• Экстренные номера\n• Информацию о работе портала\n\nУточните, что именно вас интересует, или напишите агенту для детальной консультации!',
    showAgentButton: true
  };
};

const ChatModal = ({ isOpen, onClose, isSystemChat = false }: ChatModalProps) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    if (!isSystemChat) {
      return [
        {text: 'Привет! Я Лина — ИИ-помощник Горхон.Online 👋\n\nПомогу с техническими вопросами:\n• Как найти нужную информацию\n• Как пользоваться платформой\n• Ответы на частые вопросы\n\nЗадайте свой вопрос!', sender: 'support'}
      ];
    }
    return [];
  });
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Загрузка системных сообщений из backend
  useEffect(() => {
    if (isSystemChat && isOpen) {
      const loadMessages = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(SYSTEM_MESSAGES_URL);
          const data = await response.json();
          
          if (data.messages && data.messages.length > 0) {
            setChatMessages(data.messages.map((msg: any) => ({
              text: msg.text,
              sender: 'support' as const
            })));
          } else {
            setChatMessages([{
              text: '👋 Добро пожаловать в системный чат Горхон.Online!\n\n📢 Следите за новостями и обновлениями здесь!',
              sender: 'support'
            }]);
          }
        } catch (error) {
          console.error('Failed to load system messages:', error);
          setChatMessages([{
            text: '⚠️ Не удалось загрузить сообщения. Попробуйте позже.',
            sender: 'support'
          }]);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadMessages();
    }
  }, [isOpen, isSystemChat]);

  const sendMessage = () => {
    if (chatInput.trim()) {
      const sanitized = sanitizeInput(chatInput.trim());
      const userMsg = preventXSS(sanitized);
      
      if (userMsg.length > 1000) {
        return;
      }
      
      setChatMessages(prev => [...prev, {text: userMsg, sender: 'user'}]);
      setChatInput('');
      
      setTimeout(() => {
        const aiResponse = getAIResponse(userMsg);
        setChatMessages(prev => [...prev, {
          text: aiResponse.text,
          sender: 'support',
          showAgentButton: aiResponse.showAgentButton
        }]);
      }, 800);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-t-2xl md:rounded-2xl w-full md:w-96 md:max-w-md h-[90vh] md:max-h-[80vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{backgroundColor: '#F1117E'}}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center relative">
              {isSystemChat ? (
                <>
                  <Icon name="MessageCircle" size={20} className="text-white" />
                  <img 
                    src="https://cdn.poehali.dev/files/dbf46829-41e3-4fcf-956e-f6c84fb50dc3.png" 
                    alt="Verified"
                    className="absolute -bottom-1 -right-1 w-5 h-5"
                  />
                </>
              ) : (
                <Icon name="Bot" size={20} className="text-white" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white">{isSystemChat ? 'Горхон.Online' : 'Лина'}</h3>
              <p className="text-xs text-white/80">{isSystemChat ? 'Системный чат' : 'ИИ-помощник'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {chatMessages.map((msg, idx) => (
            <div key={idx}>
              <div 
                className={`rounded-lg p-3 max-w-[80%] ${
                  msg.sender === 'user' 
                    ? 'ml-auto bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{msg.text}</p>
                <span className="text-xs mt-1 block opacity-70">
                  {msg.sender === 'user' ? 'Вы' : (isSystemChat ? 'Горхон.Online' : 'Лина (ИИ)')} • сейчас
                </span>
              </div>
              {msg.showAgentButton && (
                <a
                  href="https://forms.yandex.ru/u/687f5b9a84227c08790f3222/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors shadow-sm"
                >
                  <Icon name="UserCircle" size={18} />
                  <span className="text-sm font-medium">Написать агенту</span>
                </a>
              )}
            </div>
          ))}
        </div>

        {!isSystemChat && (
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Напишите сообщение..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={sendMessage}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
              >
                <Icon name="Send" size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatModal;