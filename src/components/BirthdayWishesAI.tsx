import { useState, useEffect } from 'react';
import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';

interface BirthdayWishesAIProps {
  user: UserProfile;
}

interface BirthdayWish {
  id: string;
  message: string;
  date: string;
  from: string;
  type: 'birthday' | 'reminder';
}

// Знаки зодиака и их характеристики
const zodiacSigns = {
  aries: { name: 'Овен', emoji: '♈', period: '21.03-19.04', traits: 'энергичный, решительный, лидер' },
  taurus: { name: 'Телец', emoji: '♉', period: '20.04-20.05', traits: 'упорный, надежный, практичный' },
  gemini: { name: 'Близнецы', emoji: '♊', period: '21.05-20.06', traits: 'общительный, любознательный, гибкий' },
  cancer: { name: 'Рак', emoji: '♋', period: '21.06-22.07', traits: 'заботливый, интуитивный, эмоциональный' },
  leo: { name: 'Лев', emoji: '♌', period: '23.07-22.08', traits: 'яркий, творческий, великодушный' },
  virgo: { name: 'Дева', emoji: '♍', period: '23.08-22.09', traits: 'аналитичный, внимательный, перфекционист' },
  libra: { name: 'Весы', emoji: '♎', period: '23.09-22.10', traits: 'справедливый, дипломатичный, гармоничный' },
  scorpio: { name: 'Скорпион', emoji: '♏', period: '23.10-21.11', traits: 'страстный, проницательный, целеустремленный' },
  sagittarius: { name: 'Стрелец', emoji: '♐', period: '22.11-21.12', traits: 'оптимистичный, свободолюбивый, философский' },
  capricorn: { name: 'Козерог', emoji: '♑', period: '22.12-19.01', traits: 'амбициозный, дисциплинированный, мудрый' },
  aquarius: { name: 'Водолей', emoji: '♒', period: '20.01-18.02', traits: 'независимый, новаторский, гуманный' },
  pisces: { name: 'Рыбы', emoji: '♓', period: '19.02-20.03', traits: 'творческий, сочувствующий, мечтательный' }
};

const BirthdayWishesAI = ({ user }: BirthdayWishesAIProps) => {
  const [wishes, setWishes] = useState<BirthdayWish[]>([]);
  const [showWishModal, setShowWishModal] = useState(false);
  const [todayWish, setTodayWish] = useState<BirthdayWish | null>(null);

  // Получение знака зодиака
  const getZodiacSign = (birthDate: string) => {
    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacSigns.aries;
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacSigns.taurus;
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacSigns.gemini;
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacSigns.cancer;
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacSigns.leo;
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacSigns.virgo;
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacSigns.libra;
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacSigns.scorpio;
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return zodiacSigns.sagittarius;
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacSigns.capricorn;
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacSigns.aquarius;
    return zodiacSigns.pisces;
  };

  // Вычисление возраста
  const getAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Вычисление дней до дня рождения
  const getDaysToBirthday = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const thisYear = today.getFullYear();
    
    // Устанавливаем день рождения в этом году
    const birthdayThisYear = new Date(thisYear, birth.getMonth(), birth.getDate());
    
    // Если день рождения уже прошел в этом году, считаем до следующего года
    if (birthdayThisYear < today) {
      birthdayThisYear.setFullYear(thisYear + 1);
    }
    
    const diffTime = birthdayThisYear.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Генерация персонализированного поздравления
  const generateBirthdayWish = (user: UserProfile) => {
    const age = getAge(user.birthDate);
    const zodiac = getZodiacSign(user.birthDate);
    const isMale = user.gender === 'male';
    
    const wishes = isMale ? [
      `🎉 С днем рождения, ${user.name}! Поздравляем с ${age}-летием! Как настоящий ${zodiac.name} (${zodiac.traits}), ты продолжаешь вдохновлять нас каждый день. Пусть новый год жизни принесет множество побед и свершений! 🚀`,
      
      `🎂 Дорогой ${user.name}! От всей команды Горхон поздравляем тебя с ${age}-летием! Твой знак ${zodiac.name} ${zodiac.emoji} наделил тебя удивительными качествами: ${zodiac.traits}. Желаем, чтобы все твои планы воплотились в реальность! 🌟`,
      
      `🎈 С праздником, ${user.name}! ${age} лет - это отличный возраст для новых достижений! Как истинный ${zodiac.name}, ты всегда ${zodiac.traits}. Пусть этот год станет самым ярким в твоей жизни! 🎯`,
      
      `🥳 Поздравляем с днем рождения нашего замечательного ${user.name}! В свои ${age} лет ты показываешь лучшие качества ${zodiac.name}: ${zodiac.traits}. Команда Горхон желает тебе здоровья, счастья и исполнения всех мечтаний! 💫`
    ] : [
      `🎉 С днем рождения, дорогая ${user.name}! Поздравляем с ${age}-летием! Как прекрасная ${zodiac.name} (${zodiac.traits}), ты освещаешь наш мир своей энергией. Пусть новый год жизни будет полон радости и волшебства! ✨`,
      
      `🎂 Милая ${user.name}! От всей команды Горхон поздравляем тебя с ${age}-летием! Твой знак ${zodiac.name} ${zodiac.emoji} одарил тебя прекрасными качествами: ${zodiac.traits}. Желаем, чтобы каждый день приносил новые поводы для улыбки! 🌸`,
      
      `🎈 С праздником, замечательная ${user.name}! ${age} лет - прекрасный возраст для новых открытий! Как настоящая ${zodiac.name}, ты всегда ${zodiac.traits}. Пусть этот год подарит тебе массу счастливых моментов! 🦄`,
      
      `🥳 Поздравляем с днем рождения нашу прекрасную ${user.name}! В свои ${age} лет ты воплощаешь лучшие черты ${zodiac.name}: ${zodiac.traits}. Команда Горхон желает тебе любви, вдохновения и осуществления всех желаний! 💝`
    ];

    return wishes[Math.floor(Math.random() * wishes.length)];
  };

  // Генерация напоминания
  const generateReminder = (user: UserProfile, days: number) => {
    const zodiac = getZodiacSign(user.birthDate);
    const nextAge = getAge(user.birthDate) + 1;
    
    if (days <= 7) {
      return `🎊 Скоро день рождения у ${user.name}! Через ${days} ${days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'} нашему ${zodiac.name} ${zodiac.emoji} исполнится ${nextAge} ${nextAge % 10 === 1 && nextAge % 100 !== 11 ? 'год' : nextAge % 10 < 5 && (nextAge % 100 < 10 || nextAge % 100 > 20) ? 'года' : 'лет'}! Не забудьте поздравить! 🎁`;
    }
    
    return `📅 До дня рождения ${user.name} остается ${days} дней. Готовимся поздравить нашего замечательного представителя знака ${zodiac.name}! 🌟`;
  };

  // Проверка и создание поздравлений
  useEffect(() => {
    if (!user.birthDate) return;

    const savedWishes = localStorage.getItem(`wishes_${user.id}`);
    if (savedWishes) {
      setWishes(JSON.parse(savedWishes));
    }

    const daysToBirthday = getDaysToBirthday(user.birthDate);
    const today = new Date().toDateString();

    // Проверяем, есть ли уже поздравление на сегодня
    const existingTodayWish = wishes.find(w => 
      new Date(w.date).toDateString() === today && w.type === 'birthday'
    );

    // Если сегодня день рождения и еще нет поздравления
    if (daysToBirthday === 0 && !existingTodayWish) {
      const birthdayWish: BirthdayWish = {
        id: `birthday_${Date.now()}`,
        message: generateBirthdayWish(user),
        date: new Date().toISOString(),
        from: 'Команда Горхон Online 🚀',
        type: 'birthday'
      };

      const newWishes = [birthdayWish, ...wishes];
      setWishes(newWishes);
      setTodayWish(birthdayWish);
      setShowWishModal(true);
      localStorage.setItem(`wishes_${user.id}`, JSON.stringify(newWishes));
    }

    // Напоминания за 7 и 30 дней
    if ([7, 30].includes(daysToBirthday)) {
      const existingReminder = wishes.find(w => 
        new Date(w.date).toDateString() === today && w.type === 'reminder'
      );

      if (!existingReminder) {
        const reminderWish: BirthdayWish = {
          id: `reminder_${Date.now()}`,
          message: generateReminder(user, daysToBirthday),
          date: new Date().toISOString(),
          from: 'Система напоминаний Горхон 🔔',
          type: 'reminder'
        };

        const newWishes = [reminderWish, ...wishes];
        setWishes(newWishes);
        localStorage.setItem(`wishes_${user.id}`, JSON.stringify(newWishes));
      }
    }
  }, [user, wishes]);

  const zodiac = user.birthDate ? getZodiacSign(user.birthDate) : null;
  const daysToBirthday = user.birthDate ? getDaysToBirthday(user.birthDate) : null;

  return (
    <>
      {/* Информация о дне рождения */}
      {user.birthDate && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Icon name="Gift" size={18} className="text-purple-600" />
              День рождения
            </h3>
            {wishes.length > 0 && (
              <button
                onClick={() => setShowWishModal(true)}
                className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
              >
                <Icon name="MessageSquare" size={14} />
                {wishes.length} {wishes.length === 1 ? 'сообщение' : 'сообщений'}
              </button>
            )}
          </div>

          <div className="space-y-3">
            {zodiac && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">{zodiac.emoji}</span>
                <div>
                  <p className="font-medium text-gray-800">{zodiac.name}</p>
                  <p className="text-sm text-gray-600">{zodiac.traits}</p>
                </div>
              </div>
            )}

            {daysToBirthday !== null && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {daysToBirthday === 0 ? '🎉' : daysToBirthday <= 7 ? '🎂' : '📅'}
                </span>
                <div>
                  <p className="font-medium text-gray-800">
                    {daysToBirthday === 0 
                      ? 'Сегодня день рождения!' 
                      : `До дня рождения: ${daysToBirthday} ${daysToBirthday === 1 ? 'день' : daysToBirthday < 5 ? 'дня' : 'дней'}`
                    }
                  </p>
                  <p className="text-sm text-gray-600">
                    {getAge(user.birthDate)} {getAge(user.birthDate) % 10 === 1 && getAge(user.birthDate) % 100 !== 11 ? 'год' : getAge(user.birthDate) % 10 < 5 && (getAge(user.birthDate) % 100 < 10 || getAge(user.birthDate) % 100 > 20) ? 'года' : 'лет'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Модальное окно поздравлений */}
      {showWishModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Icon name="Gift" size={24} className="text-purple-600" />
                  Поздравления от команды
                </h2>
                <button
                  onClick={() => setShowWishModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Icon name="X" size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                {wishes.map((wish) => (
                  <div
                    key={wish.id}
                    className={`p-4 rounded-xl border-2 ${
                      wish.type === 'birthday' 
                        ? 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-sm text-gray-600">{wish.from}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(wish.date).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <p className="text-gray-800 leading-relaxed">{wish.message}</p>
                  </div>
                ))}
              </div>

              {daysToBirthday === 0 && todayWish && (
                <div className="mt-6 text-center">
                  <div className="text-4xl mb-2">🎊</div>
                  <button
                    onClick={() => {
                      // Простая анимация конфетти
                      const colors = ['#ff69b4', '#ff1493', '#ffd700', '#00ff00', '#00bfff'];
                      for (let i = 0; i < 50; i++) {
                        setTimeout(() => {
                          const confetti = document.createElement('div');
                          confetti.style.position = 'fixed';
                          confetti.style.left = Math.random() * 100 + 'vw';
                          confetti.style.top = '-10px';
                          confetti.style.width = '10px';
                          confetti.style.height = '10px';
                          confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                          confetti.style.borderRadius = '50%';
                          confetti.style.pointerEvents = 'none';
                          confetti.style.animation = 'fall 3s linear forwards';
                          document.body.appendChild(confetti);
                          
                          setTimeout(() => confetti.remove(), 3000);
                        }, i * 50);
                      }
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all"
                  >
                    Запустить конфетти! 🎉
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
          }
        }
      `}</style>
    </>
  );
};

export default BirthdayWishesAI;