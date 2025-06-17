import readline from 'readline';

export const commands = [
  'list',
  'add',
  'remove',
  'done',
  'update',
  'stats',
  'exit',
];
const validFreqs = ['daily', 'weekly', 'monthly'];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'my-habits-tracker> ',
  completer: (line) => {
    const hits = commands.filter((cmd) => cmd.startsWith(line));

    return [hits.length ? hits : commands, line];
  },
});

rl.on('close', () => {
  process.exit(0);
});

const showPrompt = () => {
  rl.prompt();
};

const askHabitDetails = ({ onDone }) => {
  rl.question('Enter habit name: ', (habitName) => {
    const askFreq = async () => {
      rl.question(
        'Enter frequency (daily/weekly/monthly): ',
        async (habitFreq) => {
          const isValidHabitFraq = validFreqs.includes(habitFreq.toLowerCase());
          if (!isValidHabitFraq) {
            console.log(
              '❌ Invalid frequency! Please type daily, weekly, or monthly.'
            );
            return askFreq();
          }

          await onDone({ name: habitName, freq: habitFreq });
          rl.prompt();
        }
      );
    };
    askFreq();
  });
};

const askRemoveHabitId = ({ onDone }) => {
  const askHabitId = async () => {
    rl.question('Enter habit id: ', async (habitId) => {
      if (!habitId.trim().length) {
        console.log('❌ Invalid id! Please correct');
        return askHabitId();
      }

      await onDone(habitId);
      rl.prompt();
    });
  };
  askHabitId();
};

const askUpdateHabitDetails = ({ onDone }) => {
  const askHabitId = async () => {
    rl.question('Enter habit id which you want update: ', async (habitId) => {
      if (!habitId.trim().length) {
        console.log('❌ Invalid id! Please correct');
        return askHabitId();
      }

      askHabitDetails({
        onDone: async ({ name: habitName, freq: habitFreq }) => {
          await onDone({ id: habitId, name: habitName, freq: habitFreq });
        },
      });

      rl.prompt();
    });
  };
  askHabitId();
};

const askDoneHabitId = ({ onDone }) => {
  const askHabitId = async () => {
    rl.question(
      'Enter habit id which you want mark as done: ',
      async (habitId) => {
        if (!habitId.trim().length) {
          console.log('❌ Invalid id! Please correct');
          return askHabitId();
        }

        await onDone(habitId);
        rl.prompt();
      }
    );
  };

  askHabitId();
};

const startProgram = () => {
  showPrompt();
};

const closeProgram = () => {
  console.log('👋 Goodbye!');
  rl.close();
};

const handleInput = ({ onHandleInput }) => {
  rl.on('line', onHandleInput);
};

export {
  startProgram,
  showPrompt,
  askHabitDetails,
  askRemoveHabitId,
  closeProgram,
  handleInput,
  askDoneHabitId,
  askUpdateHabitDetails,
};
