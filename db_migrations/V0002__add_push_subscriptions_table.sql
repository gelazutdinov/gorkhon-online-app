-- Создаем таблицу для хранения Web Push подписок
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  user_agent TEXT,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_notification_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Индекс для быстрого поиска по user_id
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);

-- Индекс для активных подписок
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_active ON push_subscriptions(is_active) WHERE is_active = true;
