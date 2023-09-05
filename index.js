const TelegramBot = require('node-telegram-bot-api');
const token = '6034033651:AAEgAKMJFoam1NdLSApB9ynBUck3NJJJKAk';

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Store user states and current sequences
const userStates = {};

// Command handling
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Hello! Mava start cheddama.');
});

bot.onText(/\/get/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!userStates[userId] || !userStates[userId].running) {
    bot.sendMessage(chatId, 'Sequence is not running. Please use /get <number> to start.');
  } else {
    bot.sendMessage(chatId, 'The sequence generation is ongoing. Please wait or send /stop.');
  }
});

bot.onText(/\/stop/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (userStates[userId] && userStates[userId].running) {
    userStates[userId].running = false;
    bot.sendMessage(chatId, 'Ok broh, I will stop.');
  } else {
    bot.sendMessage(chatId, 'Sequence is not running.');
  }
});

bot.onText(/\/get (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const startNumber = parseInt(match[1]);

  if (!isNaN(startNumber)) {
    if (!userStates[userId] || !userStates[userId].running) {
      generateSequence(chatId, userId, startNumber);
    } else {
      bot.sendMessage(chatId, 'The sequence generation is ongoing. Please wait or send /stop.');
    }
  } else {
    bot.sendMessage(chatId, 'Invalid number format. Please use /get <number>.');
  }
});

// Generate and send the next sequence number
function generateNextSequence(chatId, userId) {
  userStates[userId].currentSequence++;
  bot.sendMessage(chatId, '/get ' + userStates[userId].currentSequence);
}

// Generate and send the sequence
function generateSequence(chatId, userId, startNumber) {
  userStates[userId] = {
    running: true,
    currentSequence: startNumber,
  };

  const interval = setInterval(() => {
    if (!userStates[userId] || !userStates[userId].running) {
      clearInterval(interval);
    } else {
      generateNextSequence(chatId, userId);
    }
  }, 5000); // Generate a new number every 5 seconds
}
