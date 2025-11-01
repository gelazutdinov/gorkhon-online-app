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
  isDark?: boolean;
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
    id: 'auto',
    name: 'Автоматическая',
    description: 'Следует системным настройкам',
    colors: {
      primary: '#F1117E',
      secondary: '#4ECDC4',
      accent: '#FFE066'
    },
    preview: 'bg-gradient-to-r from-gray-600 via-gorkhon-pink to-gray-800'
  },
  {
    id: 'dark',
    name: 'Темная',
    description: 'Элегантная темная тема',
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#EC4899'
    },
    preview: 'bg-gradient-to-r from-gray-800 to-gray-900',
    isDark: true
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
    description: 'Теплые розовые тона',
    colors: {
      primary: '#F97316',
      secondary: '#EA580C',
      accent: '#FB923C'
    },
    preview: 'bg-gradient-to-r from-pink-500 to-rose-600'
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
  }
];

const ThemeSelector = ({ onClose }: ThemeSelectorProps) => {
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  useEffect(() => {
    // Загружаем сохраненную тему
    const savedTheme = localStorage.getItem('gorkhon_theme');
    if (savedTheme) {
      setSelectedTheme(savedTheme);
    }

    // Определяем системные настройки темы
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
      // Если выбрана автоматическая тема, применяем изменения
      if (selectedTheme === 'auto') {
        applyAutoTheme(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [selectedTheme]);

  const applyAutoTheme = (isDark: boolean) => {
    const root = document.documentElement;
    
    if (isDark) {
      // Темная тема
      root.style.setProperty('--color-gorkhon-pink', '#6366F1');
      root.style.setProperty('--color-gorkhon-green', '#8B5CF6');
      root.style.setProperty('--color-gorkhon-blue', '#EC4899');
      document.body.classList.add('dark');
    } else {
      // Светлая тема (default)
      root.style.removeProperty('--color-gorkhon-pink');
      root.style.removeProperty('--color-gorkhon-green');
      root.style.removeProperty('--color-gorkhon-blue');
      document.body.classList.remove('dark');
    }
  };

  const applyTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;

    const root = document.documentElement;
    
    if (themeId === 'default') {
      // Возвращаем к исходным цветам
      root.style.removeProperty('--color-gorkhon-pink');
      root.style.removeProperty('--color-gorkhon-green');
      root.style.removeProperty('--color-gorkhon-blue');
      document.body.classList.remove('dark');
    } else if (themeId === 'auto') {
      // Применяем автоматическую тему
      applyAutoTheme(systemPrefersDark);
    } else {
      // Применяем выбранную тему
      root.style.setProperty('--color-gorkhon-pink', theme.colors.primary);
      root.style.setProperty('--color-gorkhon-green', theme.colors.secondary);
      root.style.setProperty('--color-gorkhon-blue', theme.colors.accent);
      
      if (theme.isDark) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
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

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl border border-white/20">
      {/* Заголовок */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-xl">
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

        {/* Системная информация */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Monitor" size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Системные настройки</span>
          </div>
          <p className="text-sm text-gray-600">
            Система предпочитает: {systemPrefersDark ? 'Темную тему' : 'Светлую тему'}
          </p>
        </div>

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
              <div className={`h-16 ${theme.preview} relative`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-2 left-3 text-white font-medium text-sm">
                  {theme.name}
                </div>
                {(previewTheme || selectedTheme) === theme.id && (
                  <div className="absolute top-2 right-2">
                    <Icon name="Check" size={16} className="text-white" />
                  </div>
                )}
                
                {/* Специальные иконки */}
                {theme.id === 'auto' && (
                  <div className="absolute bottom-2 right-2">
                    <Icon name="RefreshCw" size={14} className="text-white/80" />
                  </div>
                )}
                {theme.isDark && (
                  <div className="absolute bottom-2 right-2">
                    <Icon name="Moon" size={14} className="text-white/80" />
                  </div>
                )}
              </div>

              {/* Информация о теме */}
              <div className="p-3">
                <h4 className="font-medium text-gray-800 mb-1">{theme.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{theme.description}</p>
                
                {/* Дополнительная информация */}
                {theme.id === 'auto' && (
                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <Icon name="Smartphone" size={12} />
                    <span>Адаптируется к системе</span>
                  </div>
                )}
                
                {theme.isDark && (
                  <div className="flex items-center gap-1 text-xs text-purple-600">
                    <Icon name="Moon" size={12} />
                    <span>Темная тема</span>
                  </div>
                )}
                
                {/* Цветовая палитра */}
                <div className="flex gap-1 mt-2">
                  {Object.entries(theme.colors).map(([key, color]) => (
                    <div
                      key={key}
                      className="w-4 h-4 rounded-full border border-gray-300"
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
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Автоматическая</strong> - адаптируется к системным настройкам</li>
                <li>• <strong>Темная</strong> - комфортна для глаз в темное время</li>
                <li>• Ваш выбор сохраняется локально в браузере</li>
              </ul>
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