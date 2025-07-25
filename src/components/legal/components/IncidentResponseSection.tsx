import Icon from '@/components/ui/icon';

interface IncidentResponseSectionProps {
  activeSection: string | null;
  toggleSection: (section: string) => void;
}

const IncidentResponseSection = ({ activeSection, toggleSection }: IncidentResponseSectionProps) => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => toggleSection('incident-response')}
        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Icon name="AlertCircle" size={20} className="text-gorkhon-pink" />
          <span className="font-medium text-lg">Реагирование на инциденты</span>
        </div>
        <Icon 
          name={activeSection === 'incident-response' ? 'ChevronUp' : 'ChevronDown'} 
          size={20} 
        />
      </button>
      {activeSection === 'incident-response' && (
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gorkhon-blue mb-3">🚨 План действий при инцидентах</h4>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="bg-red-100 rounded-full p-2 w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                    <Icon name="AlertTriangle" size={20} className="text-red-600" />
                  </div>
                  <div className="font-medium text-sm">1. Обнаружение</div>
                  <div className="text-xs text-gray-600 mt-1">В течение 1 часа</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="bg-orange-100 rounded-full p-2 w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                    <Icon name="Shield" size={20} className="text-orange-600" />
                  </div>
                  <div className="font-medium text-sm">2. Изоляция</div>
                  <div className="text-xs text-gray-600 mt-1">Немедленно</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="bg-blue-100 rounded-full p-2 w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                    <Icon name="Search" size={20} className="text-blue-600" />
                  </div>
                  <div className="font-medium text-sm">3. Анализ</div>
                  <div className="text-xs text-gray-600 mt-1">В течение 24 часов</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="bg-green-100 rounded-full p-2 w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                    <Icon name="CheckCircle" size={20} className="text-green-600" />
                  </div>
                  <div className="font-medium text-sm">4. Устранение</div>
                  <div className="text-xs text-gray-600 mt-1">До 72 часов</div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <h4 className="font-medium text-amber-800 mb-3 flex items-center gap-2">
                <Icon name="Bell" size={20} />
                Уведомление пользователей
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-sm text-amber-700 mb-2">При серьезных инцидентах:</h5>
                  <ul className="text-xs text-amber-600 space-y-1">
                    <li>• Уведомление в течение 24 часов</li>
                    <li>• Email всем зарегистрированным пользователям</li>
                    <li>• Объявление на главной странице</li>
                    <li>• Детальный отчет о произошедшем</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm text-amber-700 mb-2">Информация в уведомлении:</h5>
                  <ul className="text-xs text-amber-600 space-y-1">
                    <li>• Описание инцидента</li>
                    <li>• Затронутые данные</li>
                    <li>• Принятые меры</li>
                    <li>• Рекомендации пользователям</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentResponseSection;