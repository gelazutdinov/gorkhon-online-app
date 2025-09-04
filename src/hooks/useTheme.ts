import { useState, useEffect } from 'react';

export type ThemeType = 'default' | 'dark' | 'blue';

interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    cardBackground: string;
    textPrimary: string;
    textSecondary: string;
  };
}

const themes: Record<ThemeType, ThemeConfig> = {
  default: {
    name: 'Стандартная',
    colors: {
      primary: 'from-gorkhon-pink to-gorkhon-green',
      secondary: 'text-gorkhon-blue',
      background: 'bg-gray-50',
      cardBackground: 'bg-white',
      textPrimary: 'text-gray-800',
      textSecondary: 'text-gray-600',
    }
  },
  dark: {
    name: 'Темная',
    colors: {
      primary: 'from-gray-700 to-gray-900',
      secondary: 'text-gray-300',
      background: 'bg-gray-900',
      cardBackground: 'bg-gray-800',
      textPrimary: 'text-gray-100',
      textSecondary: 'text-gray-300',
    }
  },
  blue: {
    name: 'Голубая',
    colors: {
      primary: 'from-blue-500 to-cyan-500',
      secondary: 'text-blue-600',
      background: 'bg-blue-50',
      cardBackground: 'bg-white',
      textPrimary: 'text-gray-800',
      textSecondary: 'text-blue-700',
    }
  }
};

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('gorkhon-theme');
    return (saved as ThemeType) || 'default';
  });

  useEffect(() => {
    localStorage.setItem('gorkhon-theme', currentTheme);
    
    // Применяем тему к документу
    const theme = themes[currentTheme];
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Тема применена успешно
  }, [currentTheme]);

  const changeTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
  };

  const getThemeConfig = (theme?: ThemeType) => {
    return themes[theme || currentTheme];
  };

  return {
    currentTheme,
    changeTheme,
    getThemeConfig,
    themes
  };
};