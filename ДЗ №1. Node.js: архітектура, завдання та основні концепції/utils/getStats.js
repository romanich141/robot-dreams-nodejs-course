import { cfg } from '../config/index.js';

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);

  return result;
};


export const getHabitStats = (habits) => {
  const now = addDays(new Date(), cfg.dayOffset);
  const getLastNDays = (n) => {
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

    const isDailyHabit = freq === 'daily';
    const isWeeklyHabit = freq === 'weekly';
    const isMonthlyHabit = freq === 'monthly';

    if (isDailyHabit) {
      const today = now.toISOString().slice(0, 10);
      percent = doneDays.has(today) ? 100 : 0;
    } 
    
    if (isWeeklyHabit) {
      const last7Days = getLastNDays(7);
      const completed = last7Days.filter((day) => doneDays.has(day)).length;
      percent = Math.round((completed / 7) * 100);
    } 
    
    if (isMonthlyHabit) {
      const last30Days = getLastNDays(30);
      const completed = last30Days.filter((day) => doneDays.has(day)).length;
      percent = Math.round((completed / 30) * 100);
    }

    return { name, freq, percent };
  });
};
