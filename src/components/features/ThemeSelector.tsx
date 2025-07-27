import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  preview: string;
}

interface ThemeSelectorProps {
  onClose: () => void;
}

const themes: Theme[] = [
  {
    id: 'default',
    name: 'Горхон Классик',
    description: 'Фирменные цвета платформы',
    colors: {
      primary: '#F1117E',
      secondary: '#4ECDC4',
      accent: '#FFE066'
    },
    preview: 'bg-gradient-to-r from-gorkhon-pink to-gorkhon-green'
  },
  {
    id: 'nature',
    name: 'Природа',
    description: 'Зеленые оттенки природы',
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#34D399'
    },
    preview: 'bg-gradient-to-r from-green-500 to-emerald-600'
  },
  {
    id: 'ocean',
    name: 'Океан',
    description: 'Синие тона морской волны',
    colors: {
      primary: '#0EA5E9',
      secondary: '#0284C7',
      accent: '#38BDF8'
    },
    preview: 'bg-gradient-to-r from-sky-500 to-blue-600'
  },
  {
    id: 'sunset',
    name: 'Закат',
    description: 'Теплые оранжевые тона',
    colors: {
      primary: '#F97316',
      secondary: '#EA580C',
      accent: '#FB923C'
    },
    preview: 'bg-gradient-to-r from-orange-500 to-orange-600'
  },
  {
    id: 'purple',
    name: 'Фиолетовый',
    description: 'Элегантные фиолетовые оттенки',
    colors: {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      accent: '#A78BFA'
    },
    preview: 'bg-gradient-to-r from-violet-500 to-purple-600'
  },
  {
    id: 'dark',
    name: 'Темная тема',
    description: 'Элегантная темная тема',
    colors: {
      primary: '#374151',
      secondary: '#1F2937',
      accent: '#6B7280'
    },
    preview: 'bg-gradient-to-r from-gray-700 to-gray-800'
  }
];

const ThemeSelector = ({ onClose }: ThemeSelectorProps) => {
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);

  useEffect(() => {
    // Загружаем сохраненную тему
    const savedTheme = localStorage.getItem('gorkhon_theme');
    if (savedTheme) {
      setSelectedTheme(savedTheme);
    }
  }, []);

  const applyTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;

    // Применяем CSS переменные для темы
    const root = document.documentElement;
    
    if (themeId === 'default') {
      // Возвращаем к исходным цветам
      root.style.removeProperty('--color-gorkhon-pink');
      root.style.removeProperty('--color-gorkhon-green');
      root.style.removeProperty('--color-gorkhon-blue');
    } else {
      root.style.setProperty('--color-gorkhon-pink', theme.colors.primary);
      root.style.setProperty('--color-gorkhon-green', theme.colors.secondary);
      root.style.setProperty('--color-gorkhon-blue', theme.colors.accent);
    }

    // Сохраняем выбор
    setSelectedTheme(themeId);
    localStorage.setItem('gorkhon_theme', themeId);
  };

  const previewThemeTemporary = (themeId: string) => {
    setPreviewTheme(themeId);
    applyTheme(themeId);
  };

  const resetPreview = () => {
    if (previewTheme) {
      applyTheme(selectedTheme);
      setPreviewTheme(null);
    }
  };

  const confirmTheme = () => {
    if (previewTheme) {
      setSelectedTheme(previewTheme);
      localStorage.setItem('gorkhon_theme', previewTheme);
      setPreviewTheme(null);
    }
    onClose();
  };

  const getContrastColor = (hexColor: string) => {
    // Простая функция для определения контрастного цвета
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl border border-white/20">
      {/* Заголовок */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Темы оформления</h2>
        <div className="flex items-center gap-2">
          {previewTheme && (
            <button
              onClick={resetPreview}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Сбросить
            </button>
          )}
          <button
            onClick={previewTheme ? confirmTheme : onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name={previewTheme ? "Check" : "X"} size={20} className="text-gray-500" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {previewTheme && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Icon name="Eye" size={16} className="text-blue-600" />
              <span className="text-sm text-blue-700">Режим предпросмотра активен</span>
            </div>
          </div>
        )}

        <div className="grid gap-3">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`relative border-2 rounded-xl overflow-hidden transition-all cursor-pointer hover:shadow-md ${
                (previewTheme || selectedTheme) === theme.id
                  ? 'border-gorkhon-pink shadow-lg'
                  : 'border-gray-200'
              }`}
              onClick={() => previewThemeTemporary(theme.id)}
            >
              {/* Превью цветов */}
              <div className={`h-20 ${theme.preview} relative`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-2 left-2 text-white font-medium">
                  {theme.name}
                </div>
                {(previewTheme || selectedTheme) === theme.id && (
                  <div className="absolute top-2 right-2">
                    <Icon name="Check" size={20} className="text-white" />
                  </div>
                )}
              </div>

              {/* Информация о теме */}
              <div className="p-4">
                <h4 className="font-medium text-gray-800 mb-1">{theme.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{theme.description}</p>
                
                {/* Цветовая палитра */}
                <div className="flex gap-2">
                  {Object.entries(theme.colors).map(([key, color]) => (
                    <div
                      key={key}
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                      title={`${key}: ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Информация */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-gray-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-800 mb-1">О темах</h4>
              <p className="text-sm text-gray-600">
                Темы изменяют цветовую схему всего приложения. 
                Ваш выбор сохраняется локально в браузере.
              </p>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        {previewTheme && (
          <div className="flex gap-3 pt-4">
            <button
              onClick={resetPreview}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={confirmTheme}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white rounded-lg hover:shadow-lg transition-all"
            >
              Применить тему
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSelector;