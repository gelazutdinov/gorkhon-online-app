import Icon from '@/components/ui/icon';

interface ComplianceSectionProps {
  activeSection: string | null;
  toggleSection: (section: string) => void;
}

const ComplianceSection = ({ activeSection, toggleSection }: ComplianceSectionProps) => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => toggleSection('compliance')}
        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Icon name="Award" size={20} className="text-gorkhon-pink" />
          <span className="font-medium text-lg">Соответствие стандартам</span>
        </div>
        <Icon 
          name={activeSection === 'compliance' ? 'ChevronUp' : 'ChevronDown'} 
          size={20} 
        />
      </button>
      {activeSection === 'compliance' && (
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gorkhon-blue mb-4">📋 Соблюдаемые стандарты</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Icon name="Shield" size={16} className="text-green-600" />
                    Федеральный закон №152-ФЗ
                  </h5>
                  <p className="text-xs text-gray-600">
                    "О персональных данных" - полное соответствие требованиям 
                    российского законодательства по защите персональных данных
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Icon name="Globe" size={16} className="text-blue-600" />
                    Международные стандарты
                  </h5>
                  <p className="text-xs text-gray-600">
                    Следуем лучшим мировым практикам информационной безопасности 
                    и защиты приватности пользователей
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                <Icon name="FileCheck" size={20} />
                Регулярные аудиты
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded text-center">
                  <Icon name="Calendar" size={16} className="text-blue-600 mx-auto mb-1" />
                  <div className="text-sm font-medium">Ежемесячно</div>
                  <div className="text-xs text-gray-600">Внутренний аудит</div>
                </div>
                <div className="bg-white p-3 rounded text-center">
                  <Icon name="Users" size={16} className="text-blue-600 mx-auto mb-1" />
                  <div className="text-sm font-medium">Раз в квартал</div>
                  <div className="text-xs text-gray-600">Внешний аудит</div>
                </div>
                <div className="bg-white p-3 rounded text-center">
                  <Icon name="TrendingUp" size={16} className="text-blue-600 mx-auto mb-1" />
                  <div className="text-sm font-medium">Ежегодно</div>
                  <div className="text-xs text-gray-600">Сертификация</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceSection;