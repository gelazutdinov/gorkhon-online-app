import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { birthdayAI, BirthdayGreeting as GreetingType } from '@/utils/birthdaySystem';

interface BirthdayGreetingProps {
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
}

const BirthdayGreeting = ({ name, birthDate, gender }: BirthdayGreetingProps) => {
  const [greeting, setGreeting] = useState<GreetingType | null>(null);
  const [showGreeting, setShowGreeting] = useState(false);
  const [zodiac, setZodiac] = useState<{ sign: string; emoji: string; description: string } | null>(null);

  useEffect(() => {
    // Проверяем поздравление при загрузке
    const greetingData = birthdayAI.generateGreeting(name, birthDate, gender);
    if (greetingData) {
      setGreeting(greetingData);
      setShowGreeting(true);
    }

    // Получаем знак зодиака
    const zodiacData = birthdayAI.getZodiacSign(birthDate);
    setZodiac(zodiacData);

    // Проверяем поздравление каждый день
    const checkInterval = setInterval(() => {
      const newGreeting = birthdayAI.generateGreeting(name, birthDate, gender);
      if (newGreeting && (!greeting || newGreeting.type !== greeting.type)) {
        setGreeting(newGreeting);
        setShowGreeting(true);
      }
    }, 1000 * 60 * 60); // Каждый час

    return () => clearInterval(checkInterval);
  }, [name, birthDate, gender]);

  if (!showGreeting || !greeting) return null;

  const getGreetingStyle = () => {
    switch (greeting.type) {
      case 'birthday':
        return 'bg-gradient-to-r from-pink-500 to-purple-600 text-white';
      case 'age_milestone':
        return 'bg-gradient-to-r from-yellow-400 to-pink-500 text-white';
      case 'upcoming':
        return 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`relative rounded-2xl p-6 shadow-xl ${getGreetingStyle()} animate-fadeIn`}>
      <button
        onClick={() => setShowGreeting(false)}
        className="absolute top-2 right-2 p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
      >
        <Icon name="X" size={16} />
      </button>

      <div className="space-y-4">
        {/* Основное поздравление */}
        <div className="text-center">
          <div className="text-4xl mb-3">{greeting.emoji}</div>
          <p className="text-lg font-medium leading-relaxed">
            {greeting.message}
          </p>
        </div>

        {/* Знак зодиака для именинника */}
        {greeting.type === 'birthday' && zodiac && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl mb-2">{zodiac.emoji}</div>
              <p className="text-sm opacity-90">
                Знак зодиака: {zodiac.sign}
              </p>
              <p className="text-xs opacity-75 mt-1">
                {zodiac.description}
              </p>
            </div>
          </div>
        )}

        {/* Подпись */}
        <div className="text-center text-sm opacity-90 mt-4">
          С наилучшими пожеланиями,<br />
          Команда Горхон.Online 💖
        </div>
      </div>

      {/* Конфетти для дня рождения */}
      {greeting.type === 'birthday' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              {['🎉', '🎊', '🎈', '✨'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BirthdayGreeting;