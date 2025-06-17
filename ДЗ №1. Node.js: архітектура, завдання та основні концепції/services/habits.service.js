import {
  getAll,
  create,
  remove,
  update,
  getById,
} from '../models/habits.model.js';
import { getHabitStats } from '../utils/getStats.js';

const printHabits = async () => {
  try {
    const allHabits = await getAll();
    console.table(allHabits);
  } catch (error) {
    console.log(error);
  }
};

const printHabitDoneStatistic = async () => {
  try {
    const allHabits = await getAll();
    const habitsDoneStatistics = getHabitStats(allHabits);

    habitsDoneStatistics.forEach((h) => {
      console.log(`• ${h.name} (${h.freq}): ${h.percent}% complete for period`);
    });
  } catch (error) {
    console.log(error);
  }
};

const addHabit = async (newHabit) => {
  await create(newHabit);
  console.log(
    `✅ Habit added: "${newHabit.name}" [${newHabit.freq.toLowerCase()}]`
  );
};

const updateHabit = async (updatedHabit) => {
  const { id } = updatedHabit;
  const existHabit = await getById(id);

  if (!existHabit) {
    console.log(`🧨 habit were not found`);
    return;
  }

  await update(id, updatedHabit);
  console.log(
    `✅ Habit updated: "${
      updatedHabit.name
    }" [${updatedHabit.freq.toLowerCase()}]`
  );
};

const removeHabit = async (habitId) => {
  await remove(habitId);
};

const fulfillHabit = async (habitId) => {
  const existHabit = await getById(habitId);

  if (!existHabit) {
    console.log(`🧨 habit were not found`);
    return;
  }

  const updatedHabbit = {
    ...existHabit,
    done: [...existHabit.done, new Date()],
  };
  await update(habitId, updatedHabbit);
};

export {
  printHabits,
  addHabit,
  removeHabit,
  fulfillHabit,
  updateHabit,
  printHabitDoneStatistic,
};
