// 🚀 TELEGRAM BOT SERVER для отправки личных уведомлений
// Создано специально для админ панели

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// База подписчиков (в production используйте настоящую БД)
let subscribers = new Set();
let botToken = '';

// 📝 ЛОГИРОВАНИЕ
const log = (message, data = '') => {
  console.log(`[${new Date().toISOString()}] ${message}`, data);
};

// ✅ ПРОВЕРКА ЗДОРОВЬЯ СЕРВЕРА
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    subscribers: subscribers.size,
    botConfigured: !!botToken 
  });
});

// 🔧 НАСТРОЙКА БОТА
app.post('/api/bot/config', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Токен обязателен' });
    }

    // Проверяем токен
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await response.json();
    
    if (!data.ok) {
      return res.status(400).json({ error: 'Неверный токен бота' });
    }

    botToken = token;
    log('✅ Бот настроен:', data.result.username);
    
    // Настраиваем webhook для автоматического сбора подписчиков
    await setupWebhook(token);
    
    res.json({ 
      success: true, 
      botInfo: data.result,
      subscribersCount: subscribers.size 
    });
  } catch (error) {
    log('❌ Ошибка настройки бота:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 📬 ОТПРАВКА УВЕДОМЛЕНИЙ ВСЕМ ПОДПИСЧИКАМ
app.post('/api/notifications/send', async (req, res) => {
  try {
    const { title, message, type } = req.body;
    
    if (!botToken) {
      return res.status(400).json({ error: 'Бот не настроен' });
    }

    if (!title || !message) {
      return res.status(400).json({ error: 'Заголовок и сообщение обязательны' });
    }

    const fullMessage = `🔔 *${title}*\n\n${message}`;
    const results = [];

    // Отправляем всем подписчикам
    for (const chatId of subscribers) {
      try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: fullMessage,
            parse_mode: 'Markdown'
          })
        });

        const data = await response.json();
        
        if (data.ok) {
          results.push({ chatId, status: 'sent' });
        } else {
          // Если пользователь заблокировал бота - удаляем из подписчиков
          if (data.error_code === 403) {
            subscribers.delete(chatId);
            log(`🗑️ Удален заблокировавший пользователь: ${chatId}`);
          }
          results.push({ chatId, status: 'failed', error: data.description });
        }
      } catch (err) {
        results.push({ chatId, status: 'error', error: err.message });
      }
    }

    log(`📤 Уведомление отправлено: ${results.filter(r => r.status === 'sent').length}/${subscribers.size}`);
    
    res.json({ 
      success: true, 
      sent: results.filter(r => r.status === 'sent').length,
      total: subscribers.size,
      results 
    });
  } catch (error) {
    log('❌ Ошибка отправки:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 👥 ПОЛУЧЕНИЕ СТАТИСТИКИ ПОДПИСЧИКОВ
app.get('/api/subscribers', (req, res) => {
  res.json({ 
    count: subscribers.size,
    subscribers: Array.from(subscribers) 
  });
});

// 🎯 WEBHOOK для автоматического добавления подписчиков
app.post('/webhook', (req, res) => {
  try {
    const update = req.body;
    
    if (update.message) {
      const chatId = update.message.chat.id;
      const username = update.message.from.username || update.message.from.first_name;
      
      // Добавляем нового подписчика
      if (!subscribers.has(chatId)) {
        subscribers.add(chatId);
        log(`➕ Новый подписчик: ${username} (${chatId})`);
        
        // Отправляем приветственное сообщение
        sendWelcomeMessage(chatId, username);
      }
    }
    
    res.sendStatus(200);
  } catch (error) {
    log('❌ Ошибка webhook:', error.message);
    res.sendStatus(200);
  }
});

// 👋 ПРИВЕТСТВЕННОЕ СООБЩЕНИЕ
async function sendWelcomeMessage(chatId, username) {
  if (!botToken) return;
  
  const welcomeText = `👋 Привет, ${username}!\n\n🔔 Вы подписались на уведомления!\nТеперь вы будете получать все важные новости.`;
  
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: welcomeText
      })
    });
  } catch (error) {
    log('❌ Ошибка приветствия:', error.message);
  }
}

// 🔗 НАСТРОЙКА WEBHOOK
async function setupWebhook(token) {
  // В production здесь будет реальный URL
  const webhookUrl = `${process.env.SERVER_URL || 'http://localhost:3001'}/webhook`;
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl })
    });
    
    const data = await response.json();
    log('🔗 Webhook настроен:', webhookUrl);
  } catch (error) {
    log('❌ Ошибка webhook:', error.message);
  }
}

// 🚀 ЗАПУСК СЕРВЕРА
app.listen(PORT, () => {
  log(`🚀 Telegram сервер запущен на порту ${PORT}`);
  log(`📋 Доступные endpoints:`);
  log(`   • GET  /health - проверка сервера`);
  log(`   • POST /api/bot/config - настройка бота`);
  log(`   • POST /api/notifications/send - отправка уведомлений`);
  log(`   • GET  /api/subscribers - статистика подписчиков`);
});

module.exports = app;