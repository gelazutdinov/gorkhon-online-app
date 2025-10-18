'''
Business: API для управления системными сообщениями и их получения
Args: event - dict с httpMethod, body, queryStringParameters
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с сообщениями или статусом операции
'''

import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor
from pywebpush import webpush, WebPushException

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def send_push_notification(title: str, body: str, url: str = '/') -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT id, endpoint, p256dh_key, auth_key
        FROM push_subscriptions
        WHERE is_active = TRUE
    """)
    
    subscriptions = cur.fetchall()
    
    vapid_private_key = os.environ.get('VAPID_PRIVATE_KEY', '')
    vapid_public_key = os.environ.get('VAPID_PUBLIC_KEY', 'BFGk7fINvW4s0HJwYIU9Z8Y8vBcBqVqG5X7-8RY3fvNz9XH8LkWj3YQ7_K5vH8fN9jK7vL8wM9xN6vK5jH8gF4s')
    
    notification_data = {
        'title': title,
        'body': body,
        'icon': 'https://cdn.poehali.dev/files/dbf46829-41e3-4fcf-956e-f6c84fb50dc3.png',
        'url': url,
        'tag': 'system-notification'
    }
    
    sent_count = 0
    failed_count = 0
    
    for sub in subscriptions:
        try:
            subscription_info = {
                'endpoint': sub['endpoint'],
                'keys': {
                    'p256dh': sub['p256dh_key'],
                    'auth': sub['auth_key']
                }
            }
            
            webpush(
                subscription_info=subscription_info,
                data=json.dumps(notification_data),
                vapid_private_key=vapid_private_key,
                vapid_claims={
                    'sub': 'mailto:support@gorkhon.online',
                    'aud': sub['endpoint'].split('/')[2]
                }
            )
            
            cur.execute("""
                UPDATE push_subscriptions 
                SET last_notification_at = CURRENT_TIMESTAMP 
                WHERE id = %s
            """, (sub['id'],))
            
            sent_count += 1
            
        except WebPushException as e:
            failed_count += 1
            
            if e.response and e.response.status_code in [404, 410]:
                cur.execute("""
                    UPDATE push_subscriptions 
                    SET is_active = FALSE 
                    WHERE id = %s
                """, (sub['id'],))
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'sentCount': sent_count,
        'failedCount': failed_count,
        'totalSubscriptions': len(subscriptions)
    }

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    # GET: получить все сообщения
    if method == 'GET':
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, text, created_at 
            FROM t_p59180819_gorkhon_online_app.system_messages 
            ORDER BY created_at DESC
        """)
        
        messages = []
        for row in cur.fetchall():
            messages.append({
                'id': str(row['id']),
                'text': row['text'],
                'timestamp': row['created_at'].isoformat()
            })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'messages': messages}),
            'isBase64Encoded': False
        }
    
    # POST: создать новое сообщение (только для админа)
    if method == 'POST':
        headers = event.get('headers', {})
        admin_token = headers.get('X-Admin-Token', headers.get('x-admin-token', ''))
        
        # Простая проверка админского токена
        if admin_token != 'admin2024':
            return {
                'statusCode': 403,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Unauthorized'}),
                'isBase64Encoded': False
            }
        
        body_data = json.loads(event.get('body', '{}'))
        message_text = body_data.get('text', '').strip()
        
        if not message_text:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Message text is required'}),
                'isBase64Encoded': False
            }
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO t_p59180819_gorkhon_online_app.system_messages (text) 
            VALUES (%s) 
            RETURNING id, text, created_at
        """, (message_text,))
        
        result = cur.fetchone()
        conn.commit()
        
        new_message = {
            'id': str(result['id']),
            'text': result['text'],
            'timestamp': result['created_at'].isoformat()
        }
        
        cur.close()
        conn.close()
        
        push_result = send_push_notification(
            title='Системное сообщение',
            body=message_text,
            url='/'
        )
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': new_message,
                'pushNotification': push_result
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