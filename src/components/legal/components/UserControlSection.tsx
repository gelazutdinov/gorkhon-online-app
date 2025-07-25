import Icon from '@/components/ui/icon';

interface UserControlSectionProps {
  activeSection: string | null;
  toggleSection: (section: string) => void;
}

const UserControlSection = ({ activeSection, toggleSection }: UserControlSectionProps) => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => toggleSection('user-control')}
        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Icon name="Settings" size={20} className="text-gorkhon-pink" />
          <span className="font-medium text-lg">Ваш контроль над данными</span>
        </div>
        <Icon 
          name={activeSection === 'user-control' ? 'ChevronUp' : 'ChevronDown'} 
          size={20} 
        />
      </button>
      {activeSection === 'user-control' && (
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                <Icon name="UserCog" size={20} />
                Вы полностью контролируете свои данные
              </h4>
              <p className="text-green-700 text-sm">
                Все ваши персональные данные хранятся локально в браузере. 
                Вы можете в любой момент их просмотреть, изменить или удалить.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium text-gorkhon-blue mb-3 flex items-center gap-2">
                  <Icon name="Eye" size={16} />
                  Просмотр данных
                </h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• В личном кабинете</li>
                  <li>• В настройках браузера</li>
                  <li>• По запросу в поддержку</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium text-gorkhon-blue mb-3 flex items-center gap-2">
                  <Icon name="Edit" size={16} />
                  Изменение данных
                </h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Редактирование профиля</li>
                  <li>• Обновление контактов</li>
                  <li>• Настройка уведомлений</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h5 className="font-medium text-gorkhon-blue mb-3 flex items-center gap-2">
                <Icon name="Trash2" size={16} />
                Удаление данных
              </h5>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <Icon name="RotateCcw" size={20} className="text-gray-600 mx-auto mb-2" />
                  <div className="text-sm font-medium">Очистка данных</div>
                  <div className="text-xs text-gray-600">Удаление из браузера</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <Icon name="UserX" size={20} className="text-gray-600 mx-auto mb-2" />
                  <div className="text-sm font-medium">Удаление аккаунта</div>
                  <div className="text-xs text-gray-600">Полное удаление</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <Icon name="Download" size={20} className="text-gray-600 mx-auto mb-2" />
                  <div className="text-sm font-medium">Экспорт данных</div>
                  <div className="text-xs text-gray-600">Получение копии</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserControlSection;