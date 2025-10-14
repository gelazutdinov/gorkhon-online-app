-- Создание таблицы системных сообщений
CREATE TABLE system_messages (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы подписчиков на уведомления
CREATE TABLE notification_subscribers (
    id SERIAL PRIMARY KEY,
    push_token TEXT NOT NULL UNIQUE,
    user_info JSONB,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_notification_sent TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Индексы для производительности
CREATE INDEX idx_system_messages_created_at ON system_messages(created_at DESC);
CREATE INDEX idx_subscribers_active ON notification_subscribers(is_active) WHERE is_active = TRUE;

-- Вставка первого сообщения о запуске системного чата
INSERT INTO system_messages (text) VALUES 
('🎉 Добро пожаловать в системный чат Горхон.Online!

Теперь все важные новости и объявления будут приходить прямо в приложение. 

📱 Чтобы получать уведомления на телефон, разрешите отправку push-уведомлений в настройках браузера.

💬 Следите за новостями — мы будем держать вас в курсе всех событий!');