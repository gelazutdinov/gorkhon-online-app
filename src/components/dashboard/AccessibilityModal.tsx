import Icon from '@/components/ui/icon';

interface AccessibilityModalProps {
  onClose: () => void;
}

const AccessibilityModal = ({ onClose }: AccessibilityModalProps) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-md max-h-[75vh] overflow-y-auto shadow-2xl border border-white/20">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-gray-800">Настройки доступности</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="X" size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Размер шрифта */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Размер текста</h3>
            <div className="space-y-2">
              <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors">
                <span className="text-sm">Маленький текст</span>
              </button>
              <button className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg text-left transition-colors">
                <span className="text-base font-medium">Обычный текст (текущий)</span>
              </button>
              <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors">
                <span className="text-lg">Крупный текст</span>
              </button>
            </div>
          </div>

          {/* Контрастность */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Контрастность</h3>
            <div className="space-y-2">
              <button className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg text-left transition-colors">
                <div className="flex items-center justify-between">
                  <span>Обычная контрастность</span>
                  <Icon name="Check" size={16} className="text-blue-600" />
                </div>
              </button>
              <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors">
                <span>Высокая контрастность</span>
              </button>
            </div>
          </div>

          {/* Анимации */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Анимации</h3>
            <div className="space-y-2">
              <button className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg text-left transition-colors">
                <div className="flex items-center justify-between">
                  <span>Включены</span>
                  <Icon name="Check" size={16} className="text-blue-600" />
                </div>
              </button>
              <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors">
                <span>Уменьшенные анимации</span>
              </button>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={16} className="text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-800 mb-1">В разработке</h4>
                <p className="text-sm text-orange-700">
                  Функции доступности находятся в активной разработке. 
                  Скоро будут доступны дополнительные настройки.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityModal;