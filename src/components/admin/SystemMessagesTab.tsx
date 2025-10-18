import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { SystemMessage } from './types';

interface SystemMessagesTabProps {
  systemMessages: SystemMessage[];
  newMessageText: string;
  setNewMessageText: (text: string) => void;
  addSystemMessage: () => void;
  deleteSystemMessage: (id: string) => void;
}

const SystemMessagesTab = ({
  systemMessages,
  newMessageText,
  setNewMessageText,
  addSystemMessage,
  deleteSystemMessage
}: SystemMessagesTabProps) => {
  return (
    <Card className="border-2 border-blue-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardTitle className="flex items-center gap-3 text-blue-700">
          <Icon name="MessageSquare" size={24} />
          <div>
            <div>Системный чат (Офлайн)</div>
            <p className="text-sm font-normal text-gray-600 mt-1">
              Сообщения отображаются у пользователей в чате с Линой
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            📢 Новое сообщение для пользователей
          </label>
          <Textarea
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            placeholder="Введите текст объявления..."
            className="mb-4 min-h-[100px] border-blue-300 focus:border-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                addSystemMessage();
              }
            }}
          />
          <Button 
            onClick={addSystemMessage}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg"
          >
            <Icon name="Send" size={18} className="mr-2" />
            Опубликовать (Ctrl+Enter)
          </Button>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <Icon name="List" size={18} />
            Опубликованные сообщения ({systemMessages.length})
          </h3>
          {systemMessages.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Icon name="MessageSquare" size={48} className="mx-auto mb-3 opacity-30" />
              <p>Нет опубликованных сообщений</p>
            </div>
          ) : (
            systemMessages.map(msg => (
              <div key={msg.id} className="group bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-blue-300 transition-all shadow-sm hover:shadow-md">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg">
                        Системное
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <p className="text-gray-800 leading-relaxed">{msg.text}</p>
                  </div>
                  <Button
                    onClick={() => deleteSystemMessage(msg.id)}
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemMessagesTab;
