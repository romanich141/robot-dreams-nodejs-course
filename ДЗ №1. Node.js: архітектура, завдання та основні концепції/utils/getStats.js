import { cfg } from '../config/index.js';

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);

  return result;
};

export const getHabitStats = (habits) => {
  const now = addDays(new Date(), cfg.dayOffset); // cfg.dayOffset);
  // Генеруємо масив дат (у форматі YYYY-MM-DD) для заданої кількості днів назад, включаючи сьогодні
  function getLastNDays(n) {
    return Array.from({ length: n }, (_, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() - i);

      return date.toISOString().slice(0, 10);
    });
  }

  return habits.map((habit) => {
    const { name, freq, done } = habit;
    const doneDays = new Set((done || []).map((d) => d.slice(0, 10)));
    let percent = 0;

    if (freq === 'daily') {
      // Тільки сьогоднішній день
      const today = now.toISOString().slice(0, 10);
      percent = doneDays.has(today) ? 100 : 0;
    } else if (freq === 'weekly') {
      // За 7 днів
      const last7Days = getLastNDays(7);
      const completed = last7Days.filter((day) => doneDays.has(day)).length;
      percent = Math.round((completed / 7) * 100);
    } else if (freq === 'monthly') {
      // За 30 днів
      const last30Days = getLastNDays(30);
      const completed = last30Days.filter((day) => doneDays.has(day)).length;
      percent = Math.round((completed / 30) * 100);
    }

    return { name, freq, percent };
  });
};
