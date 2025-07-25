const LinaAssistantCard = () => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-lg">
          🤖
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Лина - ваш AI помощник</h3>
          <p className="text-sm text-gray-600">Готова помочь 24/7 с любыми вопросами</p>
        </div>
      </div>
      <div className="text-sm text-gray-700 space-y-1">
        <p>• Техническая поддержка и решение проблем</p>
        <p>• Помощь с настройками аккаунта</p>
        <p>• Ответы на общие вопросы</p>
        <p>• При необходимости перевод на живого агента</p>
      </div>
    </div>
  );
};

export default LinaAssistantCard;