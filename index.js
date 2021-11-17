const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');

const TOKEN = '2137519723:AAGJMfIrzmakXY4HTsOg3idUuKkxPTGqQ1k';
const BOT_LINK = 't.me/edmonDantes_bot.';

const bot = new TelegramApi(TOKEN, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Сейчас я загадаю число от 0 до 9, а ты попробуй его отгадать!`
  );

  const randomNumber = Math.floor(Math.random() * 10);

  chats[chatId] = randomNumber;

  await bot.sendMessage(chatId, 'Отгадывай!', gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Начальное привествие' },
    { command: '/info', description: 'Получить информацию о пользователе' },
    { command: '/game', description: 'Играть в игру "Угадай число"' },
  ]);

  bot.on('message', async (msg) => {
    const text = msg.text;

    const chatId = msg.chat.id;

    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.ru/_/stickers/cdb/d29/cdbd2943-5c75-34c3-a339-bf6e9b524b53/9.webp'
      );
      return bot.sendMessage(
        chatId,
        'Добро пожаловать в телеграм бот автора Arsen Temurian!'
      );
    }

    if (text === '/info') {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}, твой ник ${msg.from.username}!`
      );
    }

    if (text === '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(
      chatId,
      'Я тебя не понимаю, по-моему ты болеешь...('
    );
  });

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return startGame(chatId);
    }

    if (data == chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Поздравляю! Ты отгадал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `Ты не отгадал, бот загадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
