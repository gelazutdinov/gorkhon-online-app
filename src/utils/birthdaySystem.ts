export interface BirthdayGreeting {
  message: string;
  emoji: string;
  type: 'birthday' | 'age_milestone' | 'upcoming';
}

export class BirthdayAI {
  private getAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  private isBirthdayToday(birthDate: string): boolean {
    const today = new Date();
    const birth = new Date(birthDate);
    
    return today.getMonth() === birth.getMonth() && 
           today.getDate() === birth.getDate();
  }

  private getDaysUntilBirthday(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    const thisYear = today.getFullYear();
    
    const birthdayThisYear = new Date(thisYear, birth.getMonth(), birth.getDate());
    
    if (birthdayThisYear < today) {
      birthdayThisYear.setFullYear(thisYear + 1);
    }
    
    const diffTime = birthdayThisYear.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private generateBirthdayMessage(name: string, age: number, gender: 'male' | 'female'): string {
    const maleMessages = [
      `🎉 С Днем Рождения, ${name}! Поздравляем с ${age}-летием от всей команды Горхон.Online!`,
      `🎂 Уважаемый ${name}, от души поздравляем Вас с ${age}-летием! Желаем крепкого здоровья и благополучия!`,
      `🎈 ${name}, примите наши искренние поздравления с Днем Рождения! ${age} лет - это здорово!`,
      `🎊 Дорогой ${name}! В этот особенный день желаем Вам счастья, здоровья и всех благ! С ${age}-летием!`
    ];

    const femaleMessages = [
      `🎉 С Днем Рождения, ${name}! Поздравляем с ${age}-летием от всей команды Горхон.Online!`,
      `🎂 Уважаемая ${name}, от души поздравляем Вас с ${age}-летием! Желаем крепкого здоровья и благополучия!`,
      `🎈 ${name}, примите наши искренние поздравления с Днем Рождения! ${age} лет - это замечательно!`,
      `🎊 Дорогая ${name}! В этот особенный день желаем Вам счастья, здоровья и всех благ! С ${age}-летием!`
    ];

    const messages = gender === 'male' ? maleMessages : femaleMessages;
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private generateAgeMessage(name: string, age: number, gender: 'male' | 'female'): string {
    const milestones = {
      18: gender === 'male' ? 'Совершеннолетие - важная веха!' : 'Совершеннолетие - важная веха!',
      25: 'Четверть века позади - впереди много интересного!',
      30: 'Зрелость и мудрость - ваши главные достижения!',
      40: 'Золотая середина жизни - время новых свершений!',
      50: 'Полувековой юбилей - повод для гордости!',
      60: 'Мудрость и опыт - ваши сокровища!',
      70: 'Семь десятилетий жизни - это целая эпоха!',
      80: 'Восемь десятилетий мудрости и опыта!'
    };

    if (milestones[age as keyof typeof milestones]) {
      return `🌟 ${name}, ${milestones[age as keyof typeof milestones]}`;
    }

    return '';
  }

  private generateUpcomingMessage(name: string, daysLeft: number): string {
    if (daysLeft <= 7) {
      return `🎁 ${name}, до вашего Дня Рождения осталось всего ${daysLeft} ${this.getDaysWord(daysLeft)}! Готовимся к празднику!`;
    }
    
    if (daysLeft <= 30) {
      return `📅 ${name}, ваш День Рождения через ${daysLeft} ${this.getDaysWord(daysLeft)}. Команда Горхон.Online уже готовит поздравления!`;
    }

    return '';
  }

  private getDaysWord(days: number): string {
    if (days === 1) return 'день';
    if (days >= 2 && days <= 4) return 'дня';
    return 'дней';
  }

  public generateGreeting(name: string, birthDate: string, gender: 'male' | 'female'): BirthdayGreeting | null {
    const age = this.getAge(birthDate);
    const daysUntil = this.getDaysUntilBirthday(birthDate);
    
    // Сегодня день рождения
    if (this.isBirthdayToday(birthDate)) {
      return {
        message: this.generateBirthdayMessage(name, age, gender),
        emoji: '🎉',
        type: 'birthday'
      };
    }

    // Важная дата (круглая дата)
    const ageMessage = this.generateAgeMessage(name, age, gender);
    if (ageMessage && daysUntil <= 7) {
      return {
        message: ageMessage,
        emoji: '🌟',
        type: 'age_milestone'
      };
    }

    // Скоро день рождения
    const upcomingMessage = this.generateUpcomingMessage(name, daysUntil);
    if (upcomingMessage) {
      return {
        message: upcomingMessage,
        emoji: daysUntil <= 7 ? '🎁' : '📅',
        type: 'upcoming'
      };
    }

    return null;
  }

  public getNextBirthday(birthDate: string): { date: Date; daysLeft: number } {
    const daysLeft = this.getDaysUntilBirthday(birthDate);
    const nextBirthday = new Date();
    nextBirthday.setDate(nextBirthday.getDate() + daysLeft);
    
    return {
      date: nextBirthday,
      daysLeft
    };
  }

  public getZodiacSign(birthDate: string): { sign: string; emoji: string; description: string } {
    const birth = new Date(birthDate);
    const month = birth.getMonth() + 1;
    const day = birth.getDate();

    const signs = [
      { sign: 'Козерог', emoji: '♑', description: 'Практичный и целеустремленный', start: [12, 22], end: [1, 19] },
      { sign: 'Водолей', emoji: '♒', description: 'Независимый и оригинальный', start: [1, 20], end: [2, 18] },
      { sign: 'Рыбы', emoji: '♓', description: 'Чувствительный и творческий', start: [2, 19], end: [3, 20] },
      { sign: 'Овен', emoji: '♈', description: 'Энергичный и смелый', start: [3, 21], end: [4, 19] },
      { sign: 'Телец', emoji: '♉', description: 'Надежный и терпеливый', start: [4, 20], end: [5, 20] },
      { sign: 'Близнецы', emoji: '♊', description: 'Общительный и любознательный', start: [5, 21], end: [6, 20] },
      { sign: 'Рак', emoji: '♋', description: 'Заботливый и эмоциональный', start: [6, 21], end: [7, 22] },
      { sign: 'Лев', emoji: '♌', description: 'Щедрый и уверенный', start: [7, 23], end: [8, 22] },
      { sign: 'Дева', emoji: '♍', description: 'Аккуратный и внимательный', start: [8, 23], end: [9, 22] },
      { sign: 'Весы', emoji: '♎', description: 'Справедливый и гармоничный', start: [9, 23], end: [10, 22] },
      { sign: 'Скорпион', emoji: '♏', description: 'Страстный и решительный', start: [10, 23], end: [11, 21] },
      { sign: 'Стрелец', emoji: '♐', description: 'Оптимистичный и свободолюбивый', start: [11, 22], end: [12, 21] }
    ];

    for (const zodiac of signs) {
      const [startMonth, startDay] = zodiac.start;
      const [endMonth, endDay] = zodiac.end;
      
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return {
          sign: zodiac.sign,
          emoji: zodiac.emoji,
          description: zodiac.description
        };
      }
    }

    return signs[0]; // fallback
  }
}

export const birthdayAI = new BirthdayAI();