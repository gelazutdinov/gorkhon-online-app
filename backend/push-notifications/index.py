'''
Business: API для регистрации подписчиков и отправки push-уведомлений
Args: event - dict с httpMethod, body для регистрации токенов
      context - объект с атрибутами request_id
Returns: HTTP response dict со статусом регистрации
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    # POST: регистрация нового подписчика
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        push_token = body_data.get('pushToken', '').strip()
        user_info = body_data.get('userInfo', {})
        
        if not push_token:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Push token is required'}),
                'isBase64Encoded': False
            }
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Используем ON CONFLICT для обновления существующего токена
        cur.execute("""
            INSERT INTO notification_subscribers (push_token, user_info, is_active) 
            VALUES (%s, %s, TRUE)
            ON CONFLICT (push_token) 
            DO UPDATE SET 
                user_info = EXCLUDED.user_info,
                is_active = TRUE,
                subscribed_at = CURRENT_TIMESTAMP
            RETURNING id
        """, (push_token, json.dumps(user_info)))
        
        result = cur.fetchone()
        conn.commit()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'subscriberId': str(result['id'])
            }),
            'isBase64Encoded': False
        }
    
    # GET: получить статистику подписчиков
    if method == 'GET':
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT 
                COUNT(*) as total_subscribers,
                COUNT(*) FILTER (WHERE is_active = TRUE) as active_subscribers
            FROM notification_subscribers
        """)
        
        stats = cur.fetchone()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'totalSubscribers': stats['total_subscribers'],
                'activeSubscribers': stats['active_subscribers']
            }),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
