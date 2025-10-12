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
  
  if (msg.includes('контакт') || msg.includes('номер') || msg.includes('телефон') || msg.includes('позвонить')) {
    return {
      text: 'Все важные контакты размещены на главной странице:\n\n• ФАП Горхон\n• Участковый\n• Скорая помощь (112)\n• Диспетчер РЭС\n• МФЦ Заиграево\n• Почта Горхон\n• ЕДДС района\n\nПрокрутите страницу вниз, чтобы увидеть полный список с номерами!'
    };
  }
  
  if (msg.includes('работ') || msg.includes('как пользовать') || msg.includes('как найти') || msg.includes('где найти')) {
    return {
      text: 'На платформе Горхон.Online вы можете:\n\n📞 Найти важные номера\n📍 Посмотреть контакты служб\n💬 Связаться с поддержкой\n\nВсё находится на главной странице. Прокрутите вниз для просмотра всех контактов.'
    };
  }
  
  if (msg.includes('проблем') || msg.includes('не работает') || msg.includes('ошибка') || msg.includes('баг')) {
    return {
      text: 'Понимаю, возникла техническая проблема. Попробуйте:\n\n1. Обновить страницу (F5)\n2. Очистить кеш браузера\n3. Проверить интернет-соединение\n\nЕсли проблема не решилась, обратитесь к нашему агенту — он поможет!',
      showAgentButton: true
    };
  }
  
  if (msg.includes('агент') || msg.includes('человек') || msg.includes('оператор') || msg.includes('живой')) {
    return {
      text: 'Хотите связаться с живым оператором? Наш агент готов помочь вам лично!',
      showAgentButton: true
    };
  }
  
  return {
    text: 'Спасибо за вопрос! Могу помочь с:\n\n• Поиском контактов на платформе\n• Техническими вопросами\n• Навигацией по сайту\n\nУточните, пожалуйста, что именно вас интересует?\n\nИли напишите нашему агенту для детальной консультации.',
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
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-t-2xl md:rounded-2xl w-full md:w-96 md:max-w-md h-[90vh] md:max-h-[80vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{backgroundColor: '#F1117E'}}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Icon name="Bot" size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Лина</h3>
              <p className="text-xs text-white/80">ИИ-помощник</p>
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
                  {msg.sender === 'user' ? 'Вы' : 'Лина (ИИ)'} • сейчас
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
      </div>
    </div>
  );
};

export default ChatModal;
