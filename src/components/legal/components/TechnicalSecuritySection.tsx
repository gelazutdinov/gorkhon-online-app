import Icon from '@/components/ui/icon';

interface TechnicalSecuritySectionProps {
  activeSection: string | null;
  toggleSection: (section: string) => void;
}

const TechnicalSecuritySection = ({ activeSection, toggleSection }: TechnicalSecuritySectionProps) => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => toggleSection('technical-security')}
        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Icon name="Server" size={20} className="text-gorkhon-pink" />
          <span className="font-medium text-lg">Технические меры защиты</span>
        </div>
        <Icon 
          name={activeSection === 'technical-security' ? 'ChevronUp' : 'ChevronDown'} 
          size={20} 
        />
      </button>
      {activeSection === 'technical-security' && (
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gorkhon-blue mb-3">🔐 Шифрование данных</h4>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg border-l-4 border-green-500">
                  <h5 className="font-medium text-sm mb-1">SSL/TLS шифрование</h5>
                  <p className="text-xs text-gray-600">
                    Все данные передаются по защищенному каналу с 256-битным шифрованием
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-green-500">
                  <h5 className="font-medium text-sm mb-1">Локальное хранение</h5>
                  <p className="text-xs text-gray-600">
                    Персональные данные хранятся в зашифрованном виде в localStorage браузера
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-green-500">
                  <h5 className="font-medium text-sm mb-1">HTTPS-соединение</h5>
                  <p className="text-xs text-gray-600">
                    Обязательное использование защищенного протокола для всех операций
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gorkhon-blue mb-3">🛡️ Защита инфраструктуры</h4>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg border-l-4 border-blue-500">
                  <h5 className="font-medium text-sm mb-1">Firewall</h5>
                  <p className="text-xs text-gray-600">
                    Многоуровневые межсетевые экраны блокируют несанкционированный доступ
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-blue-500">
                  <h5 className="font-medium text-sm mb-1">Антивирусная защита</h5>
                  <p className="text-xs text-gray-600">
                    Постоянное сканирование на предмет вредоносного ПО
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-blue-500">
                  <h5 className="font-medium text-sm mb-1">Резервное копирование</h5>
                  <p className="text-xs text-gray-600">
                    Ежедневное создание зашифрованных резервных копий
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicalSecuritySection;