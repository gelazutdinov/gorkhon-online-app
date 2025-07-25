import Icon from '@/components/ui/icon';

interface DataNotStoredSectionProps {
  activeSection: string | null;
  toggleSection: (section: string) => void;
}

const DataNotStoredSection = ({ activeSection, toggleSection }: DataNotStoredSectionProps) => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => toggleSection('what-we-dont-store')}
        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Icon name="EyeOff" size={20} className="text-gorkhon-pink" />
          <span className="font-medium text-lg">Что мы НЕ собираем и НЕ храним</span>
        </div>
        <Icon 
          name={activeSection === 'what-we-dont-store' ? 'ChevronUp' : 'ChevronDown'} 
          size={20} 
        />
      </button>
      {activeSection === 'what-we-dont-store' && (
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h4 className="font-medium text-red-800 mb-4 flex items-center gap-2">
              <Icon name="ShieldX" size={20} />
              Мы принципиально НЕ собираем
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-red-700 mb-3">🚫 Конфиденциальная информация</h5>
                <ul className="space-y-2 text-sm text-red-600">
                  <li className="flex items-start gap-2">
                    <Icon name="X" size={14} className="mt-0.5" />
                    <span>Паспортные данные</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="X" size={14} className="mt-0.5" />
                    <span>Финансовые данные</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="X" size={14} className="mt-0.5" />
                    <span>Медицинские данные</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="X" size={14} className="mt-0.5" />
                    <span>Адрес проживания</span>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-red-700 mb-3">🚫 Поведенческие данные</h5>
                <ul className="space-y-2 text-sm text-red-600">
                  <li className="flex items-start gap-2">
                    <Icon name="X" size={14} className="mt-0.5" />
                    <span>История браузера</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="X" size={14} className="mt-0.5" />
                    <span>Данные с других сайтов</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="X" size={14} className="mt-0.5" />
                    <span>Геолокацию</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="X" size={14} className="mt-0.5" />
                    <span>Биометрические данные</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded border border-red-300">
              <p className="text-sm text-red-700 font-medium">
                💡 Мы собираем только минимально необходимые данные для работы портала
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataNotStoredSection;