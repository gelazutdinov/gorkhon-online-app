import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface InterestsEditorProps {
  interests: string[];
  onSave: (interests: string[]) => void;
  onCancel: () => void;
}

const InterestsEditor = ({ interests, onSave, onCancel }: InterestsEditorProps) => {
  const [userInterests, setUserInterests] = useState<string[]>(interests);
  const [newInterest, setNewInterest] = useState('');

  const popularInterests = [
    '🏡 Дом и уют',
    '🌱 Садоводство',
    '🎣 Рыбалка',
    '🥘 Кулинария',
    '🎨 Творчество',
    '🏃‍♂️ Спорт',
    '📚 Чтение',
    '🎵 Музыка',
    '🎮 Игры',
    '🚗 Автомобили',
    '🛠️ Рукоделие',
    '📱 Технологии',
    '🎭 Театр',
    '🎬 Кино',
    '✈️ Путешествия',
    '🐕 Животные',
    '💼 Бизнес',
    '🏞️ Природа',
    '📸 Фотография',
    '🏋️‍♀️ Фитнес'
  ];

  const addInterest = (interest: string) => {
    if (!userInterests.includes(interest) && userInterests.length < 10) {
      setUserInterests([...userInterests, interest]);
    }
  };

  const removeInterest = (interest: string) => {
    setUserInterests(userInterests.filter(i => i !== interest));
  };

  const handleAddCustomInterest = () => {
    if (newInterest.trim() && !userInterests.includes(newInterest.trim()) && userInterests.length < 10) {
      setUserInterests([...userInterests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCustomInterest();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Ваши интересы</h3>
        <p className="text-sm text-gray-600">Добавьте до 10 интересов, чтобы другие жители могли вас найти</p>
      </div>

      {/* Выбранные интересы */}
      {userInterests.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Выбранные интересы ({userInterests.length}/10):</h4>
          <div className="flex flex-wrap gap-2">
            {userInterests.map((interest, idx) => (
              <button
                key={idx}
                onClick={() => removeInterest(interest)}
                className="flex items-center gap-1 px-3 py-1 bg-gorkhon-pink text-white rounded-full text-sm hover:bg-gorkhon-pink/90 transition-colors"
              >
                <span>{interest}</span>
                <Icon name="X" size={14} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Добавить свой интерес */}
      {userInterests.length < 10 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Добавить свой интерес:</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Введите ваш интерес..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
            />
            <button
              onClick={handleAddCustomInterest}
              disabled={!newInterest.trim() || userInterests.includes(newInterest.trim())}
              className="px-4 py-2 bg-gorkhon-blue text-white rounded-lg hover:bg-gorkhon-blue/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Icon name="Plus" size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Популярные интересы */}
      {userInterests.length < 10 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Популярные интересы:</h4>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {popularInterests
              .filter(interest => !userInterests.includes(interest))
              .map((interest, idx) => (
                <button
                  key={idx}
                  onClick={() => addInterest(interest)}
                  className="text-left px-3 py-2 bg-gray-100 hover:bg-gorkhon-pink/10 hover:text-gorkhon-pink rounded-lg transition-colors text-sm"
                >
                  {interest}
                </button>
              ))
            }
          </div>
        </div>
      )}

      {/* Кнопки сохранения */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={() => onSave(userInterests)}
          className="flex-1 px-4 py-2 bg-gorkhon-pink text-white rounded-lg hover:bg-gorkhon-pink/90 transition-colors font-medium"
        >
          Сохранить
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Отмена
        </button>
      </div>
    </div>
  );
};

export default InterestsEditor;