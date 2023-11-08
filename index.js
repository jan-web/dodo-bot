const {gameOptions, againOptions} = require('./options');

const TelegramBot = require('node-telegram-bot-api');

const token = '6517506234:AAF7kALC8uFDrpmdZ4y67RMjrzwPcl620-Q';

const chats = {};





const start = () => {
  const bot = new TelegramBot(token, {
    polling: true
  });

  const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен её отгадать`);
    const randomNumber = Math.floor(Math.random()*10).toString();
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Отгадай`, gameOptions)
  }

  bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Получить информацию о пользователе'},
    {command: '/game', description: 'Игра - Угадай число'}

  ])

  bot.on('message',  async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    console.log('text ', text, 'chatId', chatId);
    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/8eb/10f/8eb10f4b-8f4f-4958-aa48-80e7af90470a/5.webp')
      return bot.sendMessage(chatId, 'Добро пожаловать в чат-бот DoDo')

    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} with username ${msg.from.username}`)
    }

    if (text === '/game') {
      return startGame(chatId);
    }

    bot.sendMessage(chatId, `ты написал мне ${text}`)
    return bot.sendMessage(chatId, `Я тебя не понимаю. Попробуй еще раз`);
  })

  bot.on('callback_query', msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if(data === '/again') {
      return startGame(chatId);
    }
    if(data === chats[chatId]) {
     return bot.sendMessage(chatId,`Поздравляю ты отгадал цифру ${chats[chatId]}`, againOptions)
    } else {
     return bot.sendMessage(chatId,`К сожалению ты не отгадал, бот загадал число ${chats[chatId]}`, againOptions)

    }
  })
}

start ();