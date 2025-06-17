import {
  printHabits,
  addHabit,
  removeHabit,
  fulfillHabit,
  updateHabit,
  printHabitDoneStatistic,
} from '../services/habits.service.js';
import {
  askRemoveHabitId,
  askHabitDetails,
  showPrompt,
  closeProgram,
  handleInput,
  startProgram,
  askDoneHabitId,
  askUpdateHabitDetails,
} from '../services/comands.service.js';

startProgram();

handleInput({
  onHandleInput: async (line) => {
    const input = line.trim();
    const [command] = input.split(' ');

    switch (command) {
      case 'list': {
        await printHabits();
        showPrompt();
        break;
      }
      case 'add': {
        askHabitDetails({
          onDone: ({ name, freq }) => addHabit({ name, freq }),
        });

        break;
      }
      case 'remove': {
        askRemoveHabitId({
          onDone: (habitId) => removeHabit(habitId),
        });

        break;
      }

      case 'done': {
        askDoneHabitId({
          onDone: (habitId) => fulfillHabit(habitId),
        });

        break;
      }

      case 'update': {
        askUpdateHabitDetails({
          onDone: (habitDetail) => updateHabit(habitDetail),
        });

        break;
      }

      case 'stats': {
        await printHabitDoneStatistic();
        showPrompt();

        break;
      }

      case 'exit':
        closeProgram();

        break;
      default:
        console.log(`Unknown command: "${command}". Type "help" for a list.`);
    }

    showPrompt();
  },
});
