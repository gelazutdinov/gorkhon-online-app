import Icon from '@/components/ui/icon';

interface OrganizationalSecuritySectionProps {
  activeSection: string | null;
  toggleSection: (section: string) => void;
}

const OrganizationalSecuritySection = ({ activeSection, toggleSection }: OrganizationalSecuritySectionProps) => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => toggleSection('organizational-security')}
        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Icon name="Users" size={20} className="text-gorkhon-pink" />
          <span className="font-medium text-lg">Организационные меры</span>
        </div>
        <Icon 
          name={activeSection === 'organizational-security' ? 'ChevronUp' : 'ChevronDown'} 
          size={20} 
        />
      </button>
      {activeSection === 'organizational-security' && (
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gorkhon-blue mb-3">👥 Контроль доступа персонала</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Icon name="Key" size={14} className="text-gorkhon-pink" />
                    Принцип минимальных привилегий
                  </h5>
                  <p className="text-xs text-gray-600">
                    Каждый сотрудник имеет доступ только к необходимым для работы данным
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Icon name="Eye" size={14} className="text-gorkhon-pink" />
                    Журналирование действий
                  </h5>
                  <p className="text-xs text-gray-600">
                    Все действия с данными фиксируются в защищенных логах
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gorkhon-blue mb-3">📚 Обучение и политики</h4>
              <div className="bg-white p-4 rounded-lg">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <Icon name="GraduationCap" size={16} className="text-green-500 mt-0.5" />
                    <span>Регулярное обучение персонала основам информационной безопасности</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="FileText" size={16} className="text-green-500 mt-0.5" />
                    <span>Строгие внутренние политики обработки персональных данных</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="AlertTriangle" size={16} className="text-green-500 mt-0.5" />
                    <span>Немедленное реагирование на любые инциденты безопасности</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="RefreshCw" size={16} className="text-green-500 mt-0.5" />
                    <span>Регулярный аудит системы безопасности</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationalSecuritySection;