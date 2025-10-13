/**
 * Рекомендательная система на основе истории взаимодействий пользователя
 * Использует локальное хранилище для персонализации контента
 */

export interface UserInteraction {
  sectionId: string;
  sectionName: string;
  timestamp: number;
  interactionType: 'view' | 'click' | 'long_view';
}

export interface RecommendationScore {
  sectionId: string;
  score: number;
  reason: 'frequent' | 'recent' | 'trending' | 'related';
}

const STORAGE_KEY = 'gorkhon_user_interactions';
const MAX_INTERACTIONS = 100;
const RECENT_THRESHOLD = 7 * 24 * 60 * 60 * 1000; // 7 дней

// Веса для различных типов взаимодействий
const INTERACTION_WEIGHTS = {
  view: 1,
  click: 3,
  long_view: 5,
};

// Веса для причин рекомендаций
const REASON_WEIGHTS = {
  frequent: 1.5,
  recent: 2.0,
  trending: 1.2,
  related: 1.3,
};

/**
 * Получить историю взаимодействий из localStorage
 */
export const getInteractions = (): UserInteraction[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Ошибка загрузки истории:', error);
    return [];
  }
};

/**
 * Сохранить взаимодействие пользователя
 */
export const saveInteraction = (
  sectionId: string,
  sectionName: string,
  interactionType: 'view' | 'click' | 'long_view' = 'view'
): void => {
  try {
    const interactions = getInteractions();
    const newInteraction: UserInteraction = {
      sectionId,
      sectionName,
      timestamp: Date.now(),
      interactionType,
    };

    // Добавляем новое взаимодействие и ограничиваем размер массива
    const updatedInteractions = [newInteraction, ...interactions].slice(0, MAX_INTERACTIONS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInteractions));
  } catch (error) {
    console.error('Ошибка сохранения взаимодействия:', error);
  }
};

/**
 * Рассчитать частоту взаимодействий с разделом
 */
const calculateFrequencyScore = (sectionId: string, interactions: UserInteraction[]): number => {
  const sectionInteractions = interactions.filter(i => i.sectionId === sectionId);
  
  let score = 0;
  sectionInteractions.forEach(interaction => {
    score += INTERACTION_WEIGHTS[interaction.interactionType] || 1;
  });
  
  return score;
};

/**
 * Рассчитать давность последнего взаимодействия
 */
const calculateRecencyScore = (sectionId: string, interactions: UserInteraction[]): number => {
  const sectionInteractions = interactions.filter(i => i.sectionId === sectionId);
  
  if (sectionInteractions.length === 0) return 0;
  
  const latestInteraction = Math.max(...sectionInteractions.map(i => i.timestamp));
  const timeDiff = Date.now() - latestInteraction;
  
  // Чем свежее взаимодействие, тем выше оценка
  if (timeDiff < RECENT_THRESHOLD) {
    return (RECENT_THRESHOLD - timeDiff) / RECENT_THRESHOLD * 10;
  }
  
  return 0;
};

/**
 * Определить трендовые разделы (популярные в последние дни)
 */
const calculateTrendingScore = (sectionId: string, allInteractions: UserInteraction[]): number => {
  const recentInteractions = allInteractions.filter(
    i => Date.now() - i.timestamp < 3 * 24 * 60 * 60 * 1000 // 3 дня
  );
  
  const sectionRecentCount = recentInteractions.filter(i => i.sectionId === sectionId).length;
  const totalRecentCount = recentInteractions.length;
  
  if (totalRecentCount === 0) return 0;
  
  return (sectionRecentCount / totalRecentCount) * 10;
};

/**
 * Найти связанные разделы на основе совместных просмотров
 */
const findRelatedSections = (sectionId: string, interactions: UserInteraction[]): string[] => {
  // Найти сессии, где просматривался данный раздел
  const sessionsWithSection = new Set<number>();
  interactions.forEach(interaction => {
    if (interaction.sectionId === sectionId) {
      // Группируем взаимодействия в 5-минутные окна как "сессии"
      const sessionId = Math.floor(interaction.timestamp / (5 * 60 * 1000));
      sessionsWithSection.add(sessionId);
    }
  });

  // Найти другие разделы в этих сессиях
  const relatedCounts = new Map<string, number>();
  interactions.forEach(interaction => {
    const sessionId = Math.floor(interaction.timestamp / (5 * 60 * 1000));
    if (sessionsWithSection.has(sessionId) && interaction.sectionId !== sectionId) {
      relatedCounts.set(
        interaction.sectionId,
        (relatedCounts.get(interaction.sectionId) || 0) + 1
      );
    }
  });

  // Вернуть топ связанных разделов
  return Array.from(relatedCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => id);
};

/**
 * Получить персонализированные рекомендации
 */
export const getRecommendations = (
  availableSections: string[],
  limit: number = 3
): RecommendationScore[] => {
  const interactions = getInteractions();
  
  if (interactions.length === 0) {
    // Если истории нет, вернуть дефолтные рекомендации
    return availableSections.slice(0, limit).map(id => ({
      sectionId: id,
      score: 1,
      reason: 'trending' as const,
    }));
  }

  const scores = new Map<string, { total: number; reasons: Set<string> }>();

  availableSections.forEach(sectionId => {
    let totalScore = 0;
    const reasons = new Set<string>();

    // Частота использования
    const frequencyScore = calculateFrequencyScore(sectionId, interactions);
    if (frequencyScore > 0) {
      totalScore += frequencyScore * REASON_WEIGHTS.frequent;
      reasons.add('frequent');
    }

    // Недавность использования
    const recencyScore = calculateRecencyScore(sectionId, interactions);
    if (recencyScore > 0) {
      totalScore += recencyScore * REASON_WEIGHTS.recent;
      reasons.add('recent');
    }

    // Трендовость
    const trendingScore = calculateTrendingScore(sectionId, interactions);
    if (trendingScore > 0) {
      totalScore += trendingScore * REASON_WEIGHTS.trending;
      reasons.add('trending');
    }

    scores.set(sectionId, { total: totalScore, reasons });
  });

  // Добавить связанные разделы для часто используемых
  const topSections = Array.from(scores.entries())
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 2)
    .map(([id]) => id);

  topSections.forEach(topSectionId => {
    const related = findRelatedSections(topSectionId, interactions);
    related.forEach(relatedId => {
      if (availableSections.includes(relatedId)) {
        const current = scores.get(relatedId) || { total: 0, reasons: new Set() };
        current.total += 5 * REASON_WEIGHTS.related;
        current.reasons.add('related');
        scores.set(relatedId, current);
      }
    });
  });

  // Сортировка и формирование результата
  return Array.from(scores.entries())
    .map(([sectionId, { total, reasons }]) => ({
      sectionId,
      score: total,
      reason: (reasons.has('recent') ? 'recent' : 
               reasons.has('frequent') ? 'frequent' : 
               reasons.has('related') ? 'related' : 
               'trending') as RecommendationScore['reason'],
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

/**
 * Получить текст причины рекомендации
 */
export const getReasonText = (reason: RecommendationScore['reason']): string => {
  const texts = {
    frequent: 'Вы часто здесь бываете',
    recent: 'Вы недавно смотрели',
    trending: 'Популярно сейчас',
    related: 'Может быть интересно',
  };
  return texts[reason];
};

/**
 * Очистить старую историю (старше 30 дней)
 */
export const cleanOldInteractions = (): void => {
  try {
    const interactions = getInteractions();
    const threshold = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const filtered = interactions.filter(i => i.timestamp > threshold);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Ошибка очистки истории:', error);
  }
};

/**
 * Экспорт статистики для аналитики
 */
export const getInteractionStats = () => {
  const interactions = getInteractions();
  const sectionCounts = new Map<string, number>();
  
  interactions.forEach(i => {
    sectionCounts.set(i.sectionId, (sectionCounts.get(i.sectionId) || 0) + 1);
  });

  return {
    totalInteractions: interactions.length,
    uniqueSections: sectionCounts.size,
    mostViewed: Array.from(sectionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => ({ sectionId: id, count })),
  };
};
