import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface HoroscopeData {
  love: string;
  career: string;
  health: string;
  lucky: {
    number: number;
    color: string;
    time: string;
  };
}

const horoscopeTexts = {
  love: [
    'Прекрасный день для новых знакомств и укрепления отношений',
    'Звезды благоволят романтическим встречам и открытым разговорам',
    'Время проявить больше внимания к близким людям',
    'Неожиданная встреча может изменить ваши планы на будущее',
    'Гармония в отношениях принесет радость и умиротворение'
  ],
  career: [
    'Звезды благоволят важным решениям и новым проектам',
    'Отличное время для карьерного роста и профессионального развития',
    'Творческий подход поможет решить сложные рабочие задачи',
    'Командная работа принесет неожиданные результаты',
    'Время для смелых инициатив и реализации амбициозных планов'
  ],
  health: [
    'Отличное время для занятий спортом и здорового образа жизни',
    'Прислушайтесь к своему организму и дайте ему необходимый отдых',
    'Правильное питание и режим дня укрепят ваше самочувствие',
    'Медитация и прогулки на свежем воздухе восстановят энергию',
    'Позитивный настрой станет лучшим лекарством от стресса'
  ]
};

const luckyColors = ['Синий', 'Зеленый', 'Золотой', 'Серебряный', 'Красный', 'Фиолетовый'];
const luckyTimes = ['утром', 'днем', 'вечером', 'на закате', 'в полдень'];

const HoroscopeWidget = () => {
  const [horoscope, setHoroscope] = useState<HoroscopeData>({
    love: '',
    career: '',
    health: '',
    lucky: {
      number: 7,
      color: 'Синий',
      time: 'утром'
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Генерируем случайный гороскоп
    const generateHoroscope = () => {
      const randomLove = horoscopeTexts.love[Math.floor(Math.random() * horoscopeTexts.love.length)];
      const randomCareer = horoscopeTexts.career[Math.floor(Math.random() * horoscopeTexts.career.length)];
      const randomHealth = horoscopeTexts.health[Math.floor(Math.random() * horoscopeTexts.health.length)];
      
      return {
        love: randomLove,
        career: randomCareer,
        health: randomHealth,
        lucky: {
          number: Math.floor(Math.random() * 100) + 1,
          color: luckyColors[Math.floor(Math.random() * luckyColors.length)],
          time: luckyTimes[Math.floor(Math.random() * luckyTimes.length)]
        }
      };
    };

    // Имитация загрузки
    const timer = setTimeout(() => {
      setHoroscope(generateHoroscope());
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="h-5 bg-white/20 rounded w-40 mb-2"></div>
              <div className="h-4 bg-white/10 rounded w-24"></div>
            </div>
            <div className="text-4xl">✨</div>
          </div>
          <div className="space-y-3">
            <div className="h-16 bg-white/10 rounded-lg"></div>
            <div className="h-16 bg-white/10 rounded-lg"></div>
            <div className="h-16 bg-white/10 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Icon name="Star" size={20} />
            Гороскоп на сегодня
          </h3>
          <p className="text-purple-100 text-sm">Общий прогноз</p>
        </div>
        <div className="text-4xl">✨</div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 hover:bg-white/25 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Heart" size={16} className="text-pink-200" />
            <span className="font-medium">Любовь</span>
          </div>
          <p className="text-sm text-purple-100 leading-relaxed">
            {horoscope.love}
          </p>
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 hover:bg-white/25 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Briefcase" size={16} className="text-yellow-200" />
            <span className="font-medium">Карьера</span>
          </div>
          <p className="text-sm text-purple-100 leading-relaxed">
            {horoscope.career}
          </p>
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 hover:bg-white/25 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Activity" size={16} className="text-green-200" />
            <span className="font-medium">Здоровье</span>
          </div>
          <p className="text-sm text-purple-100 leading-relaxed">
            {horoscope.health}
          </p>
        </div>
      </div>

      {/* Счастливые символы */}
      <div className="pt-4 border-t border-purple-400/30">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="Sparkles" size={14} className="text-yellow-200" />
          <span className="text-sm font-medium">Счастливые символы дня</span>
        </div>
        <div className="flex items-center justify-between text-sm text-purple-100">
          <div className="flex items-center gap-1">
            <span>Число:</span>
            <span className="font-bold text-yellow-200">{horoscope.lucky.number}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Цвет:</span>
            <span className="font-bold text-yellow-200">{horoscope.lucky.color}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Время:</span>
            <span className="font-bold text-yellow-200">{horoscope.lucky.time}</span>
          </div>
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="mt-4 pt-3 border-t border-purple-400/30">
        <div className="flex items-center justify-between text-xs text-purple-200">
          <span>Персональный прогноз</span>
          <div className="flex items-center gap-1">
            <Icon name="RotateCcw" size={10} />
            <span>Обновляется ежедневно</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoroscopeWidget;