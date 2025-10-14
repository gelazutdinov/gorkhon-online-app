'''
Business: API для управления системными сообщениями и их получения
Args: event - dict с httpMethod, body, queryStringParameters
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с сообщениями или статусом операции
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
            FROM system_messages 
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
            INSERT INTO system_messages (text) 
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
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': new_message}),
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
