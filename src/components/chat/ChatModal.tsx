import { useState } from "react";
import { sanitizeInput, preventXSS } from "@/utils/security";
import Icon from "@/components/ui/icon";

interface ChatMessage {
  text: string;
  sender: 'user' | 'support';
  showAgentButton?: boolean;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const ChatModal = ({ isOpen, onClose }: ChatModalProps) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {text: 'Привет! Я Лина — ИИ-помощник Горхон.Online 👋\n\nПомогу с техническими вопросами:\n• Как найти нужную информацию\n• Как пользоваться платформой\n• Ответы на частые вопросы\n\nЗадайте свой вопрос!', sender: 'support'}
  ]);
  const [chatInput, setChatInput] = useState('');

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
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-t-3xl md:rounded-3xl w-full md:w-96 md:max-w-md h-[90vh] md:max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom md:slide-in-from-bottom-0 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-pink-100 bg-gradient-to-r from-pink-500 to-pink-600 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon name="Bot" size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Лина</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <p className="text-xs text-white/90 font-medium">Онлайн</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-white/20 p-2 rounded-xl transition-all active:scale-95"
            aria-label="Закрыть чат"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[85%]">
                {msg.sender === 'support' && (
                  <div className="flex items-center gap-2 mb-1.5 ml-1">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center">
                      <Icon name="Bot" size={12} className="text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">Лина</span>
                  </div>
                )}
                <div 
                  className={`rounded-2xl p-4 shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto' 
                      : 'bg-white text-gray-800 border border-gray-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                  <span className={`text-xs mt-2 block ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                    {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {msg.showAgentButton && (
                  <a
                    href="https://forms.yandex.ru/u/687f5b9a84227c08790f3222/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg active:scale-98"
                  >
                    <Icon name="UserCircle" size={18} />
                    <span className="text-sm font-semibold">Написать агенту</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100 bg-white rounded-b-3xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ваше сообщение..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-pink-500 transition-colors bg-gray-50 focus:bg-white"
            />
            <button 
              onClick={sendMessage}
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-5 py-3 rounded-2xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center"
              aria-label="Отправить"
            >
              <Icon name="Send" size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;